const logModel = require('../models/logModel');

module.exports = {
  getAll(req, res) {
    res.json({ data: logModel.getAll() });
  },
  getStats(req, res) {
    res.json(logModel.getStats());
  }
};
