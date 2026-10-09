import { SuppliersDto } from "../dtos/suppliers.dto";
import Suppliers from "../../Domain/entities/suppliers";

export interface ISuppliersService {
    findAll(page: number, pageSize: number): Promise<Suppliers[]>;
    findById(id: string): Promise<Suppliers | null>;
    create(data: SuppliersDto): Promise<Suppliers>;
    update(id: string, data: SuppliersDto): Promise<Suppliers | null>;
    delete(id: string): Promise<void>;
}