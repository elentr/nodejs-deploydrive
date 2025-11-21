import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../validation/auth.js';
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
} from '../controllers/auth.js';

export const authRouter = Router();

authRouter.post('/register', validateBody(registerSchema), registerController);
authRouter.post('/login', validateBody(loginSchema), loginController);
authRouter.post('/refresh', refreshController);
authRouter.post('/logout', logoutController);
