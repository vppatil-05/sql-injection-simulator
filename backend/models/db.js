const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const config = require('../../config/config');

const dbPath = path.resolve(__dirname, '../../', config.DB_PATH);
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Initialize DB
const schema = fs.readFileSync(path.resolve(__dirname, '../../database/schema.sql'), 'utf8');
const statements = schema.split(';').filter(s => s.trim());
const existingTables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(r => r.name);

if (!existingTables.includes('users')) {
  for (const stmt of statements) {
    if (stmt.trim()) db.exec(stmt);
  }
  console.log('✅ Database initialized with seed data');
} else {
  console.log('✅ Database already exists');
}

module.exports = db;
