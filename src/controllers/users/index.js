import { ErrorHandler } from '../../utils/errorsHandler';
import httpStatusCodes from '../../utils/httpStatusCodes';
import responseHandler from '../../utils/responseHandler';
import usersService from '../../services/users.services';
import addressService from '../../services/address.services';
import filesService from '../../services/file.services';

import get from './get.controller';
import { isAdmin } from '../../helpers/checkAuth';
import createFilters from '../../helpers/createFilters';
import { update, updatePassword } from './update.controller';
import deleteUser from './delete.controller';
import deleteFile from '../../utils/deleteFile';

exports.getAll = (req, res, next) => {
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

exports.getOne = (req, res, next) => {
  get.one({
    req, res, next, ErrorHandler, httpStatusCodes, responseHandler, usersService,
  });
};

exports.getMyProfile = (req, res, next) => {
  get.myProfile({
    req, res, next, ErrorHandler, httpStatusCodes, responseHandler, usersService,
  });
};

exports.getUsersStats = (req, res, next) => {
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

exports.update = (req, res, next) => {
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
exports.updatePassword = (req, res, next) => {
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

exports.delete = (req, res, next) => {
  deleteUser({
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
