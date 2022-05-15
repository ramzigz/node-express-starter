import { ErrorHandler } from '../../../utils/errorsHandler.js';
import httpStatusCodes from '../../../utils/httpStatusCodes.js';
import responseHandler from '../../../utils/responseHandler.js';
import get from './get.controller.js';
import { isAdmin } from '../../../helpers/checkAuth.js';
import createFilters from '../../../helpers/createFilters.js';
import { update, updatePassword } from './update.controller.js';
import deleteUsr from './delete.controller.js';
import deleteFile from '../../../utils/deleteFile.js';
import crudHandler from '../../../utils/crudHandler.js';

const getAll = (req, res, next) => {
  get.all({
    req,
    res,
    next,
    ErrorHandler,
    httpStatusCodes,
    responseHandler,
    crudHandler,
    createFilters,
  });
};

const getOne = (req, res, next) => {
  get.one({
    req,
    res,
    next,
    ErrorHandler,
    httpStatusCodes,
    responseHandler,
    crudHandler,
  });
};

const getMyProfile = (req, res, next) => {
  get.myProfile({
    req,
    res,
    next,
    ErrorHandler,
    httpStatusCodes,
    responseHandler,
    crudHandler,
  });
};

const updateUser = (req, res, next) => {
  update({
    req,
    res,
    next,
    ErrorHandler,
    httpStatusCodes,
    responseHandler,
    crudHandler,
    isAdmin,
    deleteFile,
  });
};

const updateUserPassword = (req, res, next) => {
  updatePassword({
    req,
    res,
    next,
    ErrorHandler,
    httpStatusCodes,
    responseHandler,
    crudHandler,
    isAdmin,
  });
};

const deleteUser = (req, res, next) => {
  deleteUsr({
    req,
    res,
    next,
    ErrorHandler,
    httpStatusCodes,
    responseHandler,
    crudHandler,
    deleteFile,
  });
};

export {
  deleteUser,
  updateUserPassword,
  updateUser,
  getMyProfile,
  getOne, getAll,
};
