/* eslint-disable camelcase */
import moment from 'moment';
import getFacebookUserData from '../../helpers/facebookAuth.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

/* eslint-disable no-underscore-dangle */
export async function login({
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

    // if (user.role !== 'ADMIN' && checkAdmindomain(req)) {
    //   return next(
    //     new ErrorHandler(httpStatusCodes.UNAUTHORIZED, 'ONLY ADMIN IS AUTHORIZD'),
    //   );
    // }

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

export async function loginGoogle({
  req, res, next,
  passport, ErrorHandler, httpStatusCodes, responseHandler,
  jwt, usersService, OAuth2Client, secret,
}) {
  const {
    GOOGLE_ID_ANDROID_DEBUG, GOOGLE_ID_ANDROID_RELEASE, GOOGLE_ID_IOS, GOOGLE_ID_WEB,
  } = process.env;
  const client = new OAuth2Client();
  const { token } = req.body;

  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: [GOOGLE_ID_ANDROID_DEBUG, GOOGLE_ID_ANDROID_RELEASE, GOOGLE_ID_IOS, GOOGLE_ID_WEB],
    });

    const payload = ticket.getPayload();
    const userid = payload.sub;
    const {
      exp, email, given_name, family_name,
    } = payload;
    const tokens = [];

    const googleUser = await usersService.getOne({ google: userid });

    if (googleUser) {
      for (let index = 0; index < googleUser.tokens.length; index += 1) {
        const tokenItem = googleUser.tokens[index];
        if (tokenItem.session === req.sessionID) {
          googleUser.tokens.splice(index, 1);
        }
      }
      const returnedUser = {
        _id: googleUser._id,
        email: googleUser.email,
        role: googleUser.role,
        isVerified: googleUser.isVerified,
        emailVerified: googleUser.isVerified,

      };

      const localToken = jwt.sign({
        data: { user: returnedUser },
      }, secret, { expiresIn: '7d' });

      googleUser.tokens.push({
        kind: 'google',
        token: localToken,
        session: req.sessionID || '',
        accessTokenExpires: moment().add(7, 'days').format(),
        refreshToken: '',
      });

      await usersService.update(googleUser._id, { tokens: googleUser.tokens }, '-tokens -password');
      authMiddleware.removeExpiredTokens(googleUser);

      return res.status(httpStatusCodes.OK).json(
        responseHandler({ data: { user: returnedUser, token: localToken, tokenExpiresAt: moment().add(7, 'days').unix() } }),
      );
    }

    const existingUser = await usersService.getOne({ email });

    if (existingUser) {
      return next(
        new ErrorHandler(httpStatusCodes.BAD_REQUEST, 'User with given email is already exist please try another email', httpStatusCodes.EMAIL_ALREADY_USED,),
      );
    }

    const user = {
      email,
      google: userid,
      firstName: given_name || email.split['@'][0],
      lastName: family_name || '',
      emailVerified: true,
    };

    const createdUser = await usersService.create(user);

    if (createdUser) {
      const returnedUser = {
        _id: createdUser._id,
        email: createdUser.email,
        role: createdUser.role,
        isVerified: createdUser.isVerified,
        emailVerified: createdUser.isVerified,

      };

      const localToken = jwt.sign({
        data: { user: returnedUser },
      }, secret, { expiresIn: '7d' });

      createdUser.tokens.push({
        kind: 'google',
        token: localToken,
        session: req.sessionID || '',
        accessTokenExpires: moment().add(7, 'days').format(),
        refreshToken: '',
      });
      await usersService.update(createdUser._id, { tokens: createdUser.tokens }, '-tokens -password');
      authMiddleware.removeExpiredTokens(createdUser);

      return res.status(httpStatusCodes.OK).json(
        responseHandler({ data: { user: returnedUser, token: localToken, tokenExpiresAt: moment().add(7, 'days').unix() } }),
      );
    }

    return next(
      new ErrorHandler(httpStatusCodes.INTERNAL_SERVER, 'Server Error '),
    );
  }
  verify().catch((err) => next(
    new ErrorHandler(httpStatusCodes.INTERNAL_SERVER, `Error verifing google token, please try again ${err}`),
  ));
}

