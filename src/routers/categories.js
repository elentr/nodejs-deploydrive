import { Router } from 'express';
import { listStoryCategoriesController } from '../controllers/categories.js';

export const categoriesRouter = Router();

categoriesRouter.get('/', listStoryCategoriesController);

export default categoriesRouter;