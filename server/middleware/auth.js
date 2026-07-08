const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config');

function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '请先登录' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: '登录已过期，请重新登录' });
  }
}

function adminMiddleware(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: '需要管理员权限' });
  }
  next();
}

module.exports = { generateToken, authMiddleware, adminMiddleware, JWT_SECRET: jwtSecret };
