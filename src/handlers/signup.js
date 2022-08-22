/**
 * ---------------
 * Signup Handler
 * ---------------
 * Implements the signup handler and the validation schema
 */

const jwt = require('jsonwebtoken');
const { signToken } = require('../auth');
const { assertRequestValid } = require('../validation');
const userModel = require('../models/user');

// Validation schema
let schema = {
  "password": {
    isLength: {
      errorMessage: 'Password should be at least 8 chars long',
      options: { min: 8 }
    }
  },
  "email": {
    isEmail: {
      errorMessage: "Not a valid email"
    }
  },
  "firstName": {
    notEmpty: {
      errorMessage: "firstName can't be empty"
    }
  },
   "lastName": {
     notEmpty: {
       errorMessage: "lastName can't be empty"
     }
   }
};

/**
 * -----------------
 * Handler function
 * -----------------
 * Validates the request and checks that there is not already an user with the same email
 * as the provided one. If it succeeds, it creates the user and returns a signed JWT token
 * that contains the user ID in the `sub` field, and returns it.
 */
async function handler (req, res, next) {

  // If the request is not valid, returns errors
  if (!assertRequestValid(req, res)) return false;

  // If there is already an user with that email, returns error
  const user = await userModel.getByEmail(req.body.email);
  if (user) {
    return res.status(409).json({
    errors: [{message: "There is already another user with that email"}]});
  }

  // Creates the user and returns a token that contains the user id in the "sub" (subject) field
  const createdUser = await userModel.create(req.body);
  const token = signToken(createdUser.id);

  return res.json({token});
}

module.exports = {
  handler,
  schema
}