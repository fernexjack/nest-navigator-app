// routes/auth.js (TAM VE DÜZELTİLMİŞ HALİ)

const router = require('express').Router(); // <-- EKSİK OLAN SATIR BUYDU!
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// KULLANICI KAYIT ENDPOINT'İ
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await db.query('SELECT * FROM users WHERE user_email = $1', [email]);
    if (user.rows.length > 0) {
      return res.status(409).json({ error: "Bu e-posta adresi zaten kullanılıyor." });
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await db.query(
      'INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashedPassword]
    );
    const payload = { userId: newUser.rows[0].user_id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (err) {
    console.error("Kayıt Hatası:", err.message);
    res.status(500).json({ error: "Sunucu hatası, lütfen tekrar deneyin." });
  }
});

// KULLANICI GİRİŞ ENDPOINT'İ (DEBUG KODLARI İLE)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- DEBUG BAŞLANGIÇ ---
    console.log("--- YENİ GİRİŞ İSTEĞİ ---");
    console.log("Gelen E-posta:", email);
    console.log("Gelen Şifre:", password);
    // --- DEBUG SONU ---

    const user = await db.query('SELECT * FROM users WHERE user_email = $1', [email]);

    // --- DEBUG BAŞLANGIÇ ---
    if (user.rows.length === 0) {
      console.log("DURUM: Kullanıcı veritabanında bulunamadı.");
    } else {
      console.log("DURUM: Kullanıcı bulundu. Şifre karşılaştırılacak.");
      console.log("Veritabanındaki Hash'lenmiş Şifre:", user.rows[0].user_password);
    }
    // --- DEBUG SONU ---

    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Geçersiz e-posta veya şifre." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.rows[0].user_password);

    // --- DEBUG BAŞLANGIÇ ---
    console.log("Şifreler Eşleşiyor mu? (isPasswordValid):", isPasswordValid);
    console.log("--------------------------");
    // --- DEBUG SONU ---

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Geçersiz e-posta veya şifre." });
    }
    
    const payload = { userId: user.rows[0].user_id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });

  } catch (err) {
    console.error("Giriş Hatası:", err.message);
    res.status(500).json({ error: "Sunucu hatası, lütfen tekrar deneyin." });
  }
});

module.exports = router;