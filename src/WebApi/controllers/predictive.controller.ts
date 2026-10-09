// 📁 backend/src/WebApi/controllers/predictive.controller.ts

import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { IPredictiveService } from '../../Application/interfaces/predictive.service.interface';


@injectable()
export class PredictiveController {
    constructor(@inject('IPredictiveService') private service: IPredictiveService) {}

    getDashboardMetrics = async (req: Request, res: Response) => {
        try {
            const metrics = await this.service.getDashboardMetrics();
            res.json(metrics);
        } catch (error) {
            console.error('Error en dashboard metrics:', error);
            res.status(500).json({ 
                error: 'Error al obtener métricas del dashboard',
                details: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }

    getPredictions = async (req: Request, res: Response) => {
        try {
            // ✅ SOLUCIÓN: Usar "as string" para asegurar el tipo
            const productId = req.params.productId as string;
            
            if (!productId) {
                return res.status(400).json({ error: 'ID de producto requerido' });
            }
            
            const prediction = await this.service.predictDemand(productId);
            res.json(prediction);
        } catch (error) {
            console.error('Error en predicción:', error);
            res.status(500).json({ 
                error: 'Error al generar predicción',
                details: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }

    getAlerts = async (req: Request, res: Response) => {
        try {
            const alerts = await this.service.getCriticalAlerts();
            res.json(alerts);
        } catch (error) {
            console.error('Error en alertas:', error);
            res.status(500).json({ 
                error: 'Error al obtener alertas',
                details: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }

     getReorderPoint = async (req: Request, res: Response) => {
        try {
            // ✅ SOLUCIÓN: Usar "as string" para asegurar el tipo
            const productId = req.params.productId as string;
            
            if (!productId) {
                return res.status(400).json({ error: 'ID de producto requerido' });
            }
            
            const reorderPoint = await this.service.calculateReorderPoint(productId);
            res.json({ productId, reorderPoint });
        } catch (error) {
            console.error('Error en punto de reorden:', error);
            res.status(500).json({ 
                error: 'Error al calcular punto de reorden',
                details: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
}