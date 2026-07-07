const express = require('express');
const { getDb } = require('../db/database');

const router = express.Router();

// GET /api/teas - 获取全部茶品
router.get('/', (req, res) => {
  const db = getDb();
  const teas = db.prepare('SELECT * FROM teas ORDER BY province, city').all();
  res.json({ teas, total: teas.length });
});

// GET /api/teas/stats/cities - 获取统计数据
router.get('/stats/cities', (req, res) => {
  const db = getDb();
  const cities = db.prepare('SELECT COUNT(DISTINCT city) as count FROM teas WHERE is_mountain = 0').get();
  const total = db.prepare('SELECT COUNT(*) as count FROM teas WHERE is_mountain = 0').get();
  res.json({ teaCities: cities.count, totalTeas: total.count });
});

// GET /api/teas/season/:season - 按季节获取茶品
router.get('/season/:season', (req, res) => {
  const db = getDb();
  const { season } = req.params;
  const teas = db.prepare('SELECT * FROM teas WHERE seasons LIKE ? ORDER BY province').all(`%${season}%`);
  res.json({ teas, total: teas.length });
});

// GET /api/teas/month/:month - 按月份获取茶品
router.get('/month/:month', (req, res) => {
  const db = getDb();
  const { month } = req.params;
  const teas = db.prepare('SELECT * FROM teas WHERE maturity_months LIKE ? ORDER BY province').all(`%${month}%`);
  res.json({ teas, total: teas.length });
});

// GET /api/teas/:id - 获取单个茶品详情
router.get('/:id', (req, res) => {
  const db = getDb();
  const tea = db.prepare('SELECT * FROM teas WHERE id = ?').get(req.params.id);
  if (!tea) {
    return res.status(404).json({ error: '未找到该茶品信息' });
  }
  res.json({ tea });
});

module.exports = router;
