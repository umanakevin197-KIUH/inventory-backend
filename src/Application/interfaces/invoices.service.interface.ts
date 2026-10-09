import { InvoicesDto } from "../dtos/invoices.dto";
import Invoices from "../../Domain/entities/invoices";

export interface IInvoicesService {
    findAll(page: number, pageSize: number): Promise<Invoices[]>;
    findById(id: string): Promise<Invoices | null>;
    create(data: InvoicesDto): Promise<Invoices>;
    cancel(id: string, reason: string): Promise<Invoices | null>;
    delete(id: string): Promise<void>;
}