import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
} from '../services/auth.js';

const isProd = process.env.NODE_ENV === 'production';

const cookieOptions = {
  httpOnly: true,
  secure: true,       
  sameSite: 'none',   
  path: '/',           
};

export async function registerController(req, res) {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
}

export async function loginController(req, res) {
  const { email, password } = req.body;
  const { accessToken, refreshToken, session } = await loginUser(
    email,
    password
  );

  res.cookie(
    'refreshToken',
    refreshToken,
    {
      ...cookieOptions,
      expires: session.refreshTokenValidUntil,
    }
  );

  res.cookie(
    'sessionId',
    session._id.toString(),
    {
      ...cookieOptions,
      expires: session.refreshTokenValidUntil,
    }
  );

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: { accessToken },
  });
}

export async function refreshController(req, res) {
  const { refreshToken } = req.cookies || {};

  if (!refreshToken) {
    return res.status(401).json({
      status: 401,
      message: 'No refresh token provided',
      data: {},
    });
  }

  const {
    accessToken,
    refreshToken: newRefresh,
    session,
  } = await refreshSession(refreshToken);

  // update cookies
  res.cookie(
    'refreshToken',
    newRefresh,
    {
      ...cookieOptions,
      expires: session.refreshTokenValidUntil,
    }
  );

  res.cookie(
    'sessionId',
    session._id.toString(),
    {
      ...cookieOptions,
      expires: session.refreshTokenValidUntil,
    }
  );

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken },
  });
}

export async function logoutController(req, res) {
  const { sessionId } = req.cookies || {};

  if (typeof sessionId === 'string') {
    await logoutUser(sessionId);
  }

  res.clearCookie('refreshToken', {
    ...cookieOptions,
  });

  res.clearCookie('sessionId', {
    ...cookieOptions,
  });

  res.status(204).end();
}
