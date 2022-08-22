/**
 * --------------
 * Login Handler
 * --------------
 * Implements the login handler and the validation schema
 */

const { signToken } = require('../auth');
const { assertRequestValid } = require('../validation');
const userModel = require('../models/user');

// Validation schema
let schema = {
  "password": {
    notEmpty: {
      errorMessage: "Password can't be empty"
    }
  },
  "email": {
    isEmail: {
      errorMessage: "Not a valid email"
    }
  }
};

/**
 * -----------------
 * Handler function
 * -----------------
 * Validates the request and checks that the user exists, and that the provided password
 * matches by comparing the hash value. If it succeeds, creates a signed JWT token with the user ID
 * in the `sub` field and returns it.
 */
async function handler (req, res, next) {

  // If the request is not valid, returns errors
  if (!assertRequestValid(req, res)) return false;
  const { email, password } = req.body;

  // Fetches the user from DB by email
  const user = await userModel.getByEmail(email);

  // If the user didn't exist, or the password is not valid, returns error - 401 unauthorized
  if (!user || !await userModel.isValidPassword(user, password)) {
    return res.status(401).json({
    errors: [{message: "Wrong email or password"}]});
  }

  // If the password is correct, returns a JWT token containing the user id in the sub field (subject)
  const token = signToken(user.id);
  return res.json({token});

}

module.exports = {
  handler,
  schema
}