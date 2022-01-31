import Joi from 'joi';

module.exports = {
  // POST /measurements
  createActivity: {
    body: Joi.object({
      name: Joi.string()
        .required(),
      description: Joi.string()
        .allow(''),
      color: Joi.string()
        .pattern(/^#([0-9a-f]{6}|[0-9a-f]{3})$/i),
    }),
  },
  getActivity: {
    query: Joi.object({
      createdAt: Joi.date()
        .raw(),
      name: Joi.string(),
      sort: Joi.string(),
      isDeleted: Joi.boolean(),
    }),
  },
  updateActivity: {
    body: Joi.object({
      name: Joi.string(),
      description: Joi.string()
        .allow(''),
      color: Joi.string()
        .pattern(/^#([0-9a-f]{6}|[0-9a-f]{3})$/i),
    }),
  },
};
