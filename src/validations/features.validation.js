import DateExtension from '@hapi/joi-date';
import JoiImport from 'joi';

const Joi = JoiImport.extend(DateExtension);

module.exports = {

  // CREATE
  create: {
    body: Joi.object({
      key: Joi.string().required(),
      description: Joi.string(),
      isBoolean: Joi.boolean(),
      hasOptions: Joi.boolean(),
      count: Joi.number(),
      value: Joi.number(),
      options: Joi.array().items(
        Joi.object({
          index: Joi.number().required(),
          key: Joi.string().required(),
        }),
      ).required(),

      category: Joi.string()
        .regex((/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i))
        .required()
        .messages({
          'string.pattern.base': 'category should be a valid mongo id',
        }),
      isActive: { type: Boolean, default: true },
    }),
  },
  // PATCH
  update: {
    body: Joi.object({
      key: Joi.string(),
      description: Joi.string(),
      isBoolean: Joi.boolean(),
      hasOptions: Joi.boolean(),
      count: Joi.number(),
      value: Joi.number(),
      options: Joi.array().items(
        Joi.object({
          index: Joi.number().required(),
          key: Joi.string().required(),
        }),
      ),

      category: Joi.string()
        .regex((/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i))
        .messages({
          'string.pattern.base': 'category should be a valid mongo id',
        }),
      isActive: { type: Boolean, default: true },
    }),
  },
};
