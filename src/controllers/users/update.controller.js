/* eslint-disable no-underscore-dangle */
import filesService from '../../services/file.services';
import deleteFile from '../../utils/deleteFile';

async function createFileAndReturnId(
  {
    file,
    userId,
    oldFile,
    // oldFilePath: oldData.profile.picture.path,
    // oldFileId: oldData.profile.picture._id,
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
    await filesService.delete(oldFile._id);
    deleteFile(oldFile.path);
  }

  const { _id } = await filesService.create(filePayload);
  return _id;
}

export async function update({
  req, res, next, ErrorHandler,
  httpStatusCodes, responseHandler,
  usersService, addressService, isAdmin,
}) {
  const userId = req.params.id || req.user._id;

  if (req.params.id && !isAdmin(req.user)) {
    return next(
      new ErrorHandler(
        httpStatusCodes.FORBIDDEN, 'Not authorized to modify this ressource',
      ),
    );
  }

  const oldData = await usersService.getById(userId, [{
    path: 'profile.picture identitySide1 identitySide2 kbis drivingLicenceSide1 drivingLicenceSide2',
    select: '-__v',
  }]);

  const {
    street,
    postalCode,
    city,
    country,
    regionCode,
    region,
    ...userData
  } = req.body;

  let payload = { ...userData };

  const addressData = {
    street,
    postalCode,
    city,
    country,
    regionCode,
    region,
  };

  if (oldData?.profile?.address) {
    await addressService.update(oldData.profile.address, addressData);
  } else {
    const address = await addressService.create(addressData);
    payload = { ...payload, address: address._id };
  }

  if (req.files) {
    try {
      if (req.files.picture) {
        const file = req.files.picture[0];
        const newFileId = await createFileAndReturnId({
          file,
          userId: oldData._id,
          oldFile: oldData.profile.picture,
        });

        payload = { ...payload, picture: newFileId };
      }

      if (req.files.identitySide1) {
        const file = req.files.identitySide1[0];
        const newFileId = await createFileAndReturnId({
          file,
          userId: oldData._id,
          oldFile: oldData.identitySide1,
        });
        payload = { ...payload, identitySide1: newFileId };
      }

      if (req.files.identitySide2) {
        const file = req.files.identitySide2[0];
        const newFileId = await createFileAndReturnId({
          file,
          userId: oldData._id,
          oldFile: oldData.identitySide2,
        });
        payload = { ...payload, identitySide2: newFileId };
      }

      if (req.files.drivingLicenceSide1) {
        const file = req.files.drivingLicenceSide1[0];
        const newFileId = await createFileAndReturnId({
          file,
          userId: oldData._id,
          oldFile: oldData.drivingLicenceSide1,
        });
        payload = { ...payload, drivingLicenceSide1: newFileId };
      }

      if (req.files.drivingLicenceSide2) {
        const file = req.files.drivingLicenceSide2[0];
        const newFileId = await createFileAndReturnId({
          file,
          userId: oldData._id,
          oldFile: oldData.drivingLicenceSide2,
        });
        payload = { ...payload, drivingLicenceSide2: newFileId };
      }

      if (req.files.kbis) {
        const file = req.files.kbis[0];
        const newFileId = await createFileAndReturnId({
          file,
          userId: oldData._id,
          oldFile: oldData.kbis,
        });
        payload = { ...payload, kbis: newFileId };
      }
    } catch (error) {
      console.log('error adding files', error);
    }
  }

  if (userData.email) {
    const emailAlreadyExist = await usersService.getOne({ email: userData.email });
    if (emailAlreadyExist) {
      return next(
        new ErrorHandler(
          httpStatusCodes.FORBIDDEN, 'Email already used',
        ),
      );
    }
    payload = { ...payload, emailVerified: false };
  }

  if (userData.identitySide1 === null && oldData.identitySide1) {
    payload = { ...payload, identitySide1: null };

    await filesService.delete(oldData.identitySide1._id);
    deleteFile(oldData.identitySide1.path);
  }
  if (userData.identitySide2 === null && oldData.identitySide2) {
    payload = { ...payload, identitySide2: null };
    await filesService.delete(oldData.identitySide2._id);
    deleteFile(oldData.identitySide2.path);
  }
  if (userData.drivingLicenceSide1 === null && oldData.drivingLicenceSide1) {
    payload = { ...payload, drivingLicenceSide1: null };
    await filesService.delete(oldData.drivingLicenceSide1._id);
    deleteFile(oldData.drivingLicenceSide1.path);
  }
  if (userData.drivingLicenceSide2 === null && oldData.drivingLicenceSide2) {
    payload = { ...payload, drivingLicenceSide2: null };
    await filesService.delete(oldData.drivingLicenceSide2._id);
    deleteFile(oldData.drivingLicenceSide2.path);
  }

  const user = await usersService.update(userId, payload, '-tokens -password');

  if (!user || user.error) {
    return next(
      new ErrorHandler(
        httpStatusCodes.INTERNAL_SERVER, user.error,
      ),
    );
  }

  return res.status(httpStatusCodes.OK).json(
    responseHandler({ data: { user }, statusCode: httpStatusCodes.OK }),
  );
}

export async function updatePassword({
  req, res, next, ErrorHandler,
  httpStatusCodes, responseHandler,
  usersService,
}) {
  const {
    oldPassword,
    password,
  } = req.body;

  if (oldPassword === password) {
    return next(
      new ErrorHandler(
        httpStatusCodes.BAD_REQUEST, "You've used that password before. Please choose a different one.",
      ),
    );
  }

  const user = await usersService.getOne({ _id: req.user._id }, '', 'password');
  if (!user) {
    return next(
      new ErrorHandler(
        httpStatusCodes.INTERNAL_SERVER, 'User not exist',
      ),
    );
  }

  return user.comparePassword(oldPassword, async (err, isMatch) => {
    if (err) {
      return next(
        new ErrorHandler(
          httpStatusCodes.INTERNAL_SERVER, 'Can not update password',
        ),
      );
    }
    if (!isMatch) {
      return next(
        new ErrorHandler(
          httpStatusCodes.BAD_REQUEST, 'The current password you have provided is incorrect',
        ),
      );
    }

    user.password = password;

    const newUser = await user.save();

    if (!newUser || newUser.error) {
      return next(
        new ErrorHandler(
          httpStatusCodes.INTERNAL_SERVER, user.error,
        ),
      );
    }
    return res.status(httpStatusCodes.OK).json(
      responseHandler({ message: 'Password updated', statusCode: httpStatusCodes.OK }),
    );
  });
}
