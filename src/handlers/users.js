/**
 * ---------------
 * User Handlers.
 * ---------------
 * Since the code of the users handlers is relatively small, they are kept in this
 * one file. Should the code of any handler get bigger, it should be moved to a new file.
 * Implements the handlers:
 *  - getUsersHandler: returns all the users
 *  - updateUserHandler: updates the user provided in the JWT token.
 */

const { body } = require('express-validator');
const { getAll, update } = require('../models/user');
const { assertRequestValid } = require('../validation');

/**
 * Update user validation middleware function
 *
 * Either firstName or lastName must be provided (or both),
 * and if they are provided, none of them can be empty.
 */
async function updateUserValidation (req, res, next) {
  const { firstName, lastName } = req.body;

  // If provided, they can't be empty
  if (firstName === "") {
    return res.status(400).json({ errors: ["firstName can't be empty"]});
  }
  if (lastName === "") {
    return res.status(400).json({ errors: ["lastName can't be empty"]});
  }

  // Either first or last name must be given
  if (!firstName && ! lastName) {
    return res.status(400).json({ errors: ["Either firstName or lastName must be given"]});
  }
  next();
}

/**
 * ---------------------------
 * Get Users Handler function
 * ---------------------------
 * Returns all the users. The handler is in a secure route, so a valid JWT token must be provided
 * in the request header in order to access this handler.
 */
async function getUsersHandler (req, res) {
  res.json({users: await getAll()});
}

/**
 * ---------------------------
 * Update User Handler function
 * ---------------------------
 * Updates the user provided on the JWT token in the header (required as the handler is in a secure route).
 */
async function updateUserHandler (req, res) {
  const { firstName, lastName } = req.body;
  await update(req.user.id, firstName, lastName);
  res.status(200);
  return res.json({"success": true});
}

module.exports = {
  updateUserValidation,
  getUsersHandler,
  updateUserHandler
}