/* eslint-disable no-underscore-dangle */
export default async function deleteUser({
  req, res, next, ErrorHandler,
  httpStatusCodes, responseHandler,
  crudHandler, deleteFile,
}) {
  try {
    const userId = req.params.id;

    const oldData = await crudHandler.getById({ id: userId, populate: 'profile.picture' });
    if (!oldData) {
      return next(
        new ErrorHandler(httpStatusCodes.BAD_REQUEST, 'Ressource not exist',),
      );
    }

    const deleted = await crudHandler.delete({ id: userId });

    if (!deleted || deleted.error) {
      return next(
        new ErrorHandler(httpStatusCodes.INTERNAL_SERVER, deleted.error,),
      );
    }

    if (oldData?.profile?.address) {
      await crudHandler.delete({ id: oldData.profile.address });
    }

    if (oldData.profile?.picture) {
      await crudHandler.delete({ id: oldData.profile?.picture._id });
      deleteFile(oldData.profile?.picture.path);
    }

    return res.status(httpStatusCodes.OK).json(
      responseHandler({ data: deleted, statusCode: httpStatusCodes.OK }),
    );
  } catch (error) {
    return next(
      new ErrorHandler(httpStatusCodes.INTERNAL_SERVER, error,),
    );
  }
}
