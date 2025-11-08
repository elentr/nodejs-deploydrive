import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { User } from '../models/user.js';
import { Session } from '../models/session.js';

const ACCESS_TTL_MS = 15 * 60 * 1000;
const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export async function registerUser(payload) {
  const exists = await User.findOne({ email: payload.email.toLowerCase() });
  if (exists) throw createHttpError(409, 'Email in use');

  const hash = await bcrypt.hash(payload.password, 10);

  const user = await User.create({
    name: payload.name,
    email: payload.email.toLowerCase(),
    password: hash,
  });

  const { password, ...safe } = user.toObject();
  return safe;
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user)
    throw new createHttpError.Unauthorized('Email or password is incorrect');

  const ok = await bcrypt.compare(password, user.password);
  if (!ok)
    throw new createHttpError.Unauthorized('Email or password is incorrect');

  await Session.deleteOne({ userId: user._id });

  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TTL_MS),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TTL_MS),
  });

  return { accessToken, refreshToken, session };
}

export async function refreshSession(refreshToken) {
  const session = await Session.findOne({ refreshToken });
  if (!session) throw new createHttpError.Unauthorized('Session not found');

  if (session.refreshTokenValidUntil < new Date()) {
    await Session.deleteOne({ _id: session._id });
    throw new createHttpError.Unauthorized('Refresh token is expired');
  }

  await Session.deleteOne({ _id: session._id });

  const accessToken = crypto.randomBytes(30).toString('base64');
  const newRefreshToken = crypto.randomBytes(30).toString('base64');

  const newSession = await Session.create({
    userId: session.userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TTL_MS),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TTL_MS),
  });

  return { accessToken, refreshToken: newRefreshToken, session: newSession };
}

export async function logoutUser(sessionId) {
  await Session.deleteOne({ _id: sessionId });
}
