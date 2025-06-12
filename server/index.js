// server/index.js - HATA AYIKLAMA VE KESİN ÇÖZÜM İÇİN GÜNCELLENDİ

const express = require('express');
const cors = require('cors');

// --- ÖNEMLİ DEĞİŞİKLİK ---
// dotenv'i sadece 'production' (canlı) olmayan ortamlarda çalıştır.
// Render, NODE_ENV'i otomatik olarak 'production' yapar.
// Bu, Render'ın kendi ortam değişkenlerinin öncelikli olmasını sağlar.
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Rotalarınızı import edin
const propertiesRoutes = require('./routes/properties');
const authRoutes = require('./routes/auth');
const favoritesRoutes = require('./routes/favorites');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS AYARLARI (Değişiklik yok, hala aynı mantık)
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// --- YENİ HATA AYIKLAMA YOLU ---
// Bu yol, sunucunun hangi ortam değişkenlerini gördüğünü bize gösterecek.
app.get('/debug-env', (req, res) => {
    res.json({
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        CORS_ORIGIN: process.env.CORS_ORIGIN,
        DATABASE_URL_IS_SET: !!process.env.DATABASE_URL, // Değeri değil, sadece var olup olmadığını gösterir
    });
});


// Rota tanımlamaları
app.get('/', (req, res) => {
    res.send('Nest Navigator API is running!');
});

app.use('/api/properties', propertiesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Sunucu, ${PORT} portunda başarıyla yeniden başlatıldı ve çalışıyor!`);
});