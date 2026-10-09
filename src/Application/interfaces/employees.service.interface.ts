import { EmployeesDto } from "../dtos/employees.dto";
import Employees from "../../Domain/entities/employees";

export interface IEmployeesService {
    findAll(page: number, pageSize: number): Promise<Employees[]>;
    findById(id: string): Promise<Employees | null>;
    create(data: EmployeesDto): Promise<Employees>;
    update(id: string, data: EmployeesDto): Promise<Employees | null>;
    delete(id: string): Promise<void>;
}