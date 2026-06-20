const express = require('express');
const { getDb } = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// POST /api/favorites - 添加收藏
router.post('/', authMiddleware, (req, res) => {
  const db = getDb();
  const { tea_id } = req.body;
  const user_id = req.user.id;

  const tea = db.prepare('SELECT id FROM teas WHERE id = ?').get(tea_id);
  if (!tea) {
    return res.status(404).json({ error: '茶叶信息不存在' });
  }

  const existing = db.prepare('SELECT id FROM favorites WHERE user_id = ? AND tea_id = ?').get(user_id, tea_id);
  if (existing) {
    return res.status(400).json({ error: '已经收藏过了' });
  }

  db.prepare('INSERT INTO favorites (user_id, tea_id) VALUES (?, ?)').run(user_id, tea_id);
  res.status(201).json({ message: '收藏成功' });
});

// DELETE /api/favorites/:teaId - 取消收藏
router.delete('/:teaId', authMiddleware, (req, res) => {
  const db = getDb();
  const user_id = req.user.id;
  const tea_id = req.params.teaId;

  const result = db.prepare('DELETE FROM favorites WHERE user_id = ? AND tea_id = ?').run(user_id, tea_id);
  if (result.changes === 0) {
    return res.status(404).json({ error: '未找到该收藏' });
  }
  res.json({ message: '已取消收藏' });
});

// GET /api/favorites - 获取用户收藏列表
router.get('/', authMiddleware, (req, res) => {
  const db = getDb();
  const user_id = req.user.id;

  const favorites = db.prepare(`
    SELECT t.*, f.created_at as favorited_at
    FROM favorites f
    JOIN teas t ON f.tea_id = t.id
    WHERE f.user_id = ?
    ORDER BY f.created_at DESC
  `).all(user_id);

  res.json({ favorites });
});

// GET /api/favorites/check/:teaId - 检查是否已收藏
router.get('/check/:teaId', authMiddleware, (req, res) => {
  const db = getDb();
  const user_id = req.user.id;
  const tea_id = req.params.teaId;

  const fav = db.prepare('SELECT id FROM favorites WHERE user_id = ? AND tea_id = ?').get(user_id, tea_id);
  res.json({ isFavorited: !!fav });
});

module.exports = router;
