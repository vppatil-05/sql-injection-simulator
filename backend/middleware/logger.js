const logModel = require('../models/logModel');
const { detectInjection } = require('./detector');

function logQuery(input, query, result) {
  const { isAttack } = detectInjection(input);
  const resultStr = typeof result === 'object' ? JSON.stringify(result) : String(result);
  logModel.add(input, query, resultStr.substring(0, 500), isAttack);
}

module.exports = { logQuery };
