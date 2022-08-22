/**
 * -------------------------
 * Validation utility functions.
 * -------------------------
 * Functions used for validation in the handlers
 */
const { validationResult, checkSchema } = require('express-validator');

/**
 * Asserts if the requests has validation errors from express-validator
 * --------------------------------------------------------------------
 * Fetches the validation result from express-validator in the request.
 * This validation result is placed in the request object in the express-validator
 * validation middleware functions. If it finds an errors, returns them in the response.
 */
function assertRequestValid(req, res) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return true;
  res.status(400).json({ errors: errors.array() });
  return false;
}

module.exports = {
 assertRequestValid
}