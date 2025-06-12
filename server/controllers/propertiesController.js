const pool = require('../db');

const getAllProperties = async (req, res) => {
    // 1. Gelen tüm filtreleri ve sayfalama parametrelerini al
    const { 
        page = 1, limit = 12, search, maxPrice, minBeds, property_type, min_square_meters,
        has_pool, has_fireplace, budget, priority 
    } = req.query;

    const whereClauses = [];
    const queryValues = [];
    let paramIndex = 1;

    // WHERE koşulları (Değişiklik yok)
    if (search) { whereClauses.push(`(title ILIKE $${paramIndex} OR address ILIKE $${paramIndex})`); queryValues.push(`%${search}%`); paramIndex++; }
    if (maxPrice && Number(maxPrice) > 0) { whereClauses.push(`price <= $${paramIndex}`); queryValues.push(parseInt(maxPrice, 10)); paramIndex++; }
    if (minBeds && Number(minBeds) > 0) { whereClauses.push(`bedrooms >= $${paramIndex}`); queryValues.push(parseInt(minBeds, 10)); paramIndex++; }
    if (property_type && property_type !== 'Any') { whereClauses.push(`property_type = $${paramIndex}`); queryValues.push(property_type); paramIndex++; }
    if (min_square_meters && Number(min_square_meters) > 0) { whereClauses.push(`square_meters >= $${paramIndex}`); queryValues.push(parseInt(min_square_meters, 10)); paramIndex++; }
    if (has_pool === 'true') { whereClauses.push(`has_pool = true`); }
    if (has_fireplace === 'true') { whereClauses.push(`has_fireplace = true`); }

    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    try {
        const totalQuery = `SELECT COUNT(*) FROM properties ${whereString}`;
        const totalResult = await pool.query(totalQuery, queryValues);
        const totalProperties = parseInt(totalResult.rows[0].count, 10);
        
        const offset = (page - 1) * limit;
        const propertiesQueryValues = [...queryValues, limit, offset];
        const propertiesQuery = `SELECT * FROM properties ${whereString} ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
        const { rows: properties } = await pool.query(propertiesQuery, propertiesQueryValues);

        // --- SKORLAMA BÖLÜMÜNDE GÜNCELLEME ---
        const scoredProperties = properties.map(prop => {
            // Başlangıç skoru olarak veritabanındaki skoru (varsa) veya genel bir puanı alalım.
            // Bu, hiçbir filtre olmadığında bile bir başlangıç değeri olmasını sağlar.
            let score = (prop.walk_score || 0) * 0.3 + (prop.school_rating || 0) * 2; // Temel konum ve okul skoru
            
            const userBudget = Number(budget) || Number(maxPrice) || 0;

            // Eğer kullanıcı bir bütçe girdiyse, fiyat skorunu ekle
            if (userBudget > 0 && prop.price <= userBudget) {
                 // Fiyata dayalı skoru ekle (0-50 arası)
                score += 50 * (1 - (userBudget - prop.price) / userBudget);
            }

            // Diğer özellik puanlarını ekle
            if (minBeds && prop.bedrooms >= Number(minBeds)) score += 10;
            if (prop.square_meters > 100) score += 5;
            if (prop.square_meters > 200) score += 10;
            if (prop.has_pool && has_pool === 'true') score += 15;
            if (prop.has_fireplace && has_fireplace === 'true') score += 10;
            if (prop.year_built > 2020) score += 5;

            // Önceliklere göre bonus puanlar
            if (priority === 'price' && userBudget > 0 && prop.price < userBudget * 0.9) score *= 1.1;
            if (priority === 'location' && prop.walk_score > 80) score *= 1.1;
            
            // Sonucu 0-100 arasına sığdır
            return { ...prop, ideality_score: Math.min(100, Math.round(score)) };
        });
        
        const sortedProperties = scoredProperties.sort((a, b) => b.ideality_score - a.ideality_score);
        
        res.json({
            properties: sortedProperties,
            pagination: {
                currentPage: parseInt(page, 10),
                totalPages: Math.ceil(totalProperties / limit),
                totalProperties: totalProperties,
            }
        });

    } catch (err) {
        console.error("Controller'da emlak verileri alınırken hata:", err.message, err.stack);
        res.status(500).json({ error: "Sunucu hatası." });
    }
};

module.exports = {
    getAllProperties
};