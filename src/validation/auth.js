import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().max(32).required(),
  email: Joi.string().email().max(64).required(),
  password: Joi.string().min(8).max(128).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().max(64).required(),
  password: Joi.string().min(8).max(128).required(),
});
