/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { ErrorHandler } from '../utils/errorsHandler.js';
import httpStatusCodes from '../utils/httpStatusCodes.js';
import usersService from '../services/users.services.js';

const authMiddleware = {
  /**
   * Login Required middleware.
   */

  checkToken(tokens, accessToken) {
    try {
      let check = false;
      for (let index = 0; index < tokens.length; index += 1) {
        const item = tokens[index];
        if (String(item.token) === String(accessToken)
          && moment(item.accessTokenExpires).isAfter()) {
          check = true;
          break;
        }
      }

      return check;
    } catch (error) {
      return false;
    }
  },

  async removeExpiredTokens(user) {
    try {
      const tokens = [];
      for (let index = 0; index < user.tokens.length; index += 1) {
        const item = user.tokens[index];
        if (moment(item.accessTokenExpires).isAfter()) {
          tokens.push(item);
        }
      }
      usersService.update(user._id, { tokens }, '-tokens -password');

      return tokens;
    } catch (error) {
      return false;
    }
  },

  async isAuthenticated(req, res, next) {
    try {
      if (!req.headers.authorization || req.headers.authorization === '') {
        return next(
          new ErrorHandler(
            httpStatusCodes.UNAUTHORIZED, 'NO AUTH TOKEN',
          ),
        );
      }
      const authorizationHeader = req.headers.authorization.split(' ')[1]; // Bearer <token>

      const user = authMiddleware.decodeToken(authorizationHeader);

      if (!user || user.error) {
        return next(new ErrorHandler(
          httpStatusCodes.UNAUTHORIZED,
          'ERROR WITH TOKEN VERIFICATION',
        ));
      }

      const response = await usersService.getOne({ _id: user._id });

      if (response) {
        if (response.isActive && authMiddleware.checkToken(response.tokens, authorizationHeader)) {
          req.user = response;
          return next();
        }
        return next(
          new ErrorHandler(
            httpStatusCodes.FORBIDDEN,
            'NOT ALLOWED, USER IS DISCONNECTED , INACTIVE OR TOKEN EXPIRED',
          ),
        );
      }

      return next(
        new ErrorHandler(
          httpStatusCodes.FORBIDDEN, 'NOT ALLOWED',
        ),
      );
    } catch (error) {
      return next(
        new ErrorHandler(
          httpStatusCodes.INTERNAL_SERVER, error,
        ),
      );
    }
  },

  /**
   * Authorization Required middleware.
   */
  async isAuthorized(req, res, next) {
    try {
      if (!req.headers.authorization || req.headers.authorization === '') {
        return next(
          new ErrorHandler(
            httpStatusCodes.UNAUTHORIZED,
            'NO AUTH TOKEN',
          ),
        );
      }
      const authorizationHeader = req.headers.authorization.split(' ')[1]; // Bearer <token>

      const user = authMiddleware.decodeToken(authorizationHeader);
      if (!user || user.error) {
        return next(new ErrorHandler(
          httpStatusCodes.UNAUTHORIZED,
          'ERROR WITH TOKEN VERIFICATION',
        ));
      }

      // Check if user is an admin
      const response = await usersService.getOne({ _id: user._id, role: 'ADMIN' });

      if (response && authMiddleware.checkToken(response.tokens, authorizationHeader)) {
        if (user.role === response.role) {
          req.user = response;
          return next();
        }
        return next(
          new ErrorHandler(
            httpStatusCodes.FORBIDDEN, 'ONLY ADMIN IS ALLOWED',
          ),
        );
      }
      return next(new ErrorHandler(
        httpStatusCodes.FORBIDDEN, 'ONLY ADMIN IS ALLOWED',
      ));
    } catch (error) {
      return next(new ErrorHandler(
        httpStatusCodes.INTERNAL_SERVER, error,
      ));
    }
  },
  /**
   * Authorization Required middleware.
   */
  async checkAuth(req, res, next) {
    try {
      if (!req.headers.authorization || req.headers.authorization === '') {
        req.user = null;
        return next();
      }

      const authorizationHeader = req.headers.authorization.split(' ')[1]; // Bearer <token>
      const user = authMiddleware.decodeToken(authorizationHeader);

      if (!user || user.error) {
        req.user = null;
        return next();
      }

      const response = await usersService.getById(user._id);

      if (response) {
        req.user = response;
        return next();
      }

      req.user = null;
      return next();
    } catch (error) {
      console.log('check auth error', error);
      return next(
        new ErrorHandler(
          httpStatusCodes.INTERNAL_SERVER, error,
        ),
      );
    }
  },

  isValidParam(req, res, next) {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) return next();

    return next(
      new ErrorHandler(
        httpStatusCodes.BAD_REQUEST,
        'Wrong id',
      ),
    );
  },

  decodeToken(token) {
    const options = {
      expiresIn: '7d',
      // issuer: 'https://scotch.io',
    };
    try {
      const result = jwt.verify(token, process.env.TOKEN_SECRET, options);

      return result.data.user;
    } catch (err) {
      // Throw an error just in case anything goes wrong with verification
      return { error: err };
    }
  },

};
export default authMiddleware;
