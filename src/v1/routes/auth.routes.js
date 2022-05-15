import express from 'express';
import { validate } from 'express-validation';
import authMiddleware from '../../middlewares/auth.middleware.js';
import authValidation from '../validations/auth.validation.js';

import authController from '../controllers/auth/index.js';

const authRoutes = express.Router();

authRoutes.post(
  '/login',
  validate(authValidation.login, { keyByField: true }, { abortEarly: false }),
  authController.signin
);

authRoutes.post(
  '/signup',
  validate(authValidation.signup, { keyByField: true }, { abortEarly: false }),
  authController.signup
);

authRoutes.post('/forgot-password', authController.forgotPassword);
authRoutes.post('/reset-password/verify-code', authController.verifyCode);
authRoutes.post('/reset-password', authController.resetPassword);

authRoutes.post('/verify-email/send', authMiddleware.isAuthenticated, authController.sendVerificationEmail);
authRoutes.post('/verify-email', authMiddleware.isAuthenticated, authController.verifyEmail);

authRoutes.get('/logout', authMiddleware.isAuthenticated, authController.logoutUser);

export default authRoutes;
