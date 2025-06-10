// server/routes/properties.js
const router = require('express').Router();
const db = require('../db'); // Veritabanı bağlantımızı kullanacağız

// TÜM EMLAKLARI GETİR (VERİTABANINDAN)
router.get('/', async (req, res) => {
  try {
    // Veritabanındaki tüm ilanları seç
    const properties = await db.query('SELECT * FROM properties');
    // Gelen veriyi (rows) JSON olarak döndür
    res.json(properties.rows);
  } catch (err) {
    console.error("Emlak verileri alınırken hata:", err.message);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// TEK BİR EVI ID'SİNE GÖRE GETİR (VERİTABANINDAN)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Belirtilen ID'ye sahip ilanı veritabanından seç
    const property = await db.query('SELECT * FROM properties WHERE property_id = $1', [id]);

    // Eğer sorgu bir sonuç döndürürse (en az bir satır varsa)
    if (property.rows.length > 0) {
      // İlk satırı (tek sonucu) JSON olarak döndür
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