const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const { initDb, getDb } = require('./db/database');
const errorHandler = require('./middleware/errorHandler');

async function start() {
  // 1. Initialize database
  try {
    console.log('📦 正在初始化数据库...');
    await initDb();
    console.log('📦 数据库已就绪');
  } catch (err) {
    console.error('数据库初始化失败:', err.message);
  }

  // 2. Auto-seed when the tea table is empty
  try {
    const db = getDb();
    const teaCount = db.prepare('SELECT COUNT(*) as count FROM teas').get();
    console.log('📊 当前茶数据:', teaCount?.count ?? 'unknown');
    if (!teaCount || teaCount.count === 0) {
      const { seed } = require('./db/seed');
      seed();
      console.log('🌱 自动导入种子数据');
    }
  } catch (err) {
    console.error('种子数据检查失败:', err.message);
  }

  // 3. Create Express app
  const app = express();
  // 禁用 ETag：避免浏览器对 API 响应做 304 缓存协商（axios 拿到空响应体导致前端回退静态数据）
  app.disable('etag');

  // 4. Global middleware
  app.use(cors({ origin: config.corsOrigins, credentials: true }));
  app.use(express.json());

  // 5. API routes
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/teas', require('./routes/teas'));
  app.use('/api/favorites', require('./routes/favorites'));
  app.use('/api/checkins', require('./routes/checkins'));
  app.use('/api/admin', require('./routes/admin'));
  app.use('/api/messages', require('./routes/messages'));

  // 6. Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 7. Serve built frontend when available
  if (fs.existsSync(config.clientDist)) {
    app.use(express.static(config.clientDist));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(config.clientDist, 'index.html'));
    });
    console.log('📦 前端静态文件已启用:', config.clientDist);
  }

  // 8. Global error handler
  app.use(errorHandler);

  // 9. Start server
  app.listen(config.port, () => {
    console.log(`🍵 茶韵中国 API 服务启动: http://localhost:${config.port}`);
  });
}

start().catch(err => {
  console.error('服务启动失败:', err);
  process.exit(1);
});
