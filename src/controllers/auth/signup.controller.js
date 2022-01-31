/* eslint-disable no-underscore-dangle */

import moment from 'moment';

export default async function signup({
  req, res, next,
  ErrorHandler, httpStatusCodes, responseHandler,
  usersService, addressService, activityTypesService,
  jwt, secret,
}) {
  const {
    street,
    postalCode,
    city,
    country,
    regionCode,
    region,
    company,
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

  let usr = { ...userData };

  const existUser = await usersService.getOne({ email: userData.email });
  if (existUser) {
    return next(
      new ErrorHandler(
        httpStatusCodes.BAD_REQUEST, 'User with given email is already exist please try another email', httpStatusCodes.EMAIL_ALREADY_USED,
      ),
    );
  }

  const address = await addressService.create(addressData);

  if (userData?.userType === 'LP' && company) {
    const activityType = await activityTypesService.getById(company.activityType, '', '_id');
    if (!activityType || activityType.error) {
      return next(
        new ErrorHandler(
          httpStatusCodes.BAD_REQUEST, 'Company activityType is not a valid id', httpStatusCodes.BAD_REQUEST,
        ),
      );
    }

    const companyAddressData = {
      street: company.street,
      postalCode: company.postalCode,
      city: company.city,
      country: company.country,
    };

    const companyAddress = await addressService.create(companyAddressData);
    const companyData = {
      address: companyAddress._id,
      siret: company.siret,
      name: company.name,
      activityType: company.activityType,
      phone: company.phone,
    };

    usr = {
      ...usr,
      company: companyData,
      userType: userData.userType,
    };
  } else {
    usr = {
      ...usr,
      company: null,
    };
  }

  usr = {
    ...usr,
    address: address._id,
  };

  const user = await usersService.create(usr);

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
      responseHandler({ data: { user: returnedUser, token }, statusCode: httpStatusCodes.OK }),
    );
  }
  return next(
    new ErrorHandler(
      httpStatusCodes.BAD_REQUEST, user.error, httpStatusCodes.BAD_REQUEST,
    ),
  );
}
