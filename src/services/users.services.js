/* eslint-disable no-underscore-dangle */
import User from '../models/User';

const usersService = {
  async create({
    email,
    firstName,
    lastName,
    password,
    phone,
    role,
    address,
    gender,
    birthdate,
    company,
    userType,
    tokens,
    google,
    apple,
    facebook,
    emailVerified,
  }) {
    try {
      const payload = {
        email,
        profile: {
          firstName,
          lastName,
          phone,
          address: address || null,
          gender,
          birthdate,
        },
        password,
        role,
        company,
        userType,
        tokens,
        google,
        facebook,
        apple,
        emailVerified,
      };

      const user = new User(payload);

      const createdUser = await user.save();
      if (createdUser && !createdUser.error) {
        const newUser = await usersService.getById(createdUser._id);

        return newUser;
      }

      return { error: 'error creating' };
    } catch (err) {
      return { error: err };
    }
  },

  async getUsers({
    populate, filters, offset, limit, sort, select,
  }) {
    try {
      const users = await User.find({ role: { $ne: 'ADMIN' }, ...filters })
        .populate(populate)
        .skip(offset)
        .limit(limit)
        .sort(sort)
        .select(`-password -__v -tokens ${select}`)
        .exec();
      const counts = await User.countDocuments({ role: { $ne: 'ADMIN' }, ...filters });
      return { data: { users, counts } };
    } catch (err) {
      return { error: err };
    }
  },

  async getCounts(filters) {
    try {
      const filter = { role: { $ne: 'ADMIN' }, ...filters };

      const counts = await User.countDocuments(filter);
      return counts;
    } catch (err) {
      return { error: err };
    }
  },

  async getById(id, populate = '', select = '') {
    try {
      const user = await User.findById(id)
        .populate(populate)
        .select(`-__v -password ${select}`)
        .exec();

      return user;
    } catch (err) {
      return { error: err };
    }
  },

  async getOne(filter, populate = '') {
    try {
      if (!filter || Object.keys(filter).length === 0) {
        return null;
      }

      const user = await User.findOne({ ...filter })
        .populate(populate)
        .exec();

      return user;
    } catch (err) {
      return { error: err };
    }
  },

  async update(_id, {
    firstName,
    lastName,
    phone,
    email,
    role,
    address,
    gender,
    birthdate,
    picture,
    tokens,
    isActive,
    company,
    userType,
    identitySide2,
    identitySide1,
    drivingLicenceSide1,
    drivingLicenceSide2,
    kbis,
    iban,
    google,
    facebook,
    apple,
    isVerified,
    stripeCustomerId,
    stripeAccountId,
    emailVerified,
  }, select = '-password -tokens') {
    try {
      const user = await usersService.getById(_id, '');
      if (!user || user.error) return { error: 'Resource not exist' };
      const data = {};
      const profile = {};
      profile.firstName = firstName || user.profile.firstName;
      profile.lastName = lastName || user.profile.lastName;
      profile.phone = phone || user.profile.phone;
      profile.address = address || user.profile.address;
      profile.picture = picture || user.profile.picture;
      profile.gender = gender || user.profile.gender;
      profile.birthdate = birthdate || user.profile.birthdate;
      data.profile = profile;
      data.isActive = isActive && (typeof JSON.parse(isActive) === 'boolean') ? isActive : user.isActive;
      data.isVerified = isVerified && (typeof JSON.parse(isVerified) === 'boolean') ? isVerified : user.isVerified;
      data.tokens = tokens || user.tokens;
      data.company = company || user.company;
      data.userType = userType || user.userType;
      data.email = email || user.email;
      data.emailVerified = email && (typeof JSON.parse(emailVerified) === 'boolean') ? emailVerified : user.emailVerified;
      data.role = role || user.role;
      data.identitySide1 = identitySide1 || user.identitySide1;
      data.identitySide2 = identitySide2 || user.identitySide2;
      data.drivingLicenceSide1 = drivingLicenceSide1 || user.drivingLicenceSide1;
      data.drivingLicenceSide2 = drivingLicenceSide2 || user.drivingLicenceSide2;
      data.kbis = kbis || user.kbis;
      data.iban = iban || user.iban;
      data.google = google || user.google;
      data.facebook = facebook || user.facebook;
      data.apple = apple || user.apple;
      data.stripeCustomerId = stripeCustomerId || user.stripeCustomerId;
      data.stripeAccountId = stripeAccountId || user.stripeAccountId;
      const saving = await User.updateOne({ _id }, { $set: data });

      if (saving && !saving.error) {
        return await usersService.getById(_id, [
          {
            path: 'profile.address',
            select: '-location -__v',
          },
          {
            path: 'profile.picture',
            select: '-__v',
          },
          { path: 'identitySide1 identitySide2 drivingLicenceSide1 drivingLicenceSide2 kbis' },
        ], select);
      }
      return { error: saving.error || 'Error updating' };
    } catch (err) {
      return { error: err };
    }
  },

  async updatePassword(_id, {
    password,
  }) {
    try {
      const user = await usersService.getById(_id, '');
      if (!user || user.error) return { error: 'Resource not exist' };
      const data = { password };

      const saving = await User.updateOne({ _id }, { $set: data });

      if (saving && !saving.error) {
        return await usersService.getById(_id, [
          {
            path: 'profile.address',
            select: '-location -__v',
          },
        ]);
      }
      return { error: saving.error || 'Error updating' };
    } catch (err) {
      return { error: err };
    }
  },

  async delete(id) {
    try {
      const deleted = await User.deleteOne({ _id: id });

      return deleted;
    } catch (err) {
      return { error: err };
    }
  },
};
export default usersService;
