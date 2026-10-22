/**
 * Error Handling Middleware
 * 
 * Guarantees:
 * 1. Zero information disclosure: Stack traces, internal file paths, and raw database
 *    errors are never exposed to clients/users.
 * 2. Generic safe messages for server faults (5xx) and unhandled exceptions.
 * 3. Comprehensive server-side logging with timestamps, request context, and full stack traces for debugging.
 */

// Patterns indicating internal system details, absolute file paths, or database internals
const SENSITIVE_PATTERNS = [
  /[a-zA-Z]:[\\/]/i,                        // Windows paths (e.g. C:\path or E:/path)
  /\/[\w.-]+(\/[\w.-]+){2,}/,               // POSIX paths (e.g. /home/user/app/...)
  /node_modules/i,                          // Node modules path references
  /mongodb(\+srv)?:\/\//i,                  // MongoDB connection URIs
  /\b(mongo|mongoose|bson|e11000|topology|connectionpool|replicaset)\b/i, // Raw DB engine terms
  /\.js:\d+:\d+/i,                          // Code file location traces (e.g. file.js:12:34)
  /\bat\s+[\w.<>]+\s+\(/i,                  // Stack trace frames (at Function (file.js:1))
  /\b(password|secret|bearer|authorization)\b.*(hash|salt|key)/i, // Sensitive secrets
];

const containsSensitiveInfo = (str) => {
  if (typeof str !== 'string') return false;
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(str));
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  let message = err.message || 'An unexpected error occurred';
  let isHandled = false;

  // Always log full error details server-side for debugging
  const timestamp = new Date().toISOString();
  console.error(
    `[ERROR] ${timestamp} | ${req.method} ${req.originalUrl} | Status: ${statusCode} | ${err.name || 'Error'}: ${err.message}\n` +
    `Stack: ${err.stack || 'No stack trace available'}`
  );

  // 1. Handle Mongoose CastError (bad ObjectId or invalid type conversion)
  if (err.name === 'CastError') {
    isHandled = true;
    if (err.kind === 'ObjectId' || err.path === '_id' || err.path === 'id') {
      statusCode = 404;
      message = 'Resource not found';
    } else {
      statusCode = 400;
      message = `Invalid value for parameter '${err.path || 'field'}'`;
    }
  }

  // 2. Handle Mongoose Validation Errors
  else if (err.name === 'ValidationError' && err.errors) {
    isHandled = true;
    statusCode = 400;
    // Map individual field errors to clean messages without exposing internals
    const fieldErrors = Object.values(err.errors).map((val) => {
      const cleanMsg = (val.message || 'Validation failed')
        .replace(/Path `(\w+)`/g, '$1')
        .trim();
      return cleanMsg;
    });
    message = fieldErrors.join(', ') || 'Validation error';
  }

  // 3. Handle MongoDB Duplicate Key Error (code 11000 or MongoServerError)
  else if (err.code === 11000 || (err.name === 'MongoServerError' && err.message && err.message.includes('E11000'))) {
    isHandled = true;
    statusCode = 400;
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'field';
    const cleanField = String(field).replace(/[^a-zA-Z0-9_]/g, '');
    message = `${cleanField.charAt(0).toUpperCase() + cleanField.slice(1)} already exists`;
  }

  // 4. Handle Raw MongoDB / Mongoose Network, Driver, or Cluster Errors
  else if (
    err.name === 'MongoServerSelectionError' ||
    err.name === 'MongoNetworkError' ||
    err.name === 'MongoTimeoutError' ||
    err.name === 'MongooseServerSelectionError' ||
    err.name === 'BSONError' ||
    (err.name && err.name.startsWith('Mongo'))
  ) {
    isHandled = true;
    statusCode = 503;
    message = 'Service temporarily unavailable. Please try again later.';
  }

  // 5. Handle Express Body-Parser Syntax Errors (e.g. malformed JSON in request payload)
  else if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    isHandled = true;
    statusCode = 400;
    message = 'Invalid JSON payload received';
  }

  // 6. Handle Multer Upload Errors
  else if (err.name === 'MulterError') {
    isHandled = true;
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'Uploaded file exceeds the maximum allowed size';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Unexpected file upload field';
    } else {
      message = 'File upload failed. Please verify the file and try again.';
    }
  }

  // 7. Handle JWT Authentication / Expiration Errors
  else if (err.name === 'JsonWebTokenError') {
    isHandled = true;
    statusCode = 401;
    message = 'Not authorized, token failed';
  } else if (err.name === 'TokenExpiredError') {
    isHandled = true;
    statusCode = 401;
    message = 'Session expired, please log in again';
  }

  // 8. General Safety Net: For any unhandled error or any message containing sensitive info,
  //    replace with safe, generic messages to prevent information leakage.
  if (!isHandled) {
    if (statusCode >= 500) {
      message = 'An unexpected server error occurred. Please try again later.';
    } else if (containsSensitiveInfo(message)) {
      message = 'Invalid request. Please check your input and try again.';
    }
  } else if (containsSensitiveInfo(message)) {
    message = statusCode >= 500
      ? 'An unexpected server error occurred. Please try again later.'
      : 'Invalid request. Please check your input and try again.';
  }

  // Response: NEVER send stack traces, internal file paths, or DB driver errors
  const responsePayload = { message };
  if (err.errors && Array.isArray(err.errors)) {
    responsePayload.errors = err.errors;
  }

  res.status(statusCode).json(responsePayload);
};

module.exports = { notFound, errorHandler };
