const userModel = require('../models/userModel');
const { logQuery } = require('../middleware/logger');

module.exports = {
  login(req, res) {
    const { username, password, mode } = req.body;
    const isSecure = mode === 'secure';

    let result;
    if (isSecure && req.injectionDetected) {
      logQuery(username + ' / ' + password, 'BLOCKED', 'blocked');
      return res.json({
        success: false,
        message: '🛡️ SQL Injection detected and blocked!',
        query: `BLOCKED — Detected patterns: ${req.injectionPatterns.join(', ')}`,
        injectionDetected: true,
        data: []
      });
    }

    result = isSecure ? userModel.secureLogin(username, password) : userModel.vulnerableLogin(username, password);
    const success = result.rows.length > 0;

    logQuery(username + ' / ' + password, result.query, success ? 'success' : 'failed');

    res.json({
      success,
      message: success
        ? `✅ Login successful! Found ${result.rows.length} user(s)`
        : '❌ Login failed — Invalid credentials',
      query: result.query,
      injectionDetected: req.injectionDetected,
      data: result.rows.map(u => ({ id: u.id, username: u.username, role: u.role })),
      error: result.error
    });
  }
};
