// db.js - TAM DOSYA İÇERİĞİ

const { Pool } = require('pg');

// Bu loglar, Render'daki deploy sürecinde bize bilgi verecek.
console.log("--- Veritabanı Havuzu (Pool) Oluşturuluyor ---");
console.log(`DATABASE_URL ortam değişkeni var mı?: ${!!process.env.DATABASE_URL}`);

const pool = new Pool({
    // Render, bu ortam değişkenini otomatik olarak sağlar.
    connectionString: process.env.DATABASE_URL,
    
    // --- EN ÖNEMLİ DEĞİŞİKLİK BURADA ---
    // Render gibi platformlarda güvenli (SSL) bağlantı kurmak için bu ayar gereklidir.
    ssl: {
        rejectUnauthorized: false
    }
});

// Bağlantı havuzunda bir hata olursa, loglara yazdır.
pool.on('error', (err, client) => {
    console.error('Veritabanı havuzunda beklenmedik bir hata oluştu:', err);
    process.exit(-1);
});

console.log("Veritabanı havuzu başarıyla yapılandırıldı.");

module.exports = pool;