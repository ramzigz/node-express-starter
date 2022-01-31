import Joi from 'joi';

module.exports = {
  create: {
    body: Joi.object({
      description: Joi.string().allow(''),
      amount: Joi.number().required(),
      transactions: Joi.array(),
    }),
  },
  updateTransaction: {
    body: Joi.object({
      status: Joi.string().valid('PENDING', 'SUCCESS', 'FAILED'),
      description: Joi.string().allow(''),
    }),
  },
};
