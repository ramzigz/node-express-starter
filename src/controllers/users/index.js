import { ErrorHandler } from '../../utils/errorsHandler.js';
import httpStatusCodes from '../../utils/httpStatusCodes.js';
import responseHandler from '../../utils/responseHandler.js';
import usersService from '../../services/users.services.js';
import addressService from '../../services/address.services.js';
import filesService from '../../services/file.services.js';

import get from './get.controller.js';
import { isAdmin } from '../../helpers/checkAuth.js';
import createFilters from '../../helpers/createFilters.js';
import { update, updatePassword } from './update.controller.js';
import deleteUsr from './delete.controller.js';
import deleteFile from '../../utils/deleteFile.js';

const getAll = (req, res, next) => {
  get.all({
    req,
    res,
    next,
    ErrorHandler,
    httpStatusCodes,
    responseHandler,
    usersService,
    createFilters,
  });
};

const getOne = (req, res, next) => {
  get.one({
    req, res, next, ErrorHandler, httpStatusCodes, responseHandler, usersService,
  });
};

const getMyProfile = (req, res, next) => {
  get.myProfile({
    req, res, next, ErrorHandler, httpStatusCodes, responseHandler, usersService,
  });
};

const getUsersStats = (req, res, next) => {
  get.stats({
    req,
    res,
    next,
    ErrorHandler,
    httpStatusCodes,
    responseHandler,
    usersService,
    createFilters,
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
    usersService,
    addressService,
    filesService,
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
    usersService,
    addressService,
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
    usersService,
    addressService,
    filesService,
    deleteFile,
  });
};

export {
  deleteUser,
  updateUserPassword,
  updateUser,
  getUsersStats,
  getMyProfile,
  getOne,getAll
}
