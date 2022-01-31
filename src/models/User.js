import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, minlength: 8 },
    passwordResetToken: String,
    passwordResetExpires: Date,

    emailVerificationToken: String,
    emailVerificationCode: String,
    emailVerified: { type: Boolean, default: false },

    tokens: [],
    google: String,
    facebook: String,
    apple: String,

    profile: {
      firstName: { type: String, required: false, default: '' },
      lastName: { type: String, required: false, default: '' },
      gender: {
        type: String,
        enum: ['MALE', 'FEMALE', 'OTHER', ''],
        message: 'gender is either MALE, FEMALE, OTHER.',
        default: '',
      },
      picture: { type: Schema.Types.ObjectId, ref: 'File', default: null },
      birthdate: { type: Date, default: null },
      address: { type: Schema.Types.ObjectId, ref: 'Address', default: null },
      phone: { type: String, required: false, default: '' },
    },

    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ['ADMIN', 'CLIENT'],
      default: 'CLIENT',
      required: true,
    },

    userType: {
      type: String,
      enum: ['LP', 'NP'],
      default: 'NP',
      required: true,
    },

    company: {
      siret: { type: String, default: '' },
      name: { type: String, default: '' },
      activityType: { type: Schema.Types.ObjectId, ref: 'ActivityType', default: null },
      address: { type: Schema.Types.ObjectId, ref: 'Address', default: null },
      phone: { type: String, default: '' },
    },

    iban: { type: String, maxlength: 34 },
    kbis: { type: Schema.Types.ObjectId, ref: 'File', default: null },
    identitySide1: { type: Schema.Types.ObjectId, ref: 'File', default: null },
    identitySide2: { type: Schema.Types.ObjectId, ref: 'File', default: null },
    drivingLicenceSide1: { type: Schema.Types.ObjectId, ref: 'File', default: null },
    drivingLicenceSide2: { type: Schema.Types.ObjectId, ref: 'File', default: null },

    stripeCustomerId: String,
    stripeAccountId: String,

  },
  { timestamps: true, versionKey: false },
);

/**
 * Password hash middleware.
 * */
userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  return bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    return bcrypt.hash(user.password, salt, (bcryptErr, bcryptHash) => {
      if (err) {
        return next(err);
      }
      user.password = bcryptHash;
      return next();
    });
  });
});

/**
 * Password update middleware.
 */
userSchema.pre('update', function save(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  return bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    return bcrypt.hash(user.password, salt, (bcryptErr, bcryptHash) => {
      if (err) {
        return next(err);
      }
      user.password = bcryptHash;
      return next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
