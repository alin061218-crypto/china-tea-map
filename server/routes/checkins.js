const express = require('express');
const { body, param } = require('express-validator');
const { getDb } = require('../db/database');
const { authMiddleware } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { success, fail } = require('../utils/response');

const router = express.Router();

// POST /api/checkins - 打卡
router.post('/', authMiddleware, validate([
  body('city_name').trim().notEmpty().withMessage('城市名不能为空'),
]), (req, res) => {
  const db = getDb();
  const { city_name } = req.body;
  const user_id = req.user.id;

  const existing = db.prepare('SELECT id FROM checkins WHERE user_id = ? AND city_name = ?').get(user_id, city_name.trim());
  if (existing) {
    return res.status(400).json(fail('该城市已经打卡过了'));
  }

  db.prepare('INSERT INTO checkins (user_id, city_name) VALUES (?, ?)').run(user_id, city_name.trim());
  res.status(201).json(success(null, '打卡成功'));
});

// GET /api/checkins - 获取用户打卡列表
router.get('/', authMiddleware, (req, res) => {
  const db = getDb();
  const user_id = req.user.id;

  const checkins = db.prepare('SELECT * FROM checkins WHERE user_id = ? ORDER BY created_at DESC').all(user_id);
  res.json(success({ checkins }));
});

// DELETE /api/checkins/:id - 删除打卡记录
router.delete('/:id', authMiddleware, validate([
  param('id').isInt().withMessage('打卡记录 ID 无效'),
]), (req, res) => {
  const db = getDb();
  const user_id = req.user.id;

  const result = db.prepare('DELETE FROM checkins WHERE id = ? AND user_id = ?').run(req.params.id, user_id);
  if (result.changes === 0) {
    return res.status(404).json(fail('未找到该打卡记录'));
  }
  res.json(success(null, '已删除打卡记录'));
});

module.exports = router;
