// 📁 backend/src/WebApi/routes/predictive.routes.ts

import { Router } from 'express';
import { container } from '../container/dependencyContainer';
import { PredictiveController } from '../controllers/predictive.controller';

const router = Router();
const controller = container.resolve(PredictiveController);

// Rutas para métricas y predicciones
router.get('/dashboard/metrics', controller.getDashboardMetrics);
router.get('/predictions/:productId', controller.getPredictions);
router.get('/alerts', controller.getAlerts);
router.get('/reorder-point/:productId', controller.getReorderPoint);

export default router;