/* eslint-disable camelcase */
import moment from 'moment';
import authMiddleware from '../../middlewares/auth.middleware.js';

/* eslint-disable no-underscore-dangle */
export default async function login({
  req, res, next,
  passport, ErrorHandler, httpStatusCodes, responseHandler,
  jwt, secret,
}) {
  passport.authenticate('local', (error, user, info) => {
    if (error) {
      return next(
        new ErrorHandler(httpStatusCodes.INTERNAL_SERVER, error),
      );
    }

    if (!user) {
      return next(
        new ErrorHandler(httpStatusCodes.BAD_REQUEST, info.msg),
      );
    }

    return req.logIn(user, async (err) => {
      if (err) {
        return next(
          new ErrorHandler(httpStatusCodes.INTERNAL_SERVER, err),
        );
      }

      const returnedUser = {
        _id: user._id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        emailVerified: user.isVerified,
      };

      const token = jwt.sign({
        data: { user: returnedUser },
      }, secret, { expiresIn: '7d' });

      for (let index = 0; index < user.tokens.length; index += 1) {
        const tokenItem = user.tokens[index];
        if (tokenItem.session === req.sessionID) {
          user.tokens.splice(index, 1);
        }
      }

      user.tokens.push({
        kind: 'local',
        token,
        session: req.sessionID,
        accessTokenExpires: moment().add(7, 'days').format(),
        refreshToken: '',
      });

      user.save();

      authMiddleware.removeExpiredTokens(user);

      return res.status(httpStatusCodes.OK).json(
        responseHandler({ data: { user: returnedUser,
          token,
          tokenExpiresAt: moment().add(7, 'days').unix() } }),
      );
    });
  })(req, res, next);
}
