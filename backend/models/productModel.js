const db = require('./db');

module.exports = {
  vulnerableSearch(search) {
    const query = `SELECT * FROM products WHERE name LIKE '%${search}%' OR description LIKE '%${search}%'`;
    try {
      const rows = db.prepare(query).all();
      return { rows, query };
    } catch (e) {
      return { rows: [], query, error: e.message };
    }
  },

  secureSearch(search) {
    const query = "SELECT * FROM products WHERE name LIKE ? OR description LIKE ?";
    const param = `%${search}%`;
    try {
      const rows = db.prepare(query).all(param, param);
      return { rows, query: `SELECT * FROM products WHERE name LIKE '%${search}%' ... (parameterized)` };
    } catch (e) {
      return { rows: [], query, error: e.message };
    }
  },

  getAll() {
    return db.prepare("SELECT * FROM products").all();
  },

  add(name, description, price) {
    return db.prepare("INSERT INTO products (name, description, price) VALUES (?, ?, ?)").run(name, description, price);
  },

  delete(id) {
    return db.prepare("DELETE FROM products WHERE id = ?").run(id);
  }
};
