// 📁 backend/src/Application/interfaces/predictive.service.interface.ts

import { 
    DemandPredictionDto, 
    StockAlertDto, 
    DashboardMetricsDto 
} from '../dtos/predictive.dto';

export interface IPredictiveService {
    getDashboardMetrics(): Promise<DashboardMetricsDto>;
    predictDemand(productId: string): Promise<DemandPredictionDto>;
    getCriticalAlerts(): Promise<StockAlertDto[]>;
    calculateReorderPoint(productId: string): Promise<number>;
}