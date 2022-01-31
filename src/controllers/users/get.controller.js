import moment from 'moment';

const get = {
  async all({
    req, res, next, ErrorHandler,
    httpStatusCodes, responseHandler,
    usersService, createFilters,
  }) {
    const limit = Number(req.params.limit);
    const offset = Number(req.params.offset);
    const { filters } = await createFilters(req.query, req.user);
    const { sort } = await createFilters(req.query, req.user);
    const populate = [
      {
        path: 'profile.address profile.picture company.activityType company.address',
        select: '-location -__v',
      },
    ];
    const select = '';

    const response = await usersService.getUsers({
      populate, filters, offset, limit, sort, select,
    });

    if (!response.data || response.error) {
      return next(new ErrorHandler(httpStatusCodes.INTERNAL_SERVER, response.error));
    }
    const { users, counts } = response.data;
    return res.status(httpStatusCodes.OK).json(responseHandler(
      { data: { users, counts } },
    ));
  },

  async one({
    req, res, next, ErrorHandler, httpStatusCodes, responseHandler, usersService,
  }) {
    const { id } = req.params;
    const populate = [
      'profile.picture', 'profile.address',
      'company.activityType', 'company.address',
      'kbis', 'identitySide1', 'identitySide2',
      'drivingLicenceSide1', 'drivingLicenceSide2',
    ];
    const select = ' -password -tokens';
    const user = await usersService.getById(id, populate, select);

    if (!user || user.error) return next(new ErrorHandler(httpStatusCodes.BAD_REQUEST, 'No user'));
    return res.status(httpStatusCodes.OK).json(responseHandler(
      { data: { user } },
    ));
  },

  async myProfile({
    req, res, next, ErrorHandler, httpStatusCodes, responseHandler, usersService,
  }) {
    const { _id } = req.user;

    const populate = [
      'profile.picture', 'profile.address',
      'company.activityType', 'company.address',
      'kbis', 'identitySide1', 'identitySide2',
      'drivingLicenceSide1', 'drivingLicenceSide2'];
    const select = ' -password -tokens';
    const user = await usersService.getById(_id, populate, select);

    if (!user || user.error) return next(new ErrorHandler(httpStatusCodes.BAD_REQUEST, 'No user'));
    return res.status(httpStatusCodes.OK).json(responseHandler(
      { data: { user } },
    ));
  },
  async stats({
    req, res, next, ErrorHandler, httpStatusCodes, responseHandler, usersService,
  }) {
    const usersCounts = await usersService.getCounts({});
    const maleUsersCounts = await usersService.getCounts({ 'profile.gender': 'MALE' });
    const femaleUsersCounts = await usersService.getCounts({ 'profile.gender': 'FEMALE' });
    const otherGenderCounts = usersCounts - (maleUsersCounts + femaleUsersCounts);

    const date30Years = moment().subtract(30, 'years');
    const date50Years = moment().subtract(50, 'years');

    const under30Users = await usersService.getCounts({ 'profile.birthdate': { $gte: new Date(date30Years) } });
    const between3050Users = await usersService.getCounts({ 'profile.birthdate': { $gt: new Date(date50Years), $lte: new Date(date30Years) } });
    const over50Users = await usersService.getCounts({ 'profile.birthdate': { $lt: new Date(date50Years) } });

    const verifiedUsersCounts = await usersService.getCounts({ isVerified: true });
    const unverifiedUsersCounts = await usersService.getCounts({ isVerified: false });

    return res.status(httpStatusCodes.OK).json(responseHandler(
      {
        data: {
          usersCounts,
          maleUsers: (maleUsersCounts / usersCounts) * 100,
          femaleUsers: (femaleUsersCounts / usersCounts) * 100,
          otherGender: (otherGenderCounts / usersCounts) * 100,
          under30Users: (under30Users / usersCounts) * 100,
          between3050Users: (between3050Users / usersCounts) * 100,
          over50Users: (over50Users / usersCounts) * 100,
          verifiedUsersCounts: (verifiedUsersCounts / usersCounts) * 100,
          unverifiedUsersCounts: (unverifiedUsersCounts / usersCounts) * 100,
        },
      },
    ));
  },
};

export default get;
