export interface ABCAnalysisDto {
    category: 'A' | 'B' | 'C';
    productId: string;
    productName: string;
    value: number;
    percentage: number;
    cumulativePercentage: number;
    stock: number;
    price: number;
    totalSold: number;
}

export interface EOQAnalysisDto {
    productId: string;
    productName: string;
    annualDemand: number;
    orderCost: number;
    holdingCost: number;
    eoq: number;
    ordersPerYear: number;
    reorderPoint: number;
    currentStock: number;
    status: 'CRITICAL' | 'LOW' | 'NORMAL';
}

export interface ProfitabilityDto {
    productId: string;
    productName: string;
    category: string;
    price: number;
    estimatedCost: number;
    margin: number;
    marginPercentage: number;
    totalSold: number;
    totalRevenue: number;
    totalProfit: number;
}