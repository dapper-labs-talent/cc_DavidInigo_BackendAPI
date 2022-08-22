/**
 * ------------
 * User model.
 * ------------
 * Contains all the user operations and domain logic.
 * Since most of the logic is related to creating DB queries, it has ben kept in this one file.
 * If there was more domain logic code, the DB code could be moved into a separate db/user.js file
 * and the domain logic kept in this file.
 */

const bcrypt = require('bcrypt');
const { pool } = require('../db');

/**
 * Creates a user.
 * ----------------
 * Hashes the password using the Bcrypt hash generation with a cost factor of 10.
 * This makes it slower to compare the password when provided on login and protects against
 * brute-force or rainbow table attacks
 */
async function create ({email, password, firstName, lastName}) {
  let hashedPassword = await bcrypt.hash(password, 10);
  res = await pool.query(
    'INSERT INTO users(email, password, "firstName", "lastName") VALUES($1, $2, $3, $4) RETURNING *',
    [email, hashedPassword, firstName, lastName]
  );
  return res.rows[0];
}


/**
 * Fetches a user by email.
 * ------------------------
 * Email is a unique field so it returns either one row, or null
 */
async function getByEmail (email) {
  res = await pool.query(
    "SELECT * FROM users WHERE(email=$1)", [email]
  );
  return (res.rows.length === 1) ? res.rows[0] : null;
}

// Returns all the users in an array
async function getAll () {
  res = await pool.query(
    "SELECT * FROM users"
  );
  return res.rows;
}

/**
 * Updates the given user.
 * -----------------------
 * Either firstName or lastName must be given, or both.
 */
async function update (id, firstName, lastName) {
  let queryValues = "";
  let values = [];

  // Adds first name to the query
  if (firstName) {
    values.push(firstName);
    queryValues+= '"firstName"=$1';
  }

  // Adds last name to the query
  if (lastName) {
    values.push(lastName);
    queryValues+= (queryValues ? ", " : "") + '"lastName"=$' + values.length
  }

  // Adds id to the query
  values.push(id);

  // Constructs the query
  const query = 'UPDATE users SET ' + queryValues + ' WHERE id=$' + values.length;

  // Queries the DB
  res = await pool.query(query, values)

  // Returns the only row, or null if no rows where affected by the query
  return (res.rows.length === 1) ? res.rows[0] : null;
}

/**
 * Checks that the user password matches the given one.
 * -----------------------------------------------------
 * Compares the passwords by hashing the given password with the factor used to hash the original one
 * in the user object.
 */
async function isValidPassword (user, password) {
  return bcrypt.compare(password, user.password);
}

module.exports = {
  create,
  getByEmail,
  isValidPassword,
  getAll,
  update
}