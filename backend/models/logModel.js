const db = require('./db');

module.exports = {
  add(input, query, result, isAttack) {
    db.prepare("INSERT INTO logs (input, query, result, is_attack) VALUES (?, ?, ?, ?)").run(input, query, result, isAttack ? 1 : 0);
  },

  getAll() {
    return db.prepare("SELECT * FROM logs ORDER BY timestamp DESC LIMIT 100").all();
  },

  getStats() {
    const total = db.prepare("SELECT COUNT(*) as count FROM logs").get().count;
    const attacks = db.prepare("SELECT COUNT(*) as count FROM logs WHERE is_attack = 1").get().count;
    const successful = db.prepare("SELECT COUNT(*) as count FROM logs WHERE is_attack = 1 AND result != 'blocked' AND result != 'failed'").get().count;
    return { total, attacks, successful, failed: attacks - successful };
  }
};
