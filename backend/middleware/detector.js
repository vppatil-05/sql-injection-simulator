const PATTERNS = [
  /'\s*OR\s/i,
  /'\s*OR\s*'.*'.*='/i,
  /--/,
  /;\s*DROP/i,
  /;\s*DELETE/i,
  /;\s*INSERT/i,
  /;\s*UPDATE/i,
  /UNION\s+SELECT/i,
  /'\s*=\s*'/,
  /1\s*=\s*1/,
  /OR\s+1\s*=\s*1/i
];

function detectInjection(input) {
  if (!input) return { isAttack: false, patterns: [] };
  const matched = PATTERNS.filter(p => p.test(input)).map(p => p.toString());
  return { isAttack: matched.length > 0, patterns: matched };
}

function detectorMiddleware(req, res, next) {
  const inputs = [
    req.body?.username, req.body?.password, req.body?.search,
    req.query?.search, req.query?.q
  ].filter(Boolean);

  let detected = false;
  let allPatterns = [];
  for (const input of inputs) {
    const result = detectInjection(input);
    if (result.isAttack) {
      detected = true;
      allPatterns.push(...result.patterns);
    }
  }
  req.injectionDetected = detected;
  req.injectionPatterns = allPatterns;
  next();
}

module.exports = { detectInjection, detectorMiddleware };
