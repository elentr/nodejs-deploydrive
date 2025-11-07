import createHttpError from 'http-errors';

export function validateBody(schema) {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      next();
    } catch (err) {
      const details = err.details?.map(d => d.message) ?? ['Validation error'];
      next(createHttpError(400, details.join(', ')));
    }
  };
}
