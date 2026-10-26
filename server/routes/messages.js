const express = require('express');
const { body } = require('express-validator');
const { getDb } = require('../db/database');
const { validate } = require('../middleware/validate');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { success, fail } = require('../utils/response');

const router = express.Router();

// GET /api/messages - 茶友留墨列表（倒序，最新在前）
router.get('/', (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM messages ORDER BY id DESC LIMIT 100').all();
  res.json(success({ messages: rows, total: rows.length }));
});

// POST /api/messages - 落墨一条留言
router.post('/', validate([
  body('nickname').trim().isLength({ min: 1, max: 20 }).withMessage('昵称需 1-20 字'),
  body('content').trim().isLength({ min: 1, max: 200 }).withMessage('留言需 1-200 字'),
]), (req, res) => {
  const db = getDb();
  const nickname = String(req.body.nickname || '').trim().slice(0, 20);
  const content = String(req.body.content || '').trim().slice(0, 200);
  const teaId = req.body.tea_id ? Number(req.body.tea_id) : null;
  const teaName = req.body.tea_name ? String(req.body.tea_name).slice(0, 20) : null;

  if (!nickname || !content) {
    return res.status(400).json(fail('昵称与留言不能为空'));
  }

  const info = db.prepare(
    'INSERT INTO messages (nickname, content, tea_id, tea_name) VALUES (?, ?, ?, ?)'
  ).run(nickname, content, teaId, teaName);

  const row = db.prepare('SELECT * FROM messages WHERE id = ?').get(info.lastInsertRowid);
  res.json(success({ message: row }, '留墨已落纸'));
});

// DELETE /api/messages/:id —— 管理员删除留言
router.delete('/:id', authMiddleware, adminMiddleware, (req, res) => {
  const db = getDb();
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json(fail('留言 id 无效'));
  }
  const existing = db.prepare('SELECT id FROM messages WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json(fail('留言不存在或已被删除'));
  }
  db.prepare('DELETE FROM messages WHERE id = ?').run(id);
  res.json(success({ id }, '已删除'));
});

module.exports = router;
