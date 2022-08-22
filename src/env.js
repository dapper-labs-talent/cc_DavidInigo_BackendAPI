/**
 * -------------------------
 * Environment variables.
 * -------------------------
 * Contains all the values extracted from environment variables
 */

const dbName = process.env["PGDATABASE"];
const jwtSecret = process.env["JWT_SECRET"];
const tokenExpirationTime = process.env["TOKEN_EXP_TIME"]

module.exports = {
 dbName,
 jwtSecret,
 tokenExpirationTime
}