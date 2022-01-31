import DateExtension from '@hapi/joi-date';
import JoiImport from 'joi';

const Joi = JoiImport.extend(DateExtension);

module.exports = {

  // CREATE
  create: {
    body: Joi.object({
      name: Joi.string(),
      description: Joi.string().allow(''),
      index: Joi.number(),
      parentCategory: Joi.string()
        .regex((/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i))
        .messages({
          'string.pattern.base': 'category should be a valid mongo id',
        }),
    }),
  },
  // PATCH
  update: {
    body: Joi.object({
      name: Joi.string(),
      description: Joi.string().allow(''),
      index: Joi.number(),
      parentCategory: Joi.string()
        .regex((/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i))
        .messages({
          'string.pattern.base': 'category should be a valid mongo id',
        }),
      isActive: Joi.boolean(),
      subCategories: Joi.array(),
    }),
  },
};
