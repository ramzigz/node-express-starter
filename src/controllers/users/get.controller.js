const get = {
  async all({
    req, res, next, ErrorHandler,
    httpStatusCodes, responseHandler,
    crudHandler, createFilters,
  }) {
    const limit = Number(req.params.limit);
    const offset = Number(req.params.offset);
    const { filters } = await createFilters(req.query, req.user);
    const { sort } = await createFilters(req.query, req.user);
    const populate = [
      {
        path: 'profile.address profile.picture',
        select: '-location -__v',
      },
    ];
    const select = '';

    const response = await crudHandler.getList({
      model: 'User',
      populate,
      filters,
      offset,
      limit,
      sort,
      select,
    });

    if (!response.data || response.error) {
      return next(new ErrorHandler(httpStatusCodes.INTERNAL_SERVER, response.error));
    }
    const { list, counts } = response.data;
    return res.status(httpStatusCodes.OK).json(responseHandler(
      { data: { users: list, counts } },
    ));
  },

  async one({
    req, res, next, ErrorHandler, httpStatusCodes, responseHandler, crudHandler,
  }) {
    const { id } = req.params;
    const populate = [
      'profile.picture', 'profile.address',
    ];
    const select = ' -password -tokens';
    const user = await crudHandler.getById({ id, populate, select });

    if (!user || user.error) return next(new ErrorHandler(httpStatusCodes.BAD_REQUEST, 'No user'));
    return res.status(httpStatusCodes.OK).json(responseHandler(
      { data: { user } },
    ));
  },

  async myProfile({
    req, res, next, ErrorHandler, httpStatusCodes, responseHandler, crudHandler,
  }) {
    const { _id } = req.user;

    const populate = [
      'profile.picture', 'profile.address'];
    const select = ' -password -tokens';
    const user = await crudHandler.getById({ model: 'User', id: _id, populate, select });

    if (!user || user.error) return next(new ErrorHandler(httpStatusCodes.BAD_REQUEST, 'No user'));
    return res.status(httpStatusCodes.OK).json(responseHandler(
      { data: { user } },
    ));
  },
};

export default get;
