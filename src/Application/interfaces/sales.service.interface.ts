import { SalesDto } from "../dtos/sales.dto";
import Sales from "../../Domain/entities/sales";

export interface ISalesService {
    findAll(page: number, pageSize: number): Promise<Sales[]>;
    findById(id: string): Promise<Sales | null>;
    findPendingCredits(): Promise<Sales[]>;
    findOverdueCredits(): Promise<Sales[]>;
    create(data: SalesDto): Promise<Sales>;
    registerPayment(id: string): Promise<Sales | null>;
    delete(id: string): Promise<void>;
}