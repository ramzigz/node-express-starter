import passport from 'passport';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import util from 'util';
import httpStatusCodes from '../../utils/httpStatusCodes.js';
import login from './login.controller.js';
import logout from './logout.controller.js';
import * as reserPasswordController from './reset-password.controller.js';
import { ErrorHandler } from '../../utils/errorsHandler.js';
import responseHandler from '../../utils/responseHandler.js';
import signupUser from './signup.controller.js';
import * as emailVerificationController from './email-verification.controller.js';
import generateCode from '../../utils/codeGenerator.js';
import sendMail from '../../utils/sendEmail.js';
import verifyEmailTemplate from '../../utils/verifyEmailTemplate.js';
import crudHandler from '../../services/crudHandler.js';

const randomBytesAsync = util.promisify(crypto.randomBytes);

const signin = (req, res, next) => {
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
    crudHandler,
    jwt,
    secret,
  });
};

const logoutUser = (req, res) => {
  logout({
    req, res, httpStatusCodes, responseHandler, crudHandler,
  });
};

const forgotPassword = (req, res, next) => {
  reserPasswordController.forgotPassword({
    req,
    res,
    next,
    crudHandler,
    ErrorHandler,
    responseHandler,
    httpStatusCodes,
    randomBytesAsync,
    generateCode,
  });
};

const verifyCode = (req, res, next) => {
  reserPasswordController.verifyCode({
    req, res, next, crudHandler, ErrorHandler, responseHandler, httpStatusCodes,
  });
};

const resetPassword = (req, res, next) => {
  reserPasswordController.resetPassword({
    req, res, next, crudHandler, ErrorHandler, responseHandler, httpStatusCodes, randomBytesAsync,
  });
};

// EMAIL VERFIFICATION
const sendVerificationEmail = (req, res, next) => {
  emailVerificationController.sendVerificationEmail({
    req,
    res,
    next,
    crudHandler,
    ErrorHandler,
    responseHandler,
    httpStatusCodes,
    generateCode,
    randomBytesAsync,
    sendMail,
    verifyEmailTemplate,
  });
};

const verifyEmail = (req, res, next) => {
  emailVerificationController.verifyEmail({
    req,
    res,
    next,
    crudHandler,
    ErrorHandler,
    responseHandler,
    httpStatusCodes,
    generateCode,
    randomBytesAsync,
  });
};

export default {
  signin,
  signup,
  verifyCode,
  resetPassword,
  verifyEmail,
  sendVerificationEmail,
  forgotPassword,
  logoutUser,
};
