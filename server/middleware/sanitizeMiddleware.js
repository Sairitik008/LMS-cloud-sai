/**
 * Express 5 compatible NoSQL Query Injection Protection
 * Supports both sanitization (backward compatibility) and strict rejection of prohibited operators.
 */

// Deep check for prohibited NoSQL operator keys or prototype pollution
const containsProhibitedKey = (obj) => {
  if (!obj || typeof obj !== 'object') return null;

  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.') || key === '__proto__' || key === 'constructor') {
      return key;
    }
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      const nested = containsProhibitedKey(obj[key]);
      if (nested) return nested;
    }
  }
  return null;
};

/**
 * Strict Input Rejection: Rejects any request containing MongoDB operators or injection keys
 * with HTTP 400 Bad Request, rather than just silently stripping or escaping them.
 */
const rejectProhibitedInput = (req, res, next) => {
  const badKeyInBody = containsProhibitedKey(req.body);
  if (badKeyInBody) {
    return res.status(400).json({
      message: `Prohibited injection key rejected: '${badKeyInBody}'`,
      errors: [{ field: badKeyInBody, message: 'MongoDB operators and path operators are prohibited' }],
    });
  }

  const badKeyInQuery = containsProhibitedKey(req.query);
  if (badKeyInQuery) {
    return res.status(400).json({
      message: `Prohibited injection key in query rejected: '${badKeyInQuery}'`,
      errors: [{ field: badKeyInQuery, message: 'MongoDB operators and path operators are prohibited' }],
    });
  }

  const badKeyInParams = containsProhibitedKey(req.params);
  if (badKeyInParams) {
    return res.status(400).json({
      message: `Prohibited injection key in params rejected: '${badKeyInParams}'`,
      errors: [{ field: badKeyInParams, message: 'MongoDB operators and path operators are prohibited' }],
    });
  }

  next();
};

/**
 * Legacy recursive sanitizer (maintained for direct unit test compatibility)
 */
const cleanObject = (obj) => {
  if (!obj || typeof obj !== 'object') return;

  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      cleanObject(obj[key]);
    }
  }
};

const sanitizeNoSql = (req, res, next) => {
  if (req.body) cleanObject(req.body);
  if (req.params) cleanObject(req.params);
  if (req.query) cleanObject(req.query);
  next();
};

module.exports = {
  rejectProhibitedInput,
  sanitizeNoSql,
};
