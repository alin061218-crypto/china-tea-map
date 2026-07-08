// Handles uncaught route errors with a consistent API response shape.
const { fail } = require('../utils/response');

function errorHandler(err, req, res, _next) {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}:`, err.message);

  if (res.headersSent) return;

  const status = err.status || 500;
  const message = err.expose ? err.message : 'Internal server error';
  res.status(status).json(fail(message));
}

module.exports = errorHandler;
