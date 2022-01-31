import passport from 'passport';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import appleSigninAuth from 'apple-signin-auth';
import httpStatusCodes from '../../utils/httpStatusCodes';
import {
  login, loginGoogle, loginFacebook, loginApple,
} from './login.controller';
import logout from './logout.controller';
import { forgotPassword, resetPassword, verifyCode } from './reset-password.controller';
import { ErrorHandler } from '../../utils/errorsHandler';
import responseHandler from '../../utils/responseHandler';
import signup from './signup.controller';
import usersService from '../../services/users.services';
import addressService from '../../services/address.services';
import { sendVerificationEmail, verifyEmail } from './email-verification.controller';
import generateCode from '../../utils/codeGenerator';

const { OAuth2Client } = require('google-auth-library');

const { promisify } = require('util');

const randomBytesAsync = promisify(crypto.randomBytes);

exports.login = (req, res, next) => {
  const secret = process.env.TOKEN_SECRET;

  login({
    req,
    res,
    next,
    passport,
    ErrorHandler,
    httpStatusCodes,
    responseHandler,
    jwt,
    secret,
    usersService,
  });
};

exports.loginGoogle = (req, res, next) => {
  const secret = process.env.TOKEN_SECRET;

  loginGoogle({
    req,
    res,
    next,
    passport,
    ErrorHandler,
    httpStatusCodes,
    responseHandler,
    jwt,
    usersService,
    OAuth2Client,
    secret,
  });
};

exports.loginFacebook = (req, res, next) => {
  const secret = process.env.TOKEN_SECRET;

  loginFacebook({
    req,
    res,
    next,
    passport,
    ErrorHandler,
    httpStatusCodes,
    responseHandler,
    jwt,
    usersService,
    secret,
  });
};
exports.loginApple = (req, res, next) => {
  const secret = process.env.TOKEN_SECRET;

  loginApple({
    req,
    res,
    next,
    passport,
    ErrorHandler,
    httpStatusCodes,
    responseHandler,
    jwt,
    usersService,
    secret,
    crypto,
    appleSigninAuth,
  });
};

exports.signup = (req, res, next) => {
  const secret = process.env.TOKEN_SECRET;
  signup({
    req,
    res,
    next,
    ErrorHandler,
    httpStatusCodes,
    responseHandler,
    usersService,
    addressService,
    jwt,
    secret,
  });
};

exports.logout = (req, res) => {
  logout({
    req, res, httpStatusCodes, responseHandler, usersService,
  });
};

exports.forgotPassword = (req, res, next) => {
  forgotPassword({
    req,
    res,
    next,
    usersService,
    ErrorHandler,
    responseHandler,
    httpStatusCodes,
    randomBytesAsync,
    generateCode,
  });
};

exports.verifyCode = (req, res, next) => {
  verifyCode({
    req, res, next, usersService, ErrorHandler, responseHandler, httpStatusCodes,
  });
};

exports.resetPassword = (req, res, next) => {
  resetPassword({
    req, res, next, usersService, ErrorHandler, responseHandler, httpStatusCodes, randomBytesAsync,
  });
};

// EMAIL VERFIFICATION
exports.sendVerificationEmail = (req, res, next) => {
  sendVerificationEmail({
    req,
    res,
    next,
    usersService,
    ErrorHandler,
    responseHandler,
    httpStatusCodes,
    generateCode,
    randomBytesAsync,
  });
};
exports.verifyEmail = (req, res, next) => {
  verifyEmail({
    req,
    res,
    next,
    usersService,
    ErrorHandler,
    responseHandler,
    httpStatusCodes,
    generateCode,
    randomBytesAsync,
  });
};
