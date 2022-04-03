/* eslint-disable no-underscore-dangle */

import moment from 'moment';

export default async function signup({
  req, res, next,
  ErrorHandler, httpStatusCodes, responseHandler,
  crudHandler,
  jwt, secret,
}) {
  const {
    street,
    postalCode,
    city,
    country,
    regionCode,
    region,
    ...userData
  } = req.body;

  const addressData = {
    street,
    postalCode,
    city,
    country,
    regionCode,
    region,
  };

  const existUser = await crudHandler.getOne({
    model: 'User',
    filters: { email: userData.email },
  });

  if (existUser) {
    return next(
      new ErrorHandler(
        httpStatusCodes.BAD_REQUEST,
        'User with given email is already exist please try another email',
        httpStatusCodes.EMAIL_ALREADY_USED,
      ),
    );
  }

  const address = await crudHandler.create({ model: 'Address', data: addressData });

  const usrData = {
    ...userData,
    address: address._id,
  };

  const user = await crudHandler.create({ model: 'User', data: usrData });

  if (user && !user.error) {
    const returnedUser = {
      _id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign({
      data: { user: returnedUser },
    }, secret, { expiresIn: '7d' });

    user.tokens.push({
      kind: 'local',
      token,
      accessTokenExpires: moment().add(7, 'days').format(),
      refreshToken: '',
    });

    user.save();

    return res.status(httpStatusCodes.OK).json(
      responseHandler({ data: { user: returnedUser, token },
        statusCode: httpStatusCodes.OK }),
    );
  }
  return next(
    new ErrorHandler(
      httpStatusCodes.BAD_REQUEST,
      user.error,

      httpStatusCodes.BAD_REQUEST,
    ),
  );
}
