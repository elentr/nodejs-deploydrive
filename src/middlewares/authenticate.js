import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      throw createHttpError.Unauthorized('Authorization header missing');
    }

    const [type, token] = header.split(' ');

    if (type !== 'Bearer' || !token) {
      throw createHttpError.Unauthorized('Invalid Authorization format');
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        const e = createHttpError(498, 'Access token expired');
        throw e;
      }
      throw createHttpError.Unauthorized('Invalid access token');
    }

    const user = await User.findById(payload.userId).lean();
    if (!user) {
      throw createHttpError.Unauthorized('User not found');
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
