import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { loginSchema, registerSchema } from '../validators/authValidators';

const router = Router();
const controller = new AuthController();

router.post('/register', validateRequest(registerSchema), (req, res, next) => controller.register(req, res).catch(next));
router.post('/login', validateRequest(loginSchema), (req, res, next) => controller.login(req, res).catch(next));
router.get('/me', authMiddleware, (req, res, next) => controller.me(req, res).catch(next));

export { router as authRoutes };
