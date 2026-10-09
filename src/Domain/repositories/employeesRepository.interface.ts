import Employees from "../entities/employees";

export interface IEmployeesRepository {
    findAll(page: number, pageSize: number): Promise<Employees[]>;
    findById(id: string): Promise<Employees | null>;
    create(data: Employees): Promise<Employees>;
    update(data: Employees): Promise<Employees>;
    delete(id: string): Promise<void>;
}