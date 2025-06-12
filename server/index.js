// server/index.js - YENİDEN HATA AYIKLAMA MODU

const express = require('express');
const cors = require('cors');
// .env'yi her zaman yükle, Render zaten kendi değişkenlerini önceliklendirir.
require('dotenv').config();

const propertiesRoutes = require('./routes/properties');
const authRoutes = require('./routes/auth');
const favoritesRoutes = require('./routes/favorites');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS ayarını en basit hale getirelim, sorunun bu olmadığından emin olalım.
app.use(cors()); 
app.use(express.json());

// --- YENİ HATA AYIKLAMA YOLU ---
app.get('/debug-env', (req, res) => {
    res.json({
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        // Bu sefer veritabanı URL'sinin ilk birkaç karakterini gösterelim
        DATABASE_URL_START: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 30) + '...' : null
    });
});

// Rota tanımlamaları
app.use('/api/properties', propertiesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);

app.listen(PORT, () => {
    console.log(`Sunucu, ${PORT} portunda çalışıyor. Debug modu aktif.`);
});