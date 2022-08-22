/**
 * -------------------------
 * Database functions.
 * -------------------------
 * Contains functions for initializing the database
 */

const { migrate } = require("postgres-migrations");

const { Pool, Client } = require('pg');
const { dbName } = require('./env');
const globalPool = new Pool();

/**
 * Creates a database if it didn't exist.
 * --------------------------------------
 * Postgres always needs to connect to a database. Since the application database might not exist yet,
 * it connects to the default `postgres` database instead, so that is why it can't use the global pool.
 * Once connected to 'postgres', it will create the application database if it didn't exist, and disconnect.
 */
function createDbIfNotExists () {
  return new Promise((resolve, reject) => {
    const client = new Client({database:'postgres'});
    client.connect();
    return client.query(`CREATE DATABASE ${dbName}`, (err, res) => {
      if (err) {
        console.log(`Database ${dbName} already exists`);
      } else {
        console.log(`Database ${dbName} successfully created`);
      }
      client.end();
      resolve();
    });
  });
}

// Executes all the migrations in the migrations folder
async function runMigrations () {
  return migrate({"client": globalPool}, "migrations");
}

// Initializes the database: creates it if it didn't exist, and runs all the migrations
async function init () {
  await createDbIfNotExists();
  await runMigrations();
}

module.exports = {
  "pool": globalPool,
  "init": init
}