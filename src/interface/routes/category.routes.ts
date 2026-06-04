import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { createCategorySchema, idParamSchema, updateCategorySchema } from '../validators/categoryValidators';

const router = Router();
const controller = new CategoryController();

router.use(authMiddleware);
router.get('/', (req, res, next) => controller.index(req, res).catch(next));
router.get('/:id', validateRequest(idParamSchema), (req, res, next) => controller.show(req, res).catch(next));
router.post('/', validateRequest(createCategorySchema), (req, res, next) => controller.create(req, res).catch(next));
router.put('/:id', validateRequest(updateCategorySchema), (req, res, next) => controller.update(req, res).catch(next));
router.delete('/:id', validateRequest(idParamSchema), (req, res, next) => controller.delete(req, res).catch(next));

export { router as categoryRoutes };
