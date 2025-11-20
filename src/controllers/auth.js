import {
  registerUser,
  loginUser,
  generateTokens,
  verifyRefreshToken,
} from '../services/auth.js';

const isProd = process.env.NODE_ENV === 'production';

const REFRESH_MAX_AGE = 24 * 60 * 60 * 1000;

const setRefreshCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    path: '/',
    maxAge: REFRESH_MAX_AGE,
  });
};

export const registerController = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);

    const { accessToken, refreshToken } = generateTokens(user._id);

    setRefreshCookie(res, refreshToken);

    return res.status(201).json({
      status: 201,
      message: 'User registered',
      data: {
        user,
        accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await loginUser(
      email,
      password
    );

    setRefreshCookie(res, refreshToken);

    return res.status(200).json({
      status: 200,
      message: 'Login successful',
      data: {
        user,
        accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const refreshController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies || {};

    if (!refreshToken) {
      return res.status(401).json({
        status: 401,
        message: 'No refresh token provided',
      });
    }

    const payload = verifyRefreshToken(refreshToken);

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      payload.userId
    );

    setRefreshCookie(res, newRefreshToken);

    return res.status(200).json({
      status: 200,
      message: 'Token refreshed',
      data: { accessToken },
    });
  } catch (err) {
    next(err);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
      path: '/',
    });

    return res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export async function sendEmailChangeVerification(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 400,
        message: 'Email is required',
      });
    }

    await sendVerificationEmail(email);

    res.json({
      status: 200,
      message: 'Verification email sent',
      data: { email },
    });
  } catch (err) {
    next(err);
  }
}
