const productModel = require('../models/productModel');
const { logQuery } = require('../middleware/logger');

module.exports = {
  search(req, res) {
    const search = req.body.search || req.query.q || '';
    const isSecure = req.body.mode === 'secure' || req.query.mode === 'secure';

    if (isSecure && req.injectionDetected) {
      logQuery(search, 'BLOCKED', 'blocked');
      return res.json({
        success: false,
        message: '🛡️ SQL Injection detected and blocked!',
        query: `BLOCKED — Detected patterns`,
        injectionDetected: true,
        data: []
      });
    }

    const result = isSecure ? productModel.secureSearch(search) : productModel.vulnerableSearch(search);

    logQuery(search, result.query, `${result.rows.length} results`);

    res.json({
      success: true,
      message: `Found ${result.rows.length} product(s)`,
      query: result.query,
      injectionDetected: req.injectionDetected,
      data: result.rows,
      error: result.error
    });
  },

  getAll(req, res) {
    res.json({ data: productModel.getAll() });
  },

  add(req, res) {
    const { name, description, price } = req.body;
    productModel.add(name, description, parseFloat(price));
    res.json({ success: true, message: 'Product added' });
  },

  delete(req, res) {
    productModel.delete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  }
};
