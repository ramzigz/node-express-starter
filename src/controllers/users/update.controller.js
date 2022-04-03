/* eslint-disable no-underscore-dangle */
import deleteFile from '../../utils/deleteFile.js';

async function createFileAndReturnId(
  {
    file,
    userId,
    oldFile,
    crudHandler,
  },
) {
  const filePayload = {
    filename: file.filename,
    originalname: file.originalname,
    encoding: file.encoding,
    mimetype: file.mimetype,
    path: file.path,
    size: file.size,
    owner: userId,
  };

  if (oldFile) {
    await crudHandler.delete(oldFile._id);
    deleteFile(oldFile.path);
  }

  const { _id } = await crudHandler.create(filePayload);
  return _id;
}

export async function update({
  req, res, next, ErrorHandler,
  httpStatusCodes, responseHandler,
  crudHandler, isAdmin,
}) {
  const userId = req.params.id || req.user._id;

  if (req.params.id && !isAdmin(req.user)) {
    return next(
      new ErrorHandler(httpStatusCodes.FORBIDDEN, 'Not authorized to modify this ressource',),
    );
  }

  const oldData = await crudHandler.getById({
    model: 'User',
    id: userId,
    populate: [{
      path: 'profile.picture',
      select: '-__v',
    }],
  });

  const {
    street,
    postalCode,
    city,
    country,
    regionCode,
    region,
    ...userData
  } = req.body;

  const {
    email,
    ...profile
  } = userData;

  let payload = { profile, email };

  const addressData = {
    street,
    postalCode,
    city,
    country,
    regionCode,
    region,
  };

  if (oldData?.profile?.address) {
    await crudHandler.update({
      model: 'Address',
      id: oldData.profile.address,
      data: addressData,
    });
  } else {
    const address = await crudHandler.create({ model: 'Address', data: addressData });
    payload = { ...payload, profile: { ...profile, address: address._id } };
  }

  if (req.files) {
    try {
      if (req.files.picture) {
        const file = req.files.picture[0];
        const newFileId = await createFileAndReturnId({
          file,
          userId: oldData._id,
          oldFile: oldData.profile.picture,
          crudHandler,
        });

        payload = { ...payload, picture: newFileId };
      }
    } catch (error) {
      console.log('error adding files', error);
    }
  }

  if (userData.email) {
    const emailAlreadyExist = await crudHandler.getOne({ filters: { email: userData.email } });
    if (emailAlreadyExist) {
      return next(
        new ErrorHandler(httpStatusCodes.FORBIDDEN, 'Email already used',),
      );
    }
    payload = { ...payload, emailVerified: false };
  }

  const user = await crudHandler.update({
    model: 'User',
    id: userId,
    data: payload,
    select: '-tokens -password',
  });

  if (!user || user.error) {
    return next(
      new ErrorHandler(httpStatusCodes.INTERNAL_SERVER, user.error,),
    );
  }

  return res.status(httpStatusCodes.OK).json(
    responseHandler({ data: { user }, statusCode: httpStatusCodes.OK }),
  );
}

export async function updatePassword({
  req, res, next, ErrorHandler,
  httpStatusCodes, responseHandler,
  crudHandler,
}) {
  const {
    oldPassword,
    password,
  } = req.body;

  if (oldPassword === password) {
    return next(
      new ErrorHandler(
        httpStatusCodes.BAD_REQUEST,
        "You've used that password before. Please choose a different one."
      ),
    );
  }

  const user = await crudHandler.getOne({ filters: { id: req.user._id }, select: 'password' });

  if (!user) {
    return next(
      new ErrorHandler(httpStatusCodes.INTERNAL_SERVER, 'User not exist',),
    );
  }

  return user.comparePassword(oldPassword, async (err, isMatch) => {
    if (err) {
      return next(
        new ErrorHandler(httpStatusCodes.INTERNAL_SERVER, 'Can not update password',),
      );
    }
    if (!isMatch) {
      return next(
        new ErrorHandler(httpStatusCodes.BAD_REQUEST, 'The current password you have provided is incorrect',),
      );
    }

    user.password = password;

    const newUser = await user.save();

    if (!newUser || newUser.error) {
      return next(
        new ErrorHandler(httpStatusCodes.INTERNAL_SERVER, user.error,),
      );
    }
    return res.status(httpStatusCodes.OK).json(
      responseHandler({ message: 'Password updated', statusCode: httpStatusCodes.OK }),
    );
  });
}
