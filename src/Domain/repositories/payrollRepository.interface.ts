import Payroll from "../entities/payroll";

export interface IPayrollRepository {
    findAll(page: number, pageSize: number): Promise<Payroll[]>;
    findById(id: string): Promise<Payroll | null>;
    findByEmployeeId(employeeId: string): Promise<Payroll[]>;
    create(data: Payroll): Promise<Payroll>;
    delete(id: string): Promise<void>;
}