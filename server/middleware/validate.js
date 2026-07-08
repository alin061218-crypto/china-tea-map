// Builds request validation middleware with a consistent error response.
const { validationResult } = require('express-validator');
const { fail } = require('../utils/response');

function validate(rules) {
  return [
    ...rules,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const message = errors.array().map(error => error.msg).join('; ');
        return res.status(400).json(fail(message));
      }
      next();
    },
  ];
}

module.exports = { validate };
