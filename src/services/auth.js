import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env;

if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT secrets are not set in .env');
}

const ACCESS_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = '1d';

export function generateTokens(userId) {
  const accessToken = jwt.sign({ userId }, JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  });

  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
}

export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (err) {
    throw createHttpError(401, 'Invalid refresh token');
  }
}

export async function registerUser(payload) {
  const exists = await User.findOne({ email: payload.email.toLowerCase() });
  if (exists) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  const user = await User.create({
    name: payload.name,
    email: payload.email.toLowerCase(),
    password: encryptedPassword,
    avatarUrl: null,
    description: '',
    articlesAmount: 0,
  });

  const { password, ...safeUser } = user.toObject();
  return safeUser;
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw createHttpError(401, 'Email or password incorrect');

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw createHttpError(401, 'Email or password incorrect');

  const { password: _, ...safeUser } = user.toObject();

  const { accessToken, refreshToken } = generateTokens(user._id);

  return { user: safeUser, accessToken, refreshToken };
}
