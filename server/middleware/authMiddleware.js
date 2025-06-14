// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Token yok veya formatı geçersiz, yetkilendirme reddedildi' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // payload'u (içinde userId var) isteğe ekle
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token geçerli değil' });
  }
};