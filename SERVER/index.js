// index.js (server klasöründe)
require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5001; // Port'u .env'den al, yoksa 5001 kullan

app.get('/api', (req, res) => {
    res.json({ message: "Lifestyle Matchmaker API'sine hoş geldiniz!" });
});

app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});