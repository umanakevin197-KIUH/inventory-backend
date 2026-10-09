// 📁 backend/src/Application/services/predictive.service.ts

import { inject, injectable } from 'tsyringe';
import { IPredictiveService } from '../interfaces/predictive.service.interface';
import { 
    DemandPredictionDto, 
    StockAlertDto, 
    DashboardMetricsDto 
} from '../dtos/predictive.dto';

// ✅ IMPORTAR SERVICIOS, NO REPOSITORIOS
import { IProductsService } from '../interfaces/products.service.interface';
import { Iinventory_movementsService } from '../interfaces/inventory_movements.service.interface';

@injectable()
export class PredictiveService implements IPredictiveService {
    constructor(
        // ✅ INYECTAR SERVICIOS
        @inject('IProductsService') private productService: IProductsService,
        @inject('Iinventory_movementsService') private movementService: Iinventory_movementsService
    ) {}

    async getDashboardMetrics(): Promise<DashboardMetricsDto> {
        try {
            // ✅ USAR SERVICIOS
            const products = await this.productService.findAll(1, 1000);
            
            const totalProducts = products.length;
            const lowStockProducts = products.filter((p: any) => Number(p.stock) <= 5).length;
            const outOfStockProducts = products.filter((p: any) => Number(p.stock) === 0).length;
            
            const totalInventoryValue = products.reduce(
                (sum: number, p: any) => sum + (Number(p.price) * Number(p.stock)), 
                0
            );

            const alerts = await this.getCriticalAlerts();
            const criticalAlerts = alerts.filter(a => a.urgency === 'CRITICAL');

            let predictedSalesNextMonth = 0;
            const topProducts = products.slice(0, 3);
            
            for (const product of topProducts) {
                try {
                    const prediction = await this.predictDemand(product.id);
                    predictedSalesNextMonth += prediction.predictedDemand.nextMonth * Number(product.price);
                } catch (error) {
                    console.error(`Error al predecir demanda para ${product.id}:`, error);
                }
            }

            return {
                totalProducts,
                lowStockProducts,
                outOfStockProducts,
                totalInventoryValue,
                criticalAlerts,
                predictedSalesNextMonth
            };
        } catch (error) {
            console.error('Error en getDashboardMetrics:', error);
            return {
                totalProducts: 0,
                lowStockProducts: 0,
                outOfStockProducts: 0,
                totalInventoryValue: 0,
                criticalAlerts: [],
                predictedSalesNextMonth: 0
            };
        }
    }

    async predictDemand(productId: string): Promise<DemandPredictionDto> {
        try {
            // ✅ USAR SERVICIOS
            const product = await this.productService.findById(productId);
            if (!product) {
                throw new Error('Producto no encontrado');
            }

            // Obtener movimientos del producto usando el servicio
            let movements = [];
            try {
                // ✅ USAR SERVICIO DE MOVIMIENTOS
                movements = await this.movementService.findByProductId(productId);
            } catch (error) {
                console.warn(`No se pudieron obtener movimientos para ${productId}:`, error);
                movements = [];
            }
            
            // Filtrar solo salidas (ventas)
            const sales = movements.filter((m: any) => {
                const type = m.type || m.movement_type || '';
                return type.toLowerCase() === 'salida';
            });
            
            let avgDailySales = 0;
            if (sales.length > 0) {
                const totalSales = sales.reduce((sum: number, m: any) => sum + Number(m.quantity), 0);
                const days = this.calculateDaysRange(sales);
                avgDailySales = totalSales / Math.max(days, 1);
            }

            if (avgDailySales === 0) {
                const allProducts = await this.productService.findAll(1, 1000);
                const totalStock = allProducts.reduce((sum: number, p: any) => sum + Number(p.stock), 0);
                avgDailySales = (totalStock / Math.max(allProducts.length, 1)) / 30;
                if (avgDailySales === 0) avgDailySales = 1;
            }

            const seasonalFactor = sales.length > 30 ? 1.2 : 1.0;
            
            const predictedDemand = {
                nextWeek: Math.round(avgDailySales * 7 * seasonalFactor),
                nextMonth: Math.round(avgDailySales * 30 * seasonalFactor),
                nextQuarter: Math.round(avgDailySales * 90 * seasonalFactor)
            };

            const confidence = Math.min(Math.round((sales.length / 50) * 100), 95);

            let recommendation: 'COMPRAR' | 'MANTENER' | 'REDUCIR' = 'MANTENER';
            const stockRatio = Number(product.stock) / Math.max(predictedDemand.nextMonth, 1);
            if (stockRatio < 1.5) recommendation = 'COMPRAR';
            if (stockRatio > 3) recommendation = 'REDUCIR';

            return {
                productId,
                productName: product.name,
                currentStock: Number(product.stock),
                predictedDemand,
                confidence,
                recommendation
            };
        } catch (error) {
            console.error(`Error en predictDemand para ${productId}:`, error);
            throw error;
        }
    }

    async getCriticalAlerts(): Promise<StockAlertDto[]> {
        try {
            // ✅ USAR SERVICIOS
            const products = await this.productService.findAll(1, 1000);
            const alerts: StockAlertDto[] = [];

            for (const product of products) {
                const reorderPoint = await this.calculateReorderPoint(product.id);
                const stock = Number(product.stock);
                
                if (stock <= 0) {
                    alerts.push({
                        productId: product.id,
                        productName: product.name,
                        currentStock: stock,
                        reorderPoint,
                        urgency: 'CRITICAL',
                        message: `¡AGOTADO! ${product.name} necesita reposición inmediata.`
                    });
                } else if (stock <= reorderPoint) {
                    alerts.push({
                        productId: product.id,
                        productName: product.name,
                        currentStock: stock,
                        reorderPoint,
                        urgency: 'WARNING',
                        message: `Stock crítico: ${product.name}. Quedan ${stock} unidades.`
                    });
                }
            }

            return alerts.sort((a, b) => {
                const order = { CRITICAL: 0, WARNING: 1, INFO: 2 };
                return order[a.urgency] - order[b.urgency];
            });
        } catch (error) {
            console.error('Error en getCriticalAlerts:', error);
            return [];
        }
    }

    async calculateReorderPoint(productId: string): Promise<number> {
        try {
            // ✅ USAR SERVICIOS
            let movements = [];
            try {
                movements = await this.movementService.findByProductId(productId);
            } catch (error) {
                console.warn(`No se pudieron obtener movimientos para ${productId}:`, error);
                return 5;
            }
            
            const sales = movements.filter((m: any) => {
                const type = m.type || m.movement_type || '';
                return type.toLowerCase() === 'salida';
            });
            
            if (sales.length === 0) return 5;
            
            const totalSales = sales.reduce((sum: number, m: any) => sum + Number(m.quantity), 0);
            const days = this.calculateDaysRange(sales);
            const avgDailySales = totalSales / Math.max(days, 1);
            
            const leadTime = 7;
            const safetyStock = avgDailySales * 3;
            
            return Math.ceil((avgDailySales * leadTime) + safetyStock);
        } catch (error) {
            console.error(`Error en calculateReorderPoint para ${productId}:`, error);
            return 5;
        }
    }

    private calculateDaysRange(movements: any[]): number {
        if (movements.length === 0) return 1;
        try {
            const firstDate = new Date(movements[0].created_at);
            const lastDate = new Date(movements[movements.length - 1].created_at);
            const diff = lastDate.getTime() - firstDate.getTime();
            return Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
        } catch (error) {
            return 1;
        }
    }
}