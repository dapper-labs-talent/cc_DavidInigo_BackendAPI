const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const { configurePassportJWTStrategy } = require('./src/auth');
const { router, secureRouter } = require('./src/routes');
const db = require('./src/db');

function startServer () {

  // Registers JWT token strategy for passport library
  configurePassportJWTStrategy();

  // Configure server
  const app = express();
  app.use(express.json());

  // Configure routes
  app.use('/', router);

  // The secure routes use a JWT passport strategy.
  // A valid JWT token is required in the headers, and the payload of it is placed under the
  // `user` object in the request given to the handlers.
  app.use('/', passport.authenticate('jwt', { session: false}), secureRouter);

  // Handle errors.
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ error: err });
  });

  app.listen(3000, () => {
    console.log('Server started.')
  });
}

async function start () {

  // Initializes the database if not initialized already
  await db.init();
  console.log("Database initialized");

  // Starts the http server and starts serving requests
  startServer();
}

start();


