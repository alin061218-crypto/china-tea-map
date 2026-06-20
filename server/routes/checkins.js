const express = require('express');
const { getDb } = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// POST /api/checkins - 打卡
router.post('/', authMiddleware, (req, res) => {
  const db = getDb();
  const { city_name } = req.body;
  const user_id = req.user.id;

  if (!city_name || !city_name.trim()) {
    return res.status(400).json({ error: '请输入城市名称' });
  }

  // 检查是否已经打卡过
  const existing = db.prepare('SELECT id FROM checkins WHERE user_id = ? AND city_name = ?').get(user_id, city_name.trim());
  if (existing) {
    return res.status(400).json({ error: '该城市已经打卡过了' });
  }

  db.prepare('INSERT INTO checkins (user_id, city_name) VALUES (?, ?)').run(user_id, city_name.trim());
  res.status(201).json({ message: '打卡成功' });
});

// GET /api/checkins - 获取用户打卡列表
router.get('/', authMiddleware, (req, res) => {
  const db = getDb();
  const user_id = req.user.id;

  const checkins = db.prepare('SELECT * FROM checkins WHERE user_id = ? ORDER BY created_at DESC').all(user_id);
  res.json({ checkins });
});

// DELETE /api/checkins/:id - 删除打卡记录
router.delete('/:id', authMiddleware, (req, res) => {
  const db = getDb();
  const user_id = req.user.id;

  const result = db.prepare('DELETE FROM checkins WHERE id = ? AND user_id = ?').run(req.params.id, user_id);
  if (result.changes === 0) {
    return res.status(404).json({ error: '未找到该打卡记录' });
  }
  res.json({ message: '已删除打卡记录' });
});

module.exports = router;
