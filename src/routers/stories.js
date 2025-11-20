import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import { upload } from '../middlewares/upload.js';
import { createStorySchema, updateStorySchema } from '../validation/stories.js';
import { getStoryByIdController } from '../controllers/stories.js';

import {
  listStoriesController,
  createStoryController,
  updateStoryController,
  getPopularStoriesController,
} from '../controllers/stories.js';

export const storiesRouter = Router();

storiesRouter.get('/', listStoriesController);

storiesRouter.get('/popular', getPopularStoriesController);

storiesRouter.post(
  '/',
  authenticate,
  upload.single('img'),
  validateBody(createStorySchema),
  createStoryController
);

storiesRouter.patch(
  '/:storyId',
  authenticate,
  upload.single('img'),
  validateBody(updateStorySchema),
  updateStoryController
);

storiesRouter.get(
  '/:storyId',
  getStoryByIdController);
