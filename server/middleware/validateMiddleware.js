/**
 * Strict Input Validation Middleware
 * Enforces type, length, and format constraints on req.body, req.query, and req.params.
 * Rejects invalid requests immediately with HTTP 400 (or 404 for invalid resource ID params).
 */
const validate = ({ body, query, params }) => {
  return (req, res, next) => {
    // 1. Validate URL Path Parameters (req.params)
    if (params) {
      const parsedParams = params.safeParse(req.params);
      if (!parsedParams.success) {
        // If an :id param failed ObjectId validation on a resource lookup endpoint,
        // respond with 404 "Resource not found" (preserving the REST / CastError contract).
        const idIssue = parsedParams.error.issues.find((i) => i.path.includes('id'));
        if (idIssue) {
          return res.status(404).json({ message: 'Resource not found' });
        }

        const issues = parsedParams.error.issues;
        const message = issues.map((i) => `${i.path.join('.') || 'param'}: ${i.message}`).join('; ');
        return res.status(400).json({
          message: `Validation failed: ${message}`,
          errors: issues.map((i) => ({
            field: i.path.join('.') || 'param',
            message: i.message,
            code: i.code,
          })),
        });
      }

      Object.defineProperty(req, 'params', {
        value: parsedParams.data,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }

    // 2. Validate URL Query Strings (req.query)
    if (query) {
      const parsedQuery = query.safeParse(req.query);
      if (!parsedQuery.success) {
        const issues = parsedQuery.error.issues;
        const message = issues.map((i) => `${i.path.join('.') || 'query'}: ${i.message}`).join('; ');
        return res.status(400).json({
          message: `Validation failed: ${message}`,
          errors: issues.map((i) => ({
            field: i.path.join('.') || 'query',
            message: i.message,
            code: i.code,
          })),
        });
      }

      Object.defineProperty(req, 'query', {
        value: parsedQuery.data,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }

    // 3. Validate Request Payload Body (req.body)
    if (body) {
      const parsedBody = body.safeParse(req.body);
      if (!parsedBody.success) {
        const issues = parsedBody.error.issues;
        const message = issues.map((i) => `${i.path.join('.') || 'body'}: ${i.message}`).join('; ');
        return res.status(400).json({
          message: `Validation failed: ${message}`,
          errors: issues.map((i) => ({
            field: i.path.join('.') || 'body',
            message: i.message,
            code: i.code,
          })),
        });
      }

      req.body = parsedBody.data;
    }

    next();
  };
};

const validateBody = (schema) => validate({ body: schema });
const validateQuery = (schema) => validate({ query: schema });
const validateParams = (schema) => validate({ params: schema });

module.exports = {
  validate,
  validateBody,
  validateQuery,
  validateParams,
};
