const { getDb, initDb } = require('./database');

const teas = require('./seeds/teas.json');

function seed() {
  const db = getDb();

  // Clear existing data
  db.prepare('DELETE FROM checkins').run();
  db.prepare('DELETE FROM favorites').run();
  db.prepare('DELETE FROM teas').run();
  db.prepare('DELETE FROM users WHERE role != ?').run('admin');

  const insert = db.prepare(`
    INSERT INTO teas (name, province, city, latitude, longitude, category, maturity_months, seasons, local_characteristics, appearance, history, spirit, meaning, image_url, is_mountain)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((teas) => {
    for (const tea of teas) {
      insert.run(
        tea.name, tea.province, tea.city, tea.latitude, tea.longitude,
        tea.category, tea.maturity_months, tea.seasons, tea.local_characteristics,
        tea.appearance, tea.history, tea.spirit, tea.meaning, tea.image_url, tea.is_mountain
      );
    }
  });

  insertMany(teas);
  console.log(`✅ 已导入 ${teas.length} 条茶叶数据`);

  // Create default admin user (password: admin123)
  const bcrypt = require('bcryptjs');
  const adminPwd = bcrypt.hashSync('admin123', 10);
  const existingAdmin = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
  if (!existingAdmin) {
    db.prepare('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)').run('admin', 'admin@teayun.cn', adminPwd, 'admin');
    console.log('✅ 已创建管理员账户: admin / admin123');
  } else {
    console.log('ℹ️  管理员账户已存在');
  }
}

// Run directly
if (require.main === module) {
  (async () => {
    await initDb();
    seed();
    console.log('🌱 种子数据导入完成！');
  })();
}

module.exports = { seed, teas };
