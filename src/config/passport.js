/* eslint-disable no-underscore-dangle */
import passport from 'passport';
import LocalStrategy from 'passport-local';

import User from '../models/User.js';
import crudHandler from '../utils/crudHandler.js';

export default function initPassport() {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  /**
 * Sign in using Email and Password.
 */

  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      const user = await crudHandler.getOne({
        model: 'User',
        filters: { email: email.toLowerCase() },
      });

      if (!user) { return done(null, false, { msg: 'Invalid email or password.' }); }

      if (!user.isActive) {
        return done(null, false, { msg: 'User is deactivated by administration' });
      }

      if (!user.password) {
        return done(
          null,
          false,
          { msg: `Your account was registered using a sign-in provider.
           To enable password login, sign in using a provider,
            and then set a password under your user profile.
           ` }
        );
      }

      return user.comparePassword(password, (err, isMatch) => {
        if (err) return done(err);

        if (isMatch) { return done(null, user); }

        return done(null, false, { msg: 'Invalid email or password.' });
      });
    }
  ));
}
