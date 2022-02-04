/* eslint-disable no-underscore-dangle */
import User from '../models/User.js';
import log4j from '../config/configLog4js.js';

export default async function createAdmin() {
  try {
    User.findOne({ role: 'ADMIN' }, (err, existingUser) => {
      if (!existingUser) {
        const admin = new User({
          email: 'admin@gmail.com',
          password: 'p@ssword++',
          role: 'ADMIN',
          profile: {
            firstName: 'Admin',
            lastName: 'Admin',
          },
        });
        admin.save();
      }
    });
  } catch (error) {
    log4j.loggerinfo.error('Error creating admin');
  }
}
