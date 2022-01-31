import express from 'express';
import { validate } from 'express-validation';
import fs from 'fs';
import mime from 'mime';
import userController from '../controllers/users';
import authMiddleware from '../middlewares/auth.middleware';
import limits from '../utils/fileValidation';
import * as usersValidation from '../validations/users.validation';

const multer = require('multer');
const { default: imageFilter } = require('../utils/isImage');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    fs.mkdirSync('uploads/users', { recursive: true });
    cb(null, 'uploads/users');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${Date.now()}.${mime.getExtension(file.mimetype === 'image/jpg' ? 'image/jpeg' : file.mimetype)}`,
    ); // Appending extension
  },
});

const uploadMany = multer({ storage, fileFilter: imageFilter, limits });

const routes = express.Router();

routes.route('/profile')
  .patch(
    authMiddleware.isAuthenticated,
    uploadMany.fields([
      { name: 'picture', maxCount: 1 },
      { name: 'kbis', maxCount: 1 },
      { name: 'identitySide1', maxCount: 1 },
      { name: 'identitySide2', maxCount: 1 },
      { name: 'drivingLicenceSide1', maxCount: 1 },
      { name: 'drivingLicenceSide2', maxCount: 1 },
    ]),
    validate(usersValidation.updateUser, { keyByField: true }, { abortEarly: false }),
    userController.update,
  )
  .get(authMiddleware.isAuthenticated, userController.getMyProfile);

routes.get('/:offset/:limit', authMiddleware.isAuthorized, userController.getAll);
routes.get('/', authMiddleware.isAuthorized, userController.getAll);

routes.get('/stats', authMiddleware.isAuthorized, userController.getUsersStats);

routes.route('/password')
  .patch(
    authMiddleware.isAuthenticated,
    validate(usersValidation.updatePassword, { keyByField: true }, { abortEarly: false }),
    userController.updatePassword,
  );

routes.route('/:id')
  .get(authMiddleware.isAuthorized, userController.getOne)
  .patch(
    authMiddleware.isAuthorized,
    uploadMany.fields([
      { name: 'picture', maxCount: 1 },
      { name: 'kbis', maxCount: 1 },
      { name: 'identitySide1', maxCount: 1 },
      { name: 'identitySide2', maxCount: 1 },
      { name: 'drivingLicenceSide1', maxCount: 1 },
      { name: 'drivingLicenceSide2', maxCount: 1 },
    ]),
    validate(usersValidation.updateUserAsAdmin, { keyByField: true }, { abortEarly: false }),
    userController.update,
  )
  .delete(authMiddleware.isAuthorized, userController.delete);

module.exports = routes;
