/* eslint-disable no-underscore-dangle */

async function removeUserRessources(userId, reservationsService, adsService) {
  const adsPromises = [];
  const reservationsPromises = [];
  const { data: { ads } } = await adsService.getAll({
    filters: { owner: userId }, select: '_id',
  });
  for (let index = 0; index < ads.length; index += 1) {
    const adId = ads[index]._id;
    adsPromises.push(adsService.update(adId, { status: 'DELETED' }));
  }

  const { data: { reservations } } = await reservationsService.getAll({
    filters: { createdBy: userId }, select: '_id',
  });
  for (let index = 0; index < reservations.length; index += 1) {
    const reservationId = reservations[index]._id;
    reservationsPromises.push(reservationsService.update(reservationId, { status: 'DELETED' }));
  }

  Promise.all(adsPromises);
  Promise.all(reservationsPromises);
}

export default async function deleteUser({
  req, res, next, ErrorHandler,
  httpStatusCodes, responseHandler,
  usersService, addressService, reservationsService, adsService,
  filesService, deleteFile,
}) {
  try {
    const userId = req.params.id;

    const oldData = await usersService.getById(userId, 'profile.picture');
    if (!oldData) {
      return next(
        new ErrorHandler(
          httpStatusCodes.BAD_REQUEST, 'Ressource not exist',
        ),
      );
    }

    const deleted = await usersService.delete(userId);

    if (!deleted || deleted.error) {
      return next(
        new ErrorHandler(
          httpStatusCodes.INTERNAL_SERVER, deleted.error,
        ),
      );
    }

    removeUserRessources(userId, reservationsService, adsService);

    if (oldData?.profile?.address) {
      await addressService.delete(oldData.profile.address);
    }

    if (oldData.profile?.picture) {
      await filesService.delete(oldData.profile?.picture._id);
      deleteFile(oldData.profile?.picture.path);
    }

    return res.status(httpStatusCodes.OK).json(
      responseHandler({ data: deleted, statusCode: httpStatusCodes.OK }),
    );
  } catch (error) {
    console.log('error delete user', error);
    return next(
      new ErrorHandler(
        httpStatusCodes.INTERNAL_SERVER, error,
      ),
    );
  }
}
