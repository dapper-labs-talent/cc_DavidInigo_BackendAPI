/**
 * -------------------------
 * Routes.
 * -------------------------
 * Implements all the routes in the server, and packages them in routers.
 * The routes in the secure router need the user to be logged in (they are assigned the passport
 * JWT strategy when initializing the server).
 */
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { checkSchema, body } = require('express-validator');
const handlers = require('./handlers');

const router = express.Router();
const secureRouter = express.Router();

// Normal router. User doesn't have to be logged in to access them.
router.post(
  '/signup',
  checkSchema(handlers.signup.schema),
  handlers.signup.handler
);
router.post(
  '/login', checkSchema(handlers.login.schema), handlers.login.handler
);

// Secure router. User must be logged in to access them.
secureRouter.get(
  '/users', handlers.users.getUsersHandler
);
secureRouter.put(
  '/users', handlers.users.updateUserValidation, handlers.users.updateUserHandler
);

module.exports = {
  router,
  secureRouter
}
