/**
 * 数据迁移脚本：将前端 demoTeas.js 的 36 条茶（含现代茶饮关联）对齐进后端 SQLite
 * - 保留现有 tea 行（按 name 匹配 UPDATE），仅补 INSERT 缺失条目
 * - 不清空 users / favorites / checkins
 * - 新增 7 字段 + slug（保留前端字符串 id，图片路径 /images/tea/{categoryEn}/{id}.jpg 复用）
 * 用法：node migrateFromDemo.js  （在 server 目录下执行）
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { getDb, initDb } = require('./database');

const DEMO_PATH = path.join(__dirname, '..', '..', 'client', 'src', 'data', 'demoTeas.js');

function loadDemoTeas() {
  const code = fs.readFileSync(DEMO_PATH, 'utf8')
    .replace('export const demoTeas', 'const demoTeas')
    + '\n;__demoTeas = demoTeas;';
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox.__demoTeas;
}

async function main() {
  await initDb();
  const db = getDb();
  // 避免与运行中的后端实例死锁：写操作最多等 8 秒
  if (db.pragma) {
    try { db.pragma('busy_timeout = 8000'); } catch (e) { /* sql.js 忽略 */ }
  }

  // 1. 检查现有列
  const columns = db.prepare('PRAGMA table_info(teas)').all().map((c) => c.name);
  const newColumns = [
    ['category_en', 'TEXT'],
    ['brewing_temp', 'TEXT'],
    ['brewing_time', 'TEXT'],
    ['story', 'TEXT'],
    ['checkin_spots', 'TEXT'],
    ['modern_forms', 'TEXT'],
    ['beverage_chain', 'TEXT'],
    ['slug', 'TEXT'],
  ];
  for (const [name, type] of newColumns) {
    if (!columns.includes(name)) {
      db.exec(`ALTER TABLE teas ADD COLUMN ${name} ${type}`);
      console.log('➕ 加列:', name);
    }
  }

  // 2. 读取 demo 36 条
  const demoTeas = loadDemoTeas();
  console.log(`📋 demoTeas.js 共 ${demoTeas.length} 条`);

  const insert = db.prepare(`
    INSERT INTO teas (name, province, city, latitude, longitude, category, category_en,
      maturity_months, seasons, meaning, brewing_temp, brewing_time, story,
      checkin_spots, modern_forms, beverage_chain, image_url, slug)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const update = db.prepare(`
    UPDATE teas SET province=?, city=?, latitude=?, longitude=?, category=?, category_en=?,
      maturity_months=?, seasons=?, meaning=?, brewing_temp=?, brewing_time=?, story=?,
      checkin_spots=?, modern_forms=?, beverage_chain=?, image_url=?, slug=?
    WHERE name=?
  `);

  let updated = 0;
  let inserted = 0;
  const syncAll = db.transaction(() => {
    for (const t of demoTeas) {
      const params = [
        t.province, t.city, t.latitude, t.longitude, t.category, t.categoryEn || null,
        t.maturity_months || null, t.seasons || null, t.meaning || null,
        t.brewingTemp || null, t.brewingTime || null, t.story || null,
        t.checkinSpots ? JSON.stringify(t.checkinSpots) : null,
        t.modern_forms ? JSON.stringify(t.modern_forms) : null,
        t.beverage_chain || null,
        t.imageUrl || t.image_url || null,
        t.id,
      ];
      const exists = db.prepare('SELECT id FROM teas WHERE name = ?').get(t.name);
      if (exists) {
        update.run(...params, t.name);
        updated += 1;
      } else {
        insert.run(t.name, ...params);
        inserted += 1;
      }
    }
  });
  syncAll();

  console.log(`✅ 更新 ${updated} 条，新增 ${inserted} 条`);

  // 3. 校验
  const total = db.prepare('SELECT COUNT(*) as count FROM teas').get().count;
  const withModern = db.prepare("SELECT COUNT(*) as count FROM teas WHERE modern_forms IS NOT NULL AND modern_forms != '[]'").get().count;
  console.log(`📊 teas 总数: ${total}（含山脉条目）；挂载现代茶饮: ${withModern} 条`);
}

main().catch((err) => {
  console.error('迁移失败:', err);
  process.exit(1);
});
