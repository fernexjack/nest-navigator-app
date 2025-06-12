// server/routes/favorites.js (EN GÜVENLİ VE TEMİZ HALİ)
const router = require('express').Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Favori ilanların TÜM DETAYLARINI getirir.
router.get('/details', async (req, res) => {
  try {
    const userId = req.user.userId;
    const sqlQuery = `
      SELECT p.* 
      FROM properties AS p
      INNER JOIN favorites AS f ON p.property_id = f.property_id
      WHERE f.user_id = $1
      ORDER BY f.created_at DESC`;
      
    const { rows } = await db.query(sqlQuery, [userId]);
    res.json(rows);
  } catch (err) {
    console.error("Favori detayları alınırken hata:", err.message);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// Sadece favori ilanların ID'lerini getirir.
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { rows } = await db.query('SELECT property_id FROM favorites WHERE user_id = $1', [userId]);
    res.json(rows.map(fav => fav.property_id));
  } catch (err) { 
    res.status(500).send('Sunucu Hatası');
  }
});

// Yeni bir favori ekler.
router.post('/', async (req, res) => {
  try {
    const { propertyId } = req.body;
    const userId = req.user.userId;
    const { rows } = await db.query('INSERT INTO favorites (user_id, property_id) VALUES ($1, $2) RETURNING *', [userId, propertyId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ msg: 'Bu ilan zaten favorilerinizde.' });
    console.error("Favori eklenirken hata:", err);
    res.status(500).send('Sunucu Hatası');
  }
});

// Bir favoriyi siler.
router.delete('/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user.userId;
    const result = await db.query('DELETE FROM favorites WHERE user_id = $1 AND property_id = $2', [userId, propertyId]);
    if (result.rowCount === 0) return res.status(404).json({ msg: 'Silinecek favori bulunamadı.' });
    res.json({ msg: 'Favori silindi.' });
  } catch (err) {
    console.error("Favori silinirken hata:", err);
    res.status(500).send('Sunucu Hatası');
  }
});

module.exports = router;