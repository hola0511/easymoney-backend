import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { idParamSchema } from '../validators/categoryValidators';
import { createTransactionSchema, transactionQuerySchema, updateTransactionSchema } from '../validators/transactionValidators';

const router = Router();
const controller = new TransactionController();

router.use(authMiddleware);
router.get('/', validateRequest(transactionQuerySchema), (req, res, next) => controller.index(req, res).catch(next));
router.get('/:id', validateRequest(idParamSchema), (req, res, next) => controller.show(req, res).catch(next));
router.post('/', validateRequest(createTransactionSchema), (req, res, next) => controller.create(req, res).catch(next));
router.put('/:id', validateRequest(updateTransactionSchema), (req, res, next) => controller.update(req, res).catch(next));
router.delete('/:id', validateRequest(idParamSchema), (req, res, next) => controller.delete(req, res).catch(next));

export { router as transactionRoutes };
