const express = require('express');
const router = express.Router();
const db = require('../db'); // Hala POST ve GET/:id için gerekli
const authMiddleware = require('../middleware/authMiddleware');

// --- CONTROLLER'DAN DOĞRU FONKSİYONU IMPORT EDİN ---
const { getAllProperties } = require('../controllers/propertiesController');

// --- GET /api/properties ---
// Artık tüm mantık 'getAllProperties' fonksiyonunda.
router.get('/', getAllProperties);


// --- POST /api/properties --- (Bu kısım aynı kalabilir, controller'a taşımak sonraki adım olabilir)
router.post('/', authMiddleware, async (req, res) => {
    const {
        title, description, price, address, city, state, zip_code, latitude, longitude, image_url,
        property_type, bedrooms, bathrooms, square_meters, lot_size_sqm, year_built,
        heating_type, cooling_type, parking_spots, stories,
        has_basement, has_fireplace, has_pool
    } = req.body;
    if (!title || !price) return res.status(400).json({ error: 'Zorunlu alanları doldurun.' });
    try {
        const newProperty = await db.query(
            `INSERT INTO properties (title, description, price, address, city, state, zip_code, latitude, longitude, image_url, property_type, bedrooms, bathrooms, square_meters, lot_size_sqm, year_built, heating_type, cooling_type, parking_spots, stories, has_basement, has_fireplace, has_pool) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23) RETURNING *`,
            [title, description, price, address, city, state, zip_code, latitude, longitude, image_url, property_type, bedrooms, bathrooms, square_meters, lot_size_sqm, year_built, heating_type, cooling_type, parking_spots, stories, has_basement, has_fireplace, has_pool]
        );
        res.status(201).json(newProperty.rows[0]);
    } catch (err) {
        console.error("Yeni ilan eklenirken hata:", err.message);
        res.status(500).json({ error: 'Sunucu hatası, ilan eklenemedi.' });
    }
});


// --- GET /api/properties/:id --- (Bu kısım da aynı kalabilir)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const property = await db.query('SELECT * FROM properties WHERE property_id = $1', [id]);
    if (property.rows.length > 0) {
      res.json(property.rows[0]);
    } else {
      res.status(404).json({ error: "İlan bulunamadı" });
    }
  } catch (err) {
    console.error(`ID'si ${req.params.id} olan emlak alınırken hata:`, err.message);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

module.exports = router;