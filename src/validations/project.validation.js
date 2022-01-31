import { Joi } from 'express-validation';

module.exports = {
  create: {
    body: Joi.object({
      // id: Joi.string()
      //   .pattern(/^[a-zàâçéèêëîïôûùüÿñæœ .-]*$/i)
      //   .message('id must be in lowercase')
      //   .required(),
      name: Joi.string()
        .required(),
      description: Joi.string()
        .allow(''),
    }),
  },
  get: {
    query: Joi.object({
      createdAt: Joi.date()
        .raw(),
      name: Joi.string(),
      id: Joi.string()
        .lowercase(),
      isDeleted: Joi.boolean(),
      sort: Joi.string(),
    }),
  },
  update: {
    body: Joi.object({
      // id: Joi.string()
      //   .pattern(/^[a-zàâçéèêëîïôûùüÿñæœ .-]*$/i)
      //   .message('id must be in lowercase'),
      name: Joi.string(),
      description: Joi.string()
        .allow(''),
    }),
  },
};
