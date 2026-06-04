import { Router } from 'express';
import { adminRoutes } from './admin.routes';
import { authRoutes } from './auth.routes';
import { categoryRoutes } from './category.routes';
import { dashboardRoutes } from './dashboard.routes';
import { transactionRoutes } from './transaction.routes';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/categories', categoryRoutes);
routes.use('/transactions', transactionRoutes);
routes.use('/dashboard', dashboardRoutes);
routes.use('/admin', adminRoutes);

export { routes };
