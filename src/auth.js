/**
 * -------------------------
 * Authentication functions.
 * -------------------------
 * Contains functions used for authentication
 */
const passport = require('passport');
const jwt = require('jsonwebtoken');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const { jwtSecret, tokenExpirationTime } = require('./env');

/**
 * Configures passport's JWT strategy.
 * -----------------------------------
 * This strategy is used on the secure routes in order to extract the user
 * from the JWT token in the header, and place the payload under a `user` object
 * in the request object.
 */
function configurePassportJWTStrategy () {
  passport.use(
    new JWTstrategy(
      {
        secretOrKey: jwtSecret,
        jwtFromRequest: ExtractJWT.fromHeader('x-authentication-token')
      },
      async (token, done) => {
        try {
          // places the user object under `req.user` on the handlers
          return done(null, {id: token.sub});
        } catch (error) {
          done(error);
        }
      }
    )
  );
}

/**
 * Creates a signed JWT token
 * --------------------------
 * creates a signed JWT token with the given user ID in the `sub` field (subject)
 * with the default expiration time (extracted from an environment variable)
 */
function signToken (userId) {
  return jwt.sign({sub: userId}, jwtSecret,
    {"expiresIn": tokenExpirationTime}
  )
}

module.exports = {
  configurePassportJWTStrategy,
  signToken
}