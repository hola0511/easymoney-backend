import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const controller = new DashboardController();

router.get('/summary', authMiddleware, (req, res, next) => controller.summary(req, res).catch(next));

export { router as dashboardRoutes };
