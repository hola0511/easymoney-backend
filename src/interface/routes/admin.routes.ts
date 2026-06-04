import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const controller = new AdminController();

router.get('/users', authMiddleware, adminMiddleware, (req, res, next) => controller.users(req, res).catch(next));

export { router as adminRoutes };
