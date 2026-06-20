/**
 * 数据库模块 - 优先使用 better-sqlite3，回退到 sql.js
 * 提供统一的 better-sqlite3 兼容 API
 */

const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'tea-map.db');

let db = null;
let _saveFn = null; // sql.js 持久化回调

// ── SQL.js Statement Wrapper ──────────────────────────────
class Statement {
  constructor(sqlDb, sql) {
    this.sqlDb = sqlDb;
    this.sql = sql;
  }

  _bindParams(sql, params) {
    if (!params || params.length === 0) return sql;
    let idx = 0;
    return sql.replace(/\?/g, () => {
      const val = params[idx++];
      if (val === null || val === undefined) return 'NULL';
      if (typeof val === 'number') return String(val);
      return `'${String(val).replace(/'/g, "''")}'`;
    });
  }

  run(...params) {
    this.sqlDb.run(this._bindParams(this.sql, params));
    const lastId = this.sqlDb.exec('SELECT last_insert_rowid() as id');
    return {
      changes: this.sqlDb.getRowsModified(),
      lastInsertRowid: lastId.length > 0 && lastId[0].values.length > 0 ? lastId[0].values[0][0] : 0
    };
  }

  get(...params) {
    const rows = this.all(...params);
    return rows.length > 0 ? rows[0] : undefined;
  }

  all(...params) {
    const result = this.sqlDb.exec(this._bindParams(this.sql, params));
    if (result.length === 0) return [];
    const { columns, values } = result[0];
    return values.map(row => {
      const obj = {};
      columns.forEach((col, i) => { obj[col] = row[i]; });
      return obj;
    });
  }
}

// ── SQL.js Database Wrapper ───────────────────────────────
function createSQLJSDB(sqlDb, saveFn) {
  return {
    prepare: (sql) => new Statement(sqlDb, sql),

    exec(sql) {
      sqlDb.run(sql);
    },

    pragma() {}, // no-op for SQL.js

    transaction(fn) {
      return (...args) => {
        try {
          sqlDb.run('BEGIN');
          const result = fn(...args);
          sqlDb.run('COMMIT');
          return result;
        } catch (e) {
          sqlDb.run('ROLLBACK');
          throw e;
        }
      };
    },

    _save: saveFn,
    _raw: sqlDb
  };
}

// ── Init: better-sqlite3 ──────────────────────────────────
function tryBetterSQLite3() {
  try {
    const Database = require('better-sqlite3');
    const db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    return db;
  } catch (e) {
    return null;
  }
}

// ── Init: sql.js ──────────────────────────────────────────
async function initSQLJS() {
  const SQL = await initSqlJs();

  let sqlDb;
  if (fs.existsSync(DB_PATH)) {
    try {
      const buffer = fs.readFileSync(DB_PATH);
      sqlDb = new SQL.Database(buffer);
    } catch {
      sqlDb = new SQL.Database();
    }
  } else {
    sqlDb = new SQL.Database();
  }

  function saveDb() {
    try {
      fs.writeFileSync(DB_PATH, Buffer.from(sqlDb.export()));
    } catch (e) {
      console.error('DB保存失败:', e.message);
    }
  }

  // 定期保存 + 退出时保存
  const interval = setInterval(saveDb, 15000);
  process.on('exit', saveDb);
  process.on('SIGINT', () => { saveDb(); process.exit(); });

  const wrapper = createSQLJSDB(sqlDb, saveDb);
  wrapper._interval = interval;

  sqlDb.run('PRAGMA foreign_keys = ON');
  return wrapper;
}

// ── Public API ────────────────────────────────────────────
let _dbPromise = null;

function getDb() {
  if (db) return db;

  // 尝试 better-sqlite3
  const bs3 = tryBetterSQLite3();
  if (bs3) {
    db = bs3;
    initTables(bs3);
    return db;
  }

  // 回退到 sql.js（同步初始化）
  throw new Error(
    'better-sqlite3 不可用，请使用异步初始化:\n' +
    '  const { initDb } = require("./db/database");\n' +
    '  await initDb();\n' +
    '  const db = getDb();'
  );
}

async function initDb() {
  if (db) return db;

  const bs3 = tryBetterSQLite3();
  if (bs3) {
    db = bs3;
    initTables(bs3);
    return db;
  }

  db = await initSQLJS();
  initTables(db);
  return db;
}

function initTables(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS teas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      province TEXT NOT NULL,
      city TEXT,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      category TEXT,
      maturity_months TEXT,
      seasons TEXT,
      local_characteristics TEXT,
      appearance TEXT,
      history TEXT,
      spirit TEXT,
      meaning TEXT,
      image_url TEXT,
      is_mountain INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      tea_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (tea_id) REFERENCES teas(id) ON DELETE CASCADE,
      UNIQUE(user_id, tea_id)
    );

    CREATE TABLE IF NOT EXISTS checkins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      city_name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
}

module.exports = { getDb, initDb };
