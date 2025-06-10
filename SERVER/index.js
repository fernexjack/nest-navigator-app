// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

// Rota dosyalarını import et
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const favoriteRoutes = require('./routes/favorites'); // YENİ

const app = express();
const PORT = process.env.PORT || 5001;

// ARA YAZILIMLAR (MIDDLEWARE)
app.use(cors());
app.use(express.json());

// API ROTALARI
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/favorites', favoriteRoutes); // YENİ

// Veritabanı test rotası
app.get('/api/db-test', async (req, res) => {
  try {
    const data = await db.query('SELECT NOW()');
    res.json({ message: "Veritabanı bağlantısı başarılı!", dbTime: data.rows[0].now });
  } catch (err) {
    console.error("VERİTABANI TEST HATASI:", err);
    res.status(500).json({ error: "Veritabanı bağlantısında bir sorun oluştu." });
  }
});

// Sunucuyu dinlemeye başla
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});