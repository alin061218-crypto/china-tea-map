const express = require('express');
const { body, param } = require('express-validator');
const { getDb } = require('../db/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { success, fail } = require('../utils/response');

const router = express.Router();

// 数组或 JSON 字符串 → 存库 JSON 字符串（null 兜底）
function toJson(value, fallback = null) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'string') {
    try { return JSON.stringify(JSON.parse(value)); } catch (e) { return value; }
  }
  return JSON.stringify(value);
}

// 所有路由都需要管理员权限
router.use(authMiddleware, adminMiddleware);

// GET /api/admin/stats - 获取后台统计数据
router.get('/stats', (req, res) => {
  const db = getDb();
  const teaCount = db.prepare('SELECT COUNT(*) as count FROM teas').get().count;
  const teaCityCount = db.prepare("SELECT COUNT(DISTINCT city) as count FROM teas WHERE is_mountain = 0").get().count;
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const favoriteCount = db.prepare('SELECT COUNT(*) as count FROM favorites').get().count;
  const checkinCount = db.prepare('SELECT COUNT(*) as count FROM checkins').get().count;
  const mountainCount = db.prepare('SELECT COUNT(*) as count FROM teas WHERE is_mountain = 1').get().count;

  res.json(success({
    stats: {
      totalTeas: teaCount,
      teaCities: teaCityCount,
      mountainAreas: mountainCount,
      totalUsers: userCount,
      totalFavorites: favoriteCount,
      totalCheckins: checkinCount,
    },
  }));
});

// ===== 茶叶管理 CRUD =====

// GET /api/admin/teas - 获取所有茶叶（含山脉标记）
router.get('/teas', (req, res) => {
  const db = getDb();
  const teas = db.prepare('SELECT * FROM teas ORDER BY is_mountain ASC, province, city').all();
  res.json(success({ teas, total: teas.length }));
});

// GET /api/admin/teas/:id - 获取单个茶叶
router.get('/teas/:id', validate([
  param('id').isInt().withMessage('茶叶 ID 无效'),
]), (req, res) => {
  const db = getDb();
  const tea = db.prepare('SELECT * FROM teas WHERE id = ?').get(req.params.id);
  if (!tea) return res.status(404).json(fail('未找到该茶叶信息'));
  res.json(success({ tea }));
});

// POST /api/admin/teas - 新增茶叶
router.post('/teas', validate([
  body('name').trim().notEmpty().withMessage('茶名称不能为空'),
  body('province').trim().notEmpty().withMessage('省份不能为空'),
  body('latitude').isFloat({ min: 18, max: 54 }).withMessage('纬度范围 18-54'),
  body('longitude').isFloat({ min: 73, max: 135 }).withMessage('经度范围 73-135'),
]), (req, res) => {
  const db = getDb();
  const b = req.body;
  const { name, province, city, latitude, longitude, category, maturity_months, seasons, local_characteristics, appearance, history, spirit, meaning, image_url, is_mountain } = b;
  const category_en = b.category_en || null;
  const brewing_temp = b.brewing_temp || null;
  const brewing_time = b.brewing_time || null;
  const story = b.story || null;
  const checkin_spots = toJson(b.checkin_spots);
  const modern_forms = toJson(b.modern_forms);
  const beverage_chain = b.beverage_chain || null;
  const slug = b.slug || name;

  const result = db.prepare(`
    INSERT INTO teas (name, province, city, latitude, longitude, category, category_en, maturity_months, seasons, local_characteristics, appearance, history, spirit, meaning, image_url, is_mountain, brewing_temp, brewing_time, story, checkin_spots, modern_forms, beverage_chain, slug)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(name, province, city || null, latitude, longitude, category || null, category_en, maturity_months || null, seasons || null, local_characteristics || null, appearance || null, history || null, spirit || null, meaning || null, image_url || null, is_mountain || 0, brewing_temp, brewing_time, story, checkin_spots, modern_forms, beverage_chain, slug);

  const tea = db.prepare('SELECT * FROM teas WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(success({ tea }, '茶叶信息已添加'));
});

// PUT /api/admin/teas/:id - 更新茶叶
router.put('/teas/:id', validate([
  param('id').isInt().withMessage('茶叶 ID 无效'),
]), (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM teas WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json(fail('未找到该茶叶信息'));

  const b = req.body;
  const { name, province, city, latitude, longitude, category, maturity_months, seasons, local_characteristics, appearance, history, spirit, meaning, image_url, is_mountain } = b;

  db.prepare(`
    UPDATE teas SET name=?, province=?, city=?, latitude=?, longitude=?, category=?, category_en=?, maturity_months=?, seasons=?, local_characteristics=?, appearance=?, history=?, spirit=?, meaning=?, image_url=?, is_mountain=?, brewing_temp=?, brewing_time=?, story=?, checkin_spots=?, modern_forms=?, beverage_chain=?, slug=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).run(
    name || existing.name, province || existing.province, city !== undefined ? city : existing.city,
    latitude || existing.latitude, longitude || existing.longitude,
    category !== undefined ? category : existing.category,
    b.category_en !== undefined ? b.category_en : existing.category_en,
    maturity_months !== undefined ? maturity_months : existing.maturity_months,
    seasons !== undefined ? seasons : existing.seasons,
    local_characteristics !== undefined ? local_characteristics : existing.local_characteristics,
    appearance !== undefined ? appearance : existing.appearance,
    history !== undefined ? history : existing.history,
    spirit !== undefined ? spirit : existing.spirit,
    meaning !== undefined ? meaning : existing.meaning,
    image_url !== undefined ? image_url : existing.image_url,
    is_mountain !== undefined ? is_mountain : existing.is_mountain,
    b.brewing_temp !== undefined ? b.brewing_temp : existing.brewing_temp,
    b.brewing_time !== undefined ? b.brewing_time : existing.brewing_time,
    b.story !== undefined ? b.story : existing.story,
    b.checkin_spots !== undefined ? toJson(b.checkin_spots, existing.checkin_spots) : existing.checkin_spots,
    b.modern_forms !== undefined ? toJson(b.modern_forms, existing.modern_forms) : existing.modern_forms,
    b.beverage_chain !== undefined ? b.beverage_chain : existing.beverage_chain,
    b.slug !== undefined ? b.slug : (existing.slug || name),
    req.params.id
  );

  const tea = db.prepare('SELECT * FROM teas WHERE id = ?').get(req.params.id);
  res.json(success({ tea }, '茶叶信息已更新'));
});

// DELETE /api/admin/teas/:id - 删除茶叶
router.delete('/teas/:id', validate([
  param('id').isInt().withMessage('茶叶 ID 无效'),
]), (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM teas WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json(fail('未找到该茶叶信息'));

  db.prepare('DELETE FROM favorites WHERE tea_id = ?').run(req.params.id);
  db.prepare('DELETE FROM teas WHERE id = ?').run(req.params.id);
  res.json(success(null, '茶叶信息已删除'));
});

// ===== 用户管理 =====

// GET /api/admin/users - 获取所有用户
router.get('/users', (req, res) => {
  const db = getDb();
  const users = db.prepare('SELECT id, username, email, role, avatar, created_at FROM users ORDER BY created_at DESC').all();
  res.json(success({ users, total: users.length }));
});

// GET /api/admin/users/:id - 获取单个用户详情
router.get('/users/:id', validate([
  param('id').isInt().withMessage('用户 ID 无效'),
]), (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT id, username, email, role, avatar, created_at FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json(fail('未找到该用户'));

  const favorites = db.prepare('SELECT COUNT(*) as count FROM favorites WHERE user_id = ?').get(req.params.id).count;
  const checkins = db.prepare('SELECT COUNT(*) as count FROM checkins WHERE user_id = ?').get(req.params.id).count;

  res.json(success({ user, favorites, checkins }));
});

// PUT /api/admin/users/:id - 修改用户信息/角色
router.put('/users/:id', validate([
  param('id').isInt().withMessage('用户 ID 无效'),
  body('role').optional().isIn(['user', 'admin']).withMessage('角色只能是 user 或 admin'),
]), (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json(fail('未找到该用户'));

  const { role } = req.body;

  if (role) {
    db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, req.params.id);
  }

  const user = db.prepare('SELECT id, username, email, role, avatar, created_at FROM users WHERE id = ?').get(req.params.id);
  res.json(success({ user }, '用户信息已更新'));
});

// DELETE /api/admin/users/:id - 删除用户
router.delete('/users/:id', validate([
  param('id').isInt().withMessage('用户 ID 无效'),
]), (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json(fail('未找到该用户'));

  if (existing.role === 'admin') {
    const adminCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin'").get().count;
    if (adminCount <= 1) return res.status(400).json(fail('不能删除唯一的管理员账户'));
  }

  db.prepare('DELETE FROM checkins WHERE user_id = ?').run(req.params.id);
  db.prepare('DELETE FROM favorites WHERE user_id = ?').run(req.params.id);
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json(success(null, '用户已删除'));
});

module.exports = router;
