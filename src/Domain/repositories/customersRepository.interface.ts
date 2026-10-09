import Customers from "../entities/customers";

export interface ICustomersRepository {
    findAll(page: number, pageSize: number): Promise<Customers[]>;
    findById(id: string): Promise<Customers | null>;
    create(data: Customers): Promise<Customers>;
    update(data: Customers): Promise<Customers>;
    delete(id: string): Promise<void>;
}