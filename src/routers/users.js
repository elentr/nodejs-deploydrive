import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { updateMeSchema } from '../validation/users.js';
import { upload } from '../middlewares/upload.js';
import { getUserByIdStory } from '../controllers/users.js';

import {
  listUsersController,
  getUserByIdController,
  meController,
  updateMeController,
  updateAvatarController,
  addSavedController,
  removeSavedController,
} from '../controllers/users.js';

export const usersRouter = Router();

usersRouter.get('/', listUsersController);

usersRouter.get('/me', authenticate, meController);
usersRouter.get('/me/profile', authenticate, meController); // залишив для сумісності
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
usersRouter.post('/me/saved/:storyId', authenticate, addSavedController);
usersRouter.delete('/me/saved/:storyId', authenticate, removeSavedController);

usersRouter.get('/:userId', getUserByIdController);

usersRouter.get('/:userId/stories', getUserByIdStory);

export default usersRouter;
