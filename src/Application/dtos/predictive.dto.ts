// 📁 backend/src/Application/dtos/predictive.dto.ts

export interface DemandPredictionDto {
    productId: string;
    productName: string;
    currentStock: number;
    predictedDemand: {
        nextWeek: number;
        nextMonth: number;
        nextQuarter: number;
    };
    confidence: number;
    recommendation: 'COMPRAR' | 'MANTENER' | 'REDUCIR';
}

export interface StockAlertDto {
    productId: string;
    productName: string;
    currentStock: number;
    reorderPoint: number;
    urgency: 'CRITICAL' | 'WARNING' | 'INFO';
    message: string;
}

export interface DashboardMetricsDto {
    totalProducts: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    totalInventoryValue: number;
    criticalAlerts: StockAlertDto[];
    predictedSalesNextMonth: number;
}