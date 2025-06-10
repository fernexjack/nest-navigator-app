// server/routes/favorites.js
const router = require('express').Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Bu rotadaki tüm endpoint'ler artık authMiddleware'den geçecek.
router.use(authMiddleware);

// GİRİŞ YAPMIŞ KULLANICININ FAVORİLERİNİ GETİR
router.get('/', async (req, res) => {
  try {
    const favorites = await db.query(
      'SELECT property_id FROM favorites WHERE user_id = $1',
      [req.user.userId]
    );
    res.json(favorites.rows.map(fav => fav.property_id));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

// YENİ BİR FAVORİ EKLE
router.post('/', async (req, res) => {
  const { propertyId } = req.body;
  if (!propertyId) {
    return res.status(400).json({ msg: 'propertyId gereklidir.' });
  }
  try {
    const newFavorite = await db.query(
      'INSERT INTO favorites (user_id, property_id) VALUES ($1, $2) RETURNING *',
      [req.user.userId, propertyId]
    );
    res.status(201).json(newFavorite.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ msg: 'Bu ilan zaten favorilerinizde.' });
    }
    console.error(err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

// BİR FAVORİYİ SİL
router.delete('/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const deleteOp = await db.query(
      'DELETE FROM favorites WHERE user_id = $1 AND property_id = $2',
      [req.user.userId, propertyId]
    );
    if (deleteOp.rowCount === 0) {
      return res.status(404).json({ msg: 'Silinecek favori bulunamadı.' });
    }
    res.json({ msg: 'Favori silindi.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

module.exports = router;