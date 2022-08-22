/**
 * Handlers index
 * Contains all the handlers
 */
const login = require("./login.js");
const signup = require("./signup.js");
const users = require('./users.js');

module.exports = {
  login,
  signup,
  users
}