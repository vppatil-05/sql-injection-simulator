const db = require('./db');

module.exports = {
  vulnerableLogin(username, password) {
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    try {
      const rows = db.prepare(query).all();
      return { rows, query };
    } catch (e) {
      return { rows: [], query, error: e.message };
    }
  },

  secureLogin(username, password) {
    const query = "SELECT * FROM users WHERE username = ? AND password = ?";
    try {
      const rows = db.prepare(query).all(username, password);
      return { rows, query: `SELECT * FROM users WHERE username = '${username}' AND password = '${password}' (parameterized)` };
    } catch (e) {
      return { rows: [], query, error: e.message };
    }
  }
};
