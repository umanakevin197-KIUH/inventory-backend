import { PayrollDto } from "../dtos/payroll.dto";
import Payroll from "../../Domain/entities/payroll";

export interface IPayrollService {
    findAll(page: number, pageSize: number): Promise<Payroll[]>;
    findById(id: string): Promise<Payroll | null>;
    findByEmployeeId(employeeId: string): Promise<Payroll[]>;
    create(data: PayrollDto): Promise<Payroll>;
    delete(id: string): Promise<void>;
}