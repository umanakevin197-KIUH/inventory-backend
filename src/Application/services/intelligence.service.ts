import { injectable } from "tsyringe";
import { IIntelligenceService } from "../interfaces/intelligence.service.interface";
import { ABCAnalysisDto, EOQAnalysisDto, ProfitabilityDto } from "../dtos/intelligence.dto";
import { executeWithRetry } from "../../shared/utils/dbHelper";

@injectable()
export class IntelligenceService implements IIntelligenceService {

    // ============ ANÁLISIS ABC ============
    async getABCAnalysis(): Promise<ABCAnalysisDto[]> {
        try {
            const productsResult = await executeWithRetry("SELECT * FROM PRODUCTS");
            const products = productsResult.rows as any[];

            const salesResult = await executeWithRetry(`
                SELECT product_id, SUM(quantity) as total_sold
                FROM sale_items
                GROUP BY product_id
            `);
            
            const salesMap = new Map();
            salesResult.rows.forEach((row: any) => {
                salesMap.set(row.product_id, Number(row.total_sold) || 0);
            });

            const productsWithValue = products.map((p) => {
                const price = Number(p.PRICE) || Number(p.price) || 0;
                const stock = Number(p.STOCK) || Number(p.stock) || 0;
                const totalSold = salesMap.get(p.ID || p.id) || 0;
                return {
                    productId: p.ID || p.id,
                    productName: p.NAME || p.name,
                    value: price * stock,
                    stock,
                    price,
                    totalSold,
                };
            });

            productsWithValue.sort((a, b) => b.value - a.value);

            const totalValue = productsWithValue.reduce((sum, p) => sum + p.value, 0);

            let cumulative = 0;
            const analysis: ABCAnalysisDto[] = productsWithValue.map((p) => {
                const percentage = totalValue > 0 ? (p.value / totalValue) * 100 : 0;
                cumulative += percentage;

                let category: 'A' | 'B' | 'C' = 'C';
                if (cumulative <= 80) category = 'A';
                else if (cumulative <= 95) category = 'B';

                return {
                    category,
                    productId: p.productId,
                    productName: p.productName,
                    value: p.value,
                    percentage,
                    cumulativePercentage: cumulative,
                    stock: p.stock,
                    price: p.price,
                    totalSold: p.totalSold,
                };
            });

            return analysis;
        } catch (error) {
            console.error("Error en getABCAnalysis:", error);
            return [];
        }
    }

    // ============ ANÁLISIS EOQ ============
    async getEOQAnalysis(): Promise<EOQAnalysisDto[]> {
        try {
            const productsResult = await executeWithRetry("SELECT * FROM PRODUCTS");
            const products = productsResult.rows as any[];

            const salesResult = await executeWithRetry(`
                SELECT product_id, SUM(quantity) as total_sold
                FROM sale_items
                GROUP BY product_id
            `);
            
            const salesMap = new Map();
            salesResult.rows.forEach((row: any) => {
                salesMap.set(row.product_id, Number(row.total_sold) || 0);
            });

            const analysis: EOQAnalysisDto[] = products.map((p) => {
                const productId = p.ID || p.id;
                const productName = p.NAME || p.name;
                const currentStock = Number(p.STOCK) || Number(p.stock) || 0;
                const price = Number(p.PRICE) || Number(p.price) || 0;

                const totalSold90d = salesMap.get(productId) || 0;
                const annualDemand = totalSold90d * 4;

                const orderCost = 500;
                const holdingCost = price * 0.25;

                let eoq = 0;
                if (holdingCost > 0 && annualDemand > 0) {
                    eoq = Math.sqrt((2 * annualDemand * orderCost) / holdingCost);
                }

                const ordersPerYear = eoq > 0 ? annualDemand / eoq : 0;

                const dailyDemand = annualDemand / 365;
                const reorderPoint = Math.ceil(dailyDemand * 7);

                let status: 'CRITICAL' | 'LOW' | 'NORMAL' = 'NORMAL';
                if (currentStock <= 0) status = 'CRITICAL';
                else if (currentStock <= reorderPoint) status = 'LOW';

                return {
                    productId,
                    productName,
                    annualDemand,
                    orderCost,
                    holdingCost,
                    eoq: Math.ceil(eoq),
                    ordersPerYear: Math.round(ordersPerYear * 10) / 10,
                    reorderPoint,
                    currentStock,
                    status,
                };
            });

            return analysis
                .filter((a) => a.annualDemand > 0)
                .sort((a, b) => b.annualDemand - a.annualDemand);
        } catch (error) {
            console.error("Error en getEOQAnalysis:", error);
            return [];
        }
    }

    // ============ ANÁLISIS DE RENTABILIDAD ============
    async getProfitability(): Promise<ProfitabilityDto[]> {
        try {
            const productsResult = await executeWithRetry("SELECT * FROM PRODUCTS");
            const products = productsResult.rows as any[];

            const categoriesResult = await executeWithRetry("SELECT * FROM CATEGORIES");
            const categoriesMap = new Map();
            categoriesResult.rows.forEach((c: any) => {
                categoriesMap.set(c.ID || c.id, c.NAME || c.name);
            });

            const salesResult = await executeWithRetry(`
                SELECT product_id, SUM(quantity) as total_sold, SUM(total) as total_revenue
                FROM sale_items
                GROUP BY product_id
            `);
            const salesMap = new Map();
            salesResult.rows.forEach((row: any) => {
                salesMap.set(row.product_id, {
                    totalSold: Number(row.total_sold) || 0,
                    totalRevenue: Number(row.total_revenue) || 0,
                });
            });

            const purchaseMap = new Map();
            try {
                const purchaseResult = await executeWithRetry(`
                    SELECT product_id, unit_price
                    FROM purchase_order_items
                    WHERE id IN (
                        SELECT MAX(id) FROM purchase_order_items GROUP BY product_id
                    )
                `);
                purchaseResult.rows.forEach((row: any) => {
                    purchaseMap.set(row.product_id, Number(row.unit_price) || 0);
                });
            } catch (err) {
                console.warn("No se pudieron obtener precios de compra");
            }

            const analysis: ProfitabilityDto[] = products.map((p) => {
                const productId = p.ID || p.id;
                const productName = p.NAME || p.name;
                const categoryId = p.CATEGORY_ID || p.category_id;
                const category = categoriesMap.get(categoryId) || "Sin categoría";
                const price = Number(p.PRICE) || Number(p.price) || 0;

                const lastPurchase = purchaseMap.get(productId);
                const estimatedCost = lastPurchase && lastPurchase > 0
                    ? lastPurchase
                    : price * 0.6;

                const margin = price - estimatedCost;
                const marginPercentage = price > 0 ? (margin / price) * 100 : 0;

                const sales = salesMap.get(productId) || { totalSold: 0, totalRevenue: 0 };
                const totalProfit = sales.totalSold * margin;

                return {
                    productId,
                    productName,
                    category,
                    price,
                    estimatedCost,
                    margin,
                    marginPercentage,
                    totalSold: sales.totalSold,
                    totalRevenue: sales.totalRevenue,
                    totalProfit,
                };
            });

            return analysis.sort((a, b) => b.totalProfit - a.totalProfit);
        } catch (error) {
            console.error("Error en getProfitability:", error);
            return [];
        }
    }
}