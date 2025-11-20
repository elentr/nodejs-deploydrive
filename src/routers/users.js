// routers/users.js

import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { updateMeSchema } from '../validation/users.js';
import { upload } from '../middlewares/upload.js';

import {
  listUsersController,
  getUserByIdController,
  meController,
  updateMeController,
  updateAvatarController,
  addSavedController,
  removeSavedController,
  getUserByIdStory,
} from '../controllers/users.js';

export const usersRouter = Router();

usersRouter.get('/', listUsersController);

usersRouter.get('/me', authenticate, meController);
usersRouter.get('/me/profile', authenticate, meController);

usersRouter.patch(
  '/me',
  authenticate,
  validateBody(updateMeSchema),
  updateMeController
);

usersRouter.patch(
  '/me/avatar',
  authenticate,
  upload.single('avatar'),
  updateAvatarController
);

// saved stories
usersRouter.post('/me/saved/:storyId', authenticate, addSavedController);
usersRouter.delete('/me/saved/:storyId', authenticate, removeSavedController);

usersRouter.get('/:userId', getUserByIdController);
usersRouter.get('/:userId/stories', getUserByIdStory);

export default usersRouter;
