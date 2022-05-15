import express from 'express';
import { validate } from 'express-validation';
import fs from 'fs';
import mime from 'mime';
import multer from 'multer';
import * as userController from '../controllers/users/index.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import limits from '../../utils/fileValidation.js';
import usersValidation from '../validations/users.validation.js';

import * as imageFilter from '../../utils/isImage.js';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    fs.mkdirSync('uploads/users', { recursive: true });
    cb(null, 'uploads/users');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${Date.now()}.${mime.getExtension(
        file.mimetype === 'image/jpg' ? 'image/jpeg' : file.mimetype
      )}`,
    ); // Appending extension
  },
});

const uploadMany = multer({ storage, fileFilter: imageFilter, limits });
const userRoutes = express.Router();

userRoutes.route('/me')
  .patch(
    authMiddleware.isAuthenticated,
    uploadMany.fields([
      { name: 'picture', maxCount: 1 },
    ]),
    validate(usersValidation.updateUser, { keyByField: true }, { abortEarly: false }),
    userController.updateUser,
  )
  .get(authMiddleware.isAuthenticated, userController.getMyProfile);

userRoutes.get('/:offset/:limit', authMiddleware.isAuthorized, userController.getAll);
userRoutes.get('/', authMiddleware.isAuthorized, userController.getAll);

userRoutes.route('/password')
  .patch(
    authMiddleware.isAuthenticated,
    validate(usersValidation.updatePassword, { keyByField: true }, { abortEarly: false }),
    userController.updateUserPassword,
  );

userRoutes.route('/:id')
  .get(authMiddleware.isAuthorized, userController.getOne)
  .patch(
    authMiddleware.isAuthorized,
    uploadMany.fields([
      { name: 'picture', maxCount: 1 },
    ]),
    validate(
      usersValidation.updateUserAsAdmin,
      { keyByField: true },
      { abortEarly: false }
    ),
    userController.updateUser,
  )
  .delete(authMiddleware.isAuthorized, userController.deleteUser);
export default userRoutes;