export async function loginFacebook({
  req, res, next,
  ErrorHandler, httpStatusCodes, responseHandler,
  jwt, secret, usersService,
}) {
  try {
    const { token } = req.body;
    const fbData = await getFacebookUserData(token);

    const {
      id, email, first_name, last_name,
    } = fbData;

    const facebookUser = await usersService.getOne({ facebook: id });

    if (facebookUser) {
      for (let index = 0; index < facebookUser.tokens.length; index += 1) {
        const tokenItem = facebookUser.tokens[index];
        if (tokenItem.session === req.sessionID) {
          facebookUser.tokens.splice(index, 1);
        }
      }

      const returnedUser = {
        _id: facebookUser._id,
        email: facebookUser.email || id,
        role: facebookUser.role,
        isVerified: facebookUser.isVerified,
        emailVerified: facebookUser.isVerified,

      };

      const localToken = jwt.sign({
        data: { user: returnedUser },
      }, secret, { expiresIn: '7d' });

      facebookUser.tokens.push({
        kind: 'facebook',
        token: localToken,
        session: req.sessionID || '',
        accessTokenExpires: moment().add(7, 'days').format(),
        refreshToken: '',
      });

      await usersService.update(facebookUser._id, { tokens: facebookUser.tokens }, '-tokens -password');
      authMiddleware.removeExpiredTokens(facebookUser);

      return res.status(httpStatusCodes.OK).json(
        responseHandler({ data: {
          user: returnedUser,
          token: localToken,
          tokenExpiresAt: moment().add(7, 'days').unix(),
        } }),
      );
    }

    const existingUser = await usersService.getOne({ email });

    if (existingUser) {
      return next(
        new ErrorHandler(
          httpStatusCodes.BAD_REQUEST,
          'User with given email is already exist please try another email',
          httpStatusCodes.EMAIL_ALREADY_USED
        ),
      );
    }

    const user = {
      email: email || id,
      facebook: id,
      tokens: [{
        kind: 'facebook',
        token,
        session: req.sessionID || '',
        accessTokenExpires: moment().add(7, 'days').format(),
        refreshToken: '',
      }],
      firstName: first_name || email.split('@')[0],
      lastName: last_name || '',
      emailVerified: true,
    };

    const createdUser = await usersService.create(user);

    if (createdUser) {
      const returnedUser = {
        _id: createdUser._id,
        email: createdUser.email,
        role: createdUser.role,
        isVerified: createdUser.isVerified,
        emailVerified: createdUser.isVerified,

      };

      const localToken = jwt.sign({
        data: { user: returnedUser },
      }, secret, { expiresIn: '7d' });

      createdUser.tokens.push({
        kind: 'facebook',
        token: localToken,
        session: req.sessionID || '',
        accessTokenExpires: moment().add(7, 'days').format(),
        refreshToken: '',
      });

      await usersService.update(createdUser._id, { tokens: createdUser.tokens }, '-tokens -password');
      authMiddleware.removeExpiredTokens(createdUser);

      return res.status(httpStatusCodes.OK).json(
        responseHandler({ data: {
          user: returnedUser,
          token: localToken,
          tokenExpiresAt: moment().add(7, 'days').unix(),
        } }),
      );
    }

    return next(
      new ErrorHandler(httpStatusCodes.INTERNAL_SERVER, 'Server Error '),
    );
  } catch (error) {
    console.log('error facebook login', error);
    return next(
      new ErrorHandler(httpStatusCodes.INTERNAL_SERVER, error),
    );
  }
}

export async function loginApple({
  req, res, next,
  ErrorHandler, httpStatusCodes, responseHandler,
  jwt, secret, usersService,
  appleSigninAuth,
}) {
  try {
    const { token } = req.body;
    const appleData = await appleSigninAuth.verifyIdToken(token);

    const {
      sub, email,
    } = appleData;

    const appleUser = await usersService.getOne({ apple: sub });

    if (appleUser) {
      for (let index = 0; index < appleUser.tokens.length; index += 1) {
        const tokenItem = appleUser.tokens[index];
        if (tokenItem.session === req.sessionID) {
          appleUser.tokens.splice(index, 1);
        }
      }

      const returnedUser = {
        _id: appleUser._id,
        email: appleUser.email || sub,
        role: appleUser.role,
        isVerified: appleUser.isVerified,
        emailVerified: appleUser.isVerified,

      };

      const localToken = jwt.sign({
        data: { user: returnedUser },
      }, secret, { expiresIn: '7d' });

      appleUser.tokens.push({
        kind: 'apple',
        token: localToken,
        session: req.sessionID || '',
        accessTokenExpires: moment().add(7, 'days').format(),
        refreshToken: '',
      });

      await usersService.update(appleUser._id, { tokens: appleUser.tokens }, '-tokens -password');
      authMiddleware.removeExpiredTokens(appleUser);

      return res.status(httpStatusCodes.OK).json(
        responseHandler({ data: {
          user: returnedUser,
          token: localToken,
          tokenExpiresAt: moment().add(7, 'days').unix(),
        } }),
      );
    }

    const existingUser = await usersService.getOne({ email });

    if (existingUser) {
      return next(
        new ErrorHandler(
          httpStatusCodes.BAD_REQUEST,
          'User with given email is already exist please try another email',
          httpStatusCodes.EMAIL_ALREADY_USED
        ),
      );
    }

    const user = {
      email: email || sub,
      apple: sub,
      tokens: [{
        kind: 'apple',
        token,
        session: req.sessionID || '',
        accessTokenExpires: moment().add(7, 'days').format(),
        refreshToken: '',
      }],
      firstName: email.split('@')[0],
      lastName: '',
      emailVerified: true,
    };

    const createdUser = await usersService.create(user);

    if (createdUser) {
      const returnedUser = {
        _id: createdUser._id,
        email: createdUser.email,
        role: createdUser.role,
        isVerified: createdUser.isVerified,
        emailVerified: createdUser.isVerified,

      };

      const localToken = jwt.sign({
        data: { user: returnedUser },
      }, secret, { expiresIn: '7d' });

      createdUser.tokens.push({
        kind: 'apple',
        token: localToken,
        session: req.sessionID || '',
        accessTokenExpires: moment().add(7, 'days').format(),
        refreshToken: '',
      });

      await usersService.update(createdUser._id, { tokens: createdUser.tokens }, '-tokens -password');
      authMiddleware.removeExpiredTokens(createdUser);

      return res.status(httpStatusCodes.OK).json(
        responseHandler({ data: {
          user: returnedUser,
          token: localToken,
          tokenExpiresAt: moment().add(7, 'days').unix(),
        } }),
      );
    }

    return next(
      new ErrorHandler(httpStatusCodes.INTERNAL_SERVER, 'Server Error '),
    );
  } catch (error) {
    console.log('error apple login', error);
    return next(
      new ErrorHandler(httpStatusCodes.INTERNAL_SERVER, error),
    );
  }
}
