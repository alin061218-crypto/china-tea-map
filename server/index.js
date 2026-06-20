const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { initDb, getDb } = require('./db/database');

async function start() {
  // 初始化数据库
  await initDb();
  console.log('📦 数据库已就绪');

  // 自动填充种子数据（如果是空库）
  const db = getDb();
  const teaCount = db.prepare('SELECT COUNT(*) as count FROM teas').get();
  if (teaCount.count === 0) {
    const { seed } = require('./db/seed');
    seed();
    console.log('🌱 自动导入种子数据');
  }

  const authRoutes = require('./routes/auth');
  const teaRoutes = require('./routes/teas');
  const favoriteRoutes = require('./routes/favorites');
  const checkinRoutes = require('./routes/checkins');
  const adminRoutes = require('./routes/admin');

  const app = express();
  const PORT = process.env.PORT || 3001;

  // Middleware
  app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:4173', process.env.CLIENT_URL].filter(Boolean),
    credentials: true
  }));
  app.use(express.json());

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/teas', teaRoutes);
  app.use('/api/favorites', favoriteRoutes);
  app.use('/api/checkins', checkinRoutes);
  app.use('/api/admin', adminRoutes);

  // Serve static frontend in production
  if (process.env.NODE_ENV === 'production') {
    const clientDist = path.join(__dirname, '..', 'client', 'dist');
    app.use(express.static(clientDist));
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(clientDist, 'index.html'));
      }
    });
  }

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.listen(PORT, () => {
    console.log(`🍵 茶韵中国 API 服务启动: http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('服务启动失败:', err);
  process.exit(1);
});
