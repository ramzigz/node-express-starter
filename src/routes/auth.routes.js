import express from 'express';
import { validate } from 'express-validation';
import * as authValidation from '../validations/auth.validation';
import authMiddleware from '../middlewares/auth.middleware';

import authController from '../controllers/auth';

const routes = express.Router();

routes.post('/login', validate(authValidation.login, { keyByField: true }, { abortEarly: false }), authController.login);
routes.post('/login/google', authController.loginGoogle);
routes.post('/login/facebook', authController.loginFacebook);
routes.post('/login/apple', authController.loginApple);
routes.post('/signup', validate(authValidation.signup, { keyByField: true }, { abortEarly: false }), authController.signup);

routes.post('/forgot-password', authController.forgotPassword);
routes.post('/reset-password/verify-code', authController.verifyCode);
routes.post('/reset-password', authController.resetPassword);

routes.post('/verify-email/send', authMiddleware.isAuthenticated, authController.sendVerificationEmail);
routes.post('/verify-email', authMiddleware.isAuthenticated, authController.verifyEmail);

routes.get('/logout', authMiddleware.isAuthenticated, authController.logout);

module.exports = routes;
