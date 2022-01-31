import DateExtension from '@hapi/joi-date';
import JoiImport from 'joi';

const Joi = JoiImport.extend(DateExtension);

module.exports = {

  // PATCH USER
  updateUser: {
    body: Joi.object({
      email: Joi.string()
        .email(),
      firstName: Joi.string().max(128),
      lastName: Joi.string().max(128),
      phone: Joi.string().length(10).pattern(/^[0-9]+$/),
      birthdate: Joi.date()
        .raw(),
      gender: Joi.string()
        .valid('MALE', 'FEMALE', ''),
      street: Joi.string().allow(''),
      postalCode: Joi.string().allow(''),
      city: Joi.string().allow(''),
      country: Joi.string().allow(''),
      region: Joi.string().allow(''),
      regionCode: Joi.string().allow(''),
      isActive: Joi.boolean(),
      isVerified: Joi.boolean(),
      iban: Joi.string().max(34).allow(''),
      identitySide1: Joi.allow(null),
      identitySide2: Joi.allow(null),
      drivingLicenceSide1: Joi.allow(null),
      drivingLicenceSide2: Joi.allow(null),
      company: Joi.object({
        street: Joi.string().allow(''),
        postalCode: Joi.string().allow(''),
        city: Joi.string().allow(''),
        country: Joi.string().allow(''),
        siret: Joi.string(),
        name: Joi.string(),
        activityType: Joi.string()
          .regex((/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i))
          .messages({
            'string.pattern.base': 'activityType should be a valid mongo id',
          }).allow(null),
        phone: Joi.string().length(10).pattern(/^[0-9]+$/).allow(''),
      }),
    }),
  },
  // PATCH USER
  updateUserAsAdmin: {
    body: Joi.object({
      firstName: Joi.string().max(128),
      lastName: Joi.string().max(128),
      phone: Joi.string().length(10).pattern(/^[0-9]+$/).allow(''),
      birthdate: Joi.date()
        .raw(),
      gender: Joi.string()
        .valid('MALE', 'FEMALE', ''),
      userType: Joi.string()
        .valid('LP', 'NP'),
      street: Joi.string(),
      postalCode: Joi.string(),
      city: Joi.string(),
      country: Joi.string(),
      region: Joi.string(),
      regionCode: Joi.string(),
      isActive: Joi.boolean(),
      isVerified: Joi.boolean(),
      email: Joi.string()
        .email(),
      emailVerified: Joi.boolean(),
      role: Joi.string()
        .valid('ADMIN', 'CLIENT'),
      iban: Joi.string().max(34).allow(''),
      identitySide1: Joi.allow(null),
      identitySide2: Joi.allow(null),
      drivingLicenceSide1: Joi.allow(null),
      drivingLicenceSide2: Joi.allow(null),
      company: Joi.object({
        street: Joi.string(),
        postalCode: Joi.string(),
        city: Joi.string(),
        country: Joi.string(),
        siret: Joi.string(),
        name: Joi.string(),
        activityType: Joi.string()
          .regex((/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i))
          .messages({
            'string.pattern.base': 'activityType should be a valid mongo id',
          }),
        phone: Joi.string().length(10).pattern(/^[0-9]+$/).allow(''),
        kbis: Joi.string()
          .regex((/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i))
          .messages({
            'string.pattern.base': 'activityType should be a valid mongo id',
          }).allow(null),
      }),
    }),
  },

  // PATCH USER
  updatePassword: {
    body: Joi.object({
      password: Joi.string()
        .required()
        .min(8)
        .max(128),
      oldPassword: Joi.string()
        .required()
        .min(8)
        .max(128),
    }),
  },
};
