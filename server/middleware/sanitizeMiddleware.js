/**
 * Express 5 compatible NoSQL Query Injection Sanitizer
 * Recursively strips keys starting with '$' or containing '.' from request body, params, and query.
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

module.exports = { sanitizeNoSql };
