import Suppliers from "../entities/suppliers";

export interface ISuppliersRepository {
    findAll(page: number, pageSize: number): Promise<Suppliers[]>;
    findById(id: string): Promise<Suppliers | null>;
    create(data: Suppliers): Promise<Suppliers>;
    update(data: Suppliers): Promise<Suppliers>;
    delete(id: string): Promise<void>;
}