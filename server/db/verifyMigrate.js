/** 校验迁移结果（只读） */
const { getDb, initDb } = require('./database');

(async () => {
  await initDb();
  const db = getDb();
  const total = db.prepare('SELECT COUNT(*) as c FROM teas').get().c;
  const cols = db.prepare('PRAGMA table_info(teas)').all().map((c) => c.name);
  const withModern = db.prepare("SELECT COUNT(*) as c FROM teas WHERE modern_forms IS NOT NULL AND modern_forms != '[]' AND modern_forms != ''").get().c;
  const slugged = db.prepare("SELECT COUNT(*) as c FROM teas WHERE slug IS NOT NULL").get().c;
  const sample = db.prepare("SELECT name, slug, category_en, brewing_temp, story IS NOT NULL as has_story FROM teas WHERE slug IS NOT NULL LIMIT 3").all();
  console.log(JSON.stringify({ total, cols, withModern, slugged, sample }, null, 2));
  process.exit(0);
})();
