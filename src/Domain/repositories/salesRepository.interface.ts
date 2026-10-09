import Sales, { SaleItem } from "../entities/sales";

export interface ISalesRepository {
    findAll(page: number, pageSize: number): Promise<Sales[]>;
    findById(id: string): Promise<Sales | null>;
    findItemsBySaleId(saleId: string): Promise<SaleItem[]>;
    findPendingCredits(): Promise<Sales[]>;
    findOverdueCredits(): Promise<Sales[]>;
    create(data: Sales, items: SaleItem[]): Promise<Sales>;
    registerPayment(id: string): Promise<void>;
    delete(id: string): Promise<void>;
}
