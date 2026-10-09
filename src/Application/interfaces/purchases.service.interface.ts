import { PurchasesDto } from "../dtos/purchases.dto";
import Purchases, { PurchaseOrderItem } from "../../Domain/entities/purchases";

export interface IPurchasesService {
    findAll(page: number, pageSize: number): Promise<Purchases[]>;
    findById(id: string): Promise<Purchases | null>;
    create(data: PurchasesDto): Promise<Purchases>;
    update(id: string, data: PurchasesDto): Promise<Purchases | null>;
    receive(id: string): Promise<Purchases | null>;
    delete(id: string): Promise<void>;
}