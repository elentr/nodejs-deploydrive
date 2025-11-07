import Joi from 'joi';
import mongoose from 'mongoose';

const objectId = () =>
  Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'ObjectId validation');

export const createStorySchema = Joi.object({
  title: Joi.string().max(80).required(),
  article: Joi.string().max(2500).required(),
  category: objectId().required(),
});

export const updateStorySchema = Joi.object({
  title: Joi.string().max(80),
  article: Joi.string().max(2500),
  category: objectId(),
}).min(1);
