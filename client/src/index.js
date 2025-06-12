// server/index.js - TAM DOSYA İÇERİĞİ

const express = require('express');
const cors = require('cors');
// .env dosyasındaki değişkenleri process.env'ye yükler
require('dotenv').config(); 

// Rotalarınızı import edin (dosya yollarını kendi projenize göre kontrol edin)

const app = express();
const PORT = process.env.PORT || 5001;

// --- GÜNCELLENMİŞ CORS AYARLARI ---
// Render'a ekleyeceğimiz CORS_ORIGIN değişkenini kullanır.
// Eğer o değişken yoksa (yerel geliştirme), localhost:3000'e izin verir.
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    optionsSuccessStatus: 200
};

// Middleware'leri ayarla
app.use(cors(corsOptions)); // Güncellenmiş cors ayarını kullan
app.use(express.json());   // Gelen isteklerin body'sini JSON olarak parse et

// Rota tanımlamaları
app.get('/', (req, res) => {
    res.send('Nest Navigator API is running!');
});

app.use('/api/properties', propertiesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes); // Favori rotan varsa


// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});