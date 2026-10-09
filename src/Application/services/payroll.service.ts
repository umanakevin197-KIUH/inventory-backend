import { inject, injectable } from "tsyringe";
import { IPayrollService } from "../interfaces/payroll.service.interface";
import { IPayrollRepository } from "../../Domain/repositories/payrollRepository.interface";
import { PayrollDto } from "../dtos/payroll.dto";
import Payroll from "../../Domain/entities/payroll";
import { generateId } from "../../shared/utils/generateId";

@injectable()
export class PayrollService implements IPayrollService {
    private readonly _payrollRepository: IPayrollRepository;

    constructor(@inject("IPayrollRepository") repository: IPayrollRepository) {
        this._payrollRepository = repository;
    }

    async findAll(page: number = 1, pageSize: number = 100): Promise<Payroll[]> {
        return await this._payrollRepository.findAll(page, pageSize);
    }

    async findById(id: string): Promise<Payroll | null> {
        return await this._payrollRepository.findById(id);
    }

    async findByEmployeeId(employeeId: string): Promise<Payroll[]> {
        return await this._payrollRepository.findByEmployeeId(employeeId);
    }

    async create(data: PayrollDto): Promise<Payroll> {
        const baseSalary = Number(data.base_salary) || 0;
        const bonuses = Number(data.bonuses) || 0;
        const deductions = Number(data.deductions) || 0;
        const netSalary = baseSalary + bonuses - deductions;

        const newData: Payroll = {
            id: generateId(),
            employee_id: data.employee_id,
            period: data.period,
            base_salary: baseSalary,
            bonuses: bonuses,
            bonus_description: data.bonus_description,
            deductions: deductions,
            deduction_description: data.deduction_description,
            net_salary: netSalary,
            payment_method: data.payment_method || "EFECTIVO",
            status: data.status || "PAGADA",
            paid_at: data.status === "PAGADA" ? new Date().toISOString() : undefined,
            created_by: data.created_by,
            created_at: new Date().toISOString(),
        };

        await this._payrollRepository.create(newData);
        return newData;
    }

    async delete(id: string): Promise<void> {
        const existing = await this._payrollRepository.findById(id);
        if (!existing) return;
        return await this._payrollRepository.delete(id);
    }
}