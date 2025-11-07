import Joi from 'joi';

export const updateMeSchema = Joi.object({
  name: Joi.string().max(32),
  description: Joi.string().max(150),
}).min(1);
