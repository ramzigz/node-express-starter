import DateExtension from '@hapi/joi-date';
import JoiImport from 'joi';

const Joi = JoiImport.extend(DateExtension);

export default{
  // POST /signup
  signup: {
    body: Joi.object({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .required()
        .min(8)
        .max(128),
      firstName: Joi.string().max(128),
      lastName: Joi.string().max(128),
      phone: Joi.string().length(10).pattern(/^[0-9]+$/),
      birthdate: Joi.date().raw(),
      gender: Joi.string()
        .valid('MALE', 'FEMALE', ''),
      street: Joi.string().allow(''),
      postalCode: Joi.string().allow(''),
      city: Joi.string().allow(''),
      country: Joi.string().allow(''),
      region: Joi.string().allow(''),
      regionCode: Joi.string().allow(''),
      userType: Joi.string()
        .valid('LP', 'NP'),
      company: Joi.object({
        street: Joi.string().allow(''),
        postalCode: Joi.string().allow(''),
        city: Joi.string().allow(''),
        country: Joi.string().allow(''),
        siret: Joi.string().allow(''),
        name: Joi.string().allow(''),
        activityType: Joi.string()
          .regex((/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i))
          .messages({
            'string.pattern.base': 'activityType should be a valid mongo id',
          }),
        phone: Joi.string().length(10).pattern(/^[0-9]+$/),
      }),
    }),
  },

  // POST /login
  login: {
    body: Joi.object({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .regex(/[a-zA-Z0-9]{3,30}/)
        .min(8)
        .required(),
    }),
  },

  // POST /v1/auth/facebook
  // POST /v1/auth/google
  oAuth: {
    body: Joi.object({
      token: Joi.string().required(),
    }),
  },

  // POST /v1/auth/refresh
  refresh: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      refreshToken: Joi.string().required(),
    },
  },

  // POST /v1/auth/refresh
  sendPasswordReset: {
    body: {
      email: Joi.string()
        .email()
        .required(),
    },
  },

  // POST /v1/auth/password-reset
  passwordReset: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .required()
        .min(6)
        .max(128),
      resetToken: Joi.string().required(),
    },
  },
};
