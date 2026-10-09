import Purchases, { PurchaseOrderItem } from "../entities/purchases";

export interface IPurchasesRepository {
    findAll(page: number, pageSize: number): Promise<Purchases[]>;
    findById(id: string): Promise<Purchases | null>;
    findItemsByPurchaseId(purchaseId: string): Promise<PurchaseOrderItem[]>;
    create(data: Purchases, items: PurchaseOrderItem[]): Promise<Purchases>;
    update(data: Purchases, items: PurchaseOrderItem[]): Promise<Purchases>;
    updateStatus(id: string, status: string): Promise<void>;
    delete(id: string): Promise<void>;
}