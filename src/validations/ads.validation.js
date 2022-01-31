import DateExtension from '@hapi/joi-date';
import JoiImport from 'joi';

const Joi = JoiImport.extend(DateExtension);

module.exports = {

  // CREATE
  create: {
    body: Joi.object({
      title: Joi.string()
        .required(),
      description: Joi.string()
        .allow(''),
      phone: Joi.string().length(10).pattern(/^[0-9]+$/)
        .required(),
      email: Joi.string()
        .email()
        .required(),
      category: Joi.string()
        .regex((/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i))
        .required()
        .messages({
          'string.pattern.base': 'category should be a valid mongo id',
        }),
      street: Joi.string().allow(''),
      postalCode: Joi.string().allow(''),
      city: Joi.string().allow(''),
      country: Joi.string().allow(''),
      regionCode: Joi.string()
        .allow(''),
      region: Joi.string()
        .allow(''),
      latitude: Joi.string(),
      longitude: Joi.string(),
      prices: Joi.array().items(
        Joi.object({
          amount: Joi.number().required(),
          period: Joi.string()
            .valid('HOUR', 'DAY', 'MONTH')
            .required(),
          tax: Joi.number(),
          isDefault: Joi.boolean(),
        }),
      ).required(),
      features: Joi.array().items(
        Joi.object({
          _id: Joi.string().required(),
          value: Joi.alternatives().try(Joi.array(), Joi.string()),
        }),
      ),
      beginDate: Joi.date()
        .raw()
        .required(),
      endDate: Joi.date()
        .raw()
        .required(),
      isActive: Joi.boolean(),
      reservationType: Joi.string()
        .valid('AUTO', 'MANUAL'),
    }),
  },
  // PATCH
  update: {
    body: Joi.object({
      title: Joi.string(),
      description: Joi.string()
        .allow(''),
      phone: Joi.string().length(10).pattern(/^[0-9]+$/),
      email: Joi.string(),
      category: Joi.string()
        .regex((/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i))
        .messages({
          'string.pattern.base': 'category should be a valid mongo id',
        }),
      street: Joi.string().allow(''),
      postalCode: Joi.string().allow(''),
      city: Joi.string().allow(''),
      country: Joi.string().allow(''),
      regionCode: Joi.string()
        .allow(''),
      region: Joi.string()
        .allow(''),
      latitude: Joi.string(),
      longitude: Joi.string(),
      prices: Joi.array().items(
        Joi.object({
          amount: Joi.number().required(),
          period: Joi.string()
            .valid('HOUR', 'DAY', 'MONTH')
            .required(),
          tax: Joi.number(),
          isDefault: Joi.boolean(),
        }),
      ),
      features: Joi.array().items(
        Joi.object({
          _id: Joi.string().required(),
          value: Joi.alternatives().try(Joi.array(), Joi.string()),
        }),
      ),
      reservedDates: Joi.array().items(
        Joi.string(),
      ),
      gallery: Joi.array().items(
        Joi.string()
          .regex((/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i))
          .messages({
            'string.pattern.base': 'gallery should contain valid mongo ids',
          })
          .allow(''),
      ),
      beginDate: Joi.date()
        .raw(),
      endDate: Joi.date()
        .raw(),
      isActive: Joi.boolean(),
      status: Joi.string()
        .valid('INACTIVE', 'ACTIVE', 'PAUSED', 'DELETED', 'ARCHIVED'),
      reservationType: Joi.string()
        .valid('AUTO', 'MANUAL'),
    }),
  },
};
