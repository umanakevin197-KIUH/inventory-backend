import Invoices from "../entities/invoices";

export interface IInvoicesRepository {
    findAll(page: number, pageSize: number): Promise<Invoices[]>;
    findById(id: string): Promise<Invoices | null>;
    findBySaleId(saleId: string): Promise<Invoices | null>;
    create(data: Invoices): Promise<Invoices>;
    updateStatus(id: string, status: string): Promise<void>;
    delete(id: string): Promise<void>;
}