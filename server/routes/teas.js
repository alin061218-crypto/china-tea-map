const express = require('express');
const { param } = require('express-validator');
const { getDb } = require('../db/database');
const { validate } = require('../middleware/validate');
const { success, fail } = require('../utils/response');

const router = express.Router();

// 后端行 → 前端字段映射（snake_case → camelCase，JSON 字段解析为数组）
function parseJson(str, fallback) {
  if (!str) return fallback;
  try { return JSON.parse(str); } catch (e) { return fallback; }
}

function mapTea(row) {
  return {
    // 前端以 slug（字符串 id）为 key：图片路径 /images/tea/{categoryEn}/{id}.jpg 与
    // modernTea 工具的产品 id（${tea.id}__${brand}__${product}）都依赖它
    id: row.slug || String(row.id),
    name: row.name,
    province: row.province,
    city: row.city,
    latitude: row.latitude,
    longitude: row.longitude,
    category: row.category,
    categoryEn: row.category_en,
    maturity_months: row.maturity_months,
    seasons: row.seasons,
    meaning: row.meaning,
    brewingTemp: row.brewing_temp,
    brewingTime: row.brewing_time,
    story: row.story,
    checkinSpots: parseJson(row.checkin_spots, []),
    modern_forms: parseJson(row.modern_forms, []),
    beverage_chain: row.beverage_chain,
    image_url: row.image_url,
    is_mountain: row.is_mountain,
  };
}

// GET /api/teas - 获取全部茶品
router.get('/', (req, res) => {
  const db = getDb();
  const teas = db.prepare('SELECT * FROM teas ORDER BY province, city').all().map(mapTea);
  res.json(success({ teas, total: teas.length }));
});

// GET /api/teas/stats/cities - 获取统计数据
router.get('/stats/cities', (req, res) => {
  const db = getDb();
  const cities = db.prepare('SELECT COUNT(DISTINCT city) as count FROM teas WHERE is_mountain = 0').get();
  const total = db.prepare('SELECT COUNT(*) as count FROM teas WHERE is_mountain = 0').get();
  res.json(success({ teaCities: cities.count, totalTeas: total.count }));
});

// GET /api/teas/season/:season - 按季节获取茶品
router.get('/season/:season', validate([
  param('season').isIn(['春', '夏', '秋', '冬', 'spring', 'summer', 'autumn', 'winter']).withMessage('无效的季节'),
]), (req, res) => {
  const db = getDb();
  const { season } = req.params;
  const teas = db.prepare('SELECT * FROM teas WHERE seasons LIKE ? ORDER BY province').all(`%${season}%`).map(mapTea);
  res.json(success({ teas, total: teas.length }));
});

// GET /api/teas/month/:month - 按月份获取茶品
router.get('/month/:month', validate([
  param('month').isInt({ min: 1, max: 12 }).withMessage('月份必须是 1-12 的整数'),
]), (req, res) => {
  const db = getDb();
  const { month } = req.params;
  const teas = db.prepare('SELECT * FROM teas WHERE maturity_months LIKE ? ORDER BY province').all(`%${month}%`).map(mapTea);
  res.json(success({ teas, total: teas.length }));
});

// GET /api/teas/:id - 获取单个茶品详情（支持数字 id 或 slug）
router.get('/:id', (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const row = db.prepare('SELECT * FROM teas WHERE slug = ? OR id = ?').get(id, Number(id) || -1);
  if (!row) {
    return res.status(404).json(fail('未找到该茶品信息'));
  }
  res.json(success({ tea: mapTea(row) }));
});

module.exports = router;
