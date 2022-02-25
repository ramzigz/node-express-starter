import passport from 'passport';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import appleSigninAuth from 'apple-signin-auth';
import * as OAuth2Client from 'google-auth-library';
import util from 'util';
import httpStatusCodes from '../../utils/httpStatusCodes.js';
import * as login from './login.controller.js';
import logout from './logout.controller.js';
import * as reserPasswordController from './reset-password.controller.js';
import { ErrorHandler } from '../../utils/errorsHandler.js';
import responseHandler from '../../utils/responseHandler.js';
import signupUser from './signup.controller.js';
import usersService from '../../services/users.services.js';
import addressService from '../../services/address.services.js';
import * as emailVerificationController from './email-verification.controller.js';
import generateCode from '../../utils/codeGenerator.js';

const randomBytesAsync = util.promisify(crypto.randomBytes);

const signin = (req, res, next) => {
  const secret = process.env.TOKEN_SECRET;
  login.login({
    req,
    res,
    next,
    passport,
    ErrorHandler,
    httpStatusCodes,
    responseHandler,
    jwt,
    secret,
  });
};

const loginGoogle = (req, res, next) => {
  const secret = process.env.TOKEN_SECRET;

  login.loginGoogle({
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

const loginFacebook = (req, res, next) => {
  const secret = process.env.TOKEN_SECRET;

  login.loginFacebook({
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

const loginApple = (req, res, next) => {
  const secret = process.env.TOKEN_SECRET;

  login.loginApple({
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

const signup = (req, res, next) => {
  const secret = process.env.TOKEN_SECRET;
  signupUser({
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

const logoutUser = (req, res) => {
  logout({
    req, res, httpStatusCodes, responseHandler, usersService,
  });
};

const forgotPassword = (req, res, next) => {
  reserPasswordController.forgotPassword({
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

const verifyCode = (req, res, next) => {
  reserPasswordController.verifyCode({
    req, res, next, usersService, ErrorHandler, responseHandler, httpStatusCodes,
  });
};

const resetPassword = (req, res, next) => {
  reserPasswordController.resetPassword({
    req, res, next, usersService, ErrorHandler, responseHandler, httpStatusCodes, randomBytesAsync,
  });
};

// EMAIL VERFIFICATION
const sendVerificationEmail = (req, res, next) => {
  emailVerificationController.sendVerificationEmail({
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

const verifyEmail = (req, res, next) => {
  emailVerificationController.verifyEmail({
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

export default {
  signin,
  loginApple,
  loginFacebook,
  signup,
  verifyCode,
  resetPassword,
  verifyEmail,
  sendVerificationEmail,
  loginGoogle,
  forgotPassword,
  logoutUser,
};
