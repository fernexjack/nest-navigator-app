// server/index.js - GEÇİCİ AMA KESİN ÇÖZÜM

const express = require('express');
const cors = require('cors');

// dotenv'i sadece 'production' olmayan ortamlarda çalıştır.
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Rotalarınızı import edin
const propertiesRoutes = require('./routes/properties');
const authRoutes = require('./routes/auth');
const favoritesRoutes = require('./routes/favorites');

const app = express();
const PORT = process.env.PORT || 5001;

// --- EN ÖNEMLİ DEĞİŞİKLİK ---
// Ortam değişkenini okumayı denemek yerine, izin verilecek adresleri
// DOĞRUDAN KODUN İÇİNE YAZIYORUZ.
const allowedOrigins = [
    'http://localhost:3000',                      // Yerel geliştirme için
    'https://nest-navigator-app.vercel.app'       // Vercel'deki frontend için
];

const corsOptions = {
    origin: function (origin, callback) {
        // Eğer gelen isteğin origin'i izin verilenler listesindeyse veya
        // origin yoksa (Postman gibi araçlar için), izin ver.
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());


// Rota tanımlamaları (debug-env'i artık silebiliriz)
app.get('/', (req, res) => {
    res.send('Nest Navigator API is running with hardcoded CORS!');
});

app.use('/api/properties', propertiesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Sunucu, ${PORT} portunda çalışıyor. CORS manuel olarak ayarlandı.`);
});