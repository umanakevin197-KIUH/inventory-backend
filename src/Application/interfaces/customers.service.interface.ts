import { CustomersDto } from "../dtos/customers.dto";
import Customers from "../../Domain/entities/customers";

export interface ICustomersService {
    findAll(page: number, pageSize: number): Promise<Customers[]>;
    findById(id: string): Promise<Customers | null>;
    create(data: CustomersDto): Promise<Customers>;
    update(id: string, data: CustomersDto): Promise<Customers | null>;
    delete(id: string): Promise<void>;
}