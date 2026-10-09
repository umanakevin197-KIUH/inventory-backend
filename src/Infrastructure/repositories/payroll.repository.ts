import { injectable } from "tsyringe";
import { IPayrollRepository } from "../../Domain/repositories/payrollRepository.interface";
import Payroll from "../../Domain/entities/payroll";
import { db } from "../database/initializeDatabase";

@injectable()
export class PayrollRepository implements IPayrollRepository {

    async findAll(page: number = 1, pageSize: number = 100): Promise<Payroll[]> {
        const offset = (page - 1) * pageSize;
        const result = await db.execute({
            sql: `SELECT p.*, e.name as employee_name, e.position as employee_position
                  FROM payroll p 
                  LEFT JOIN employees e ON p.employee_id = e.id
                  ORDER BY p.created_at DESC 
                  LIMIT ? OFFSET ?`,
            args: [pageSize, offset],
        });
        return result.rows as unknown as Payroll[];
    }

    async findById(id: string): Promise<Payroll | null> {
        const result = await db.execute({
            sql: `SELECT p.*, e.name as employee_name, e.position as employee_position
                  FROM payroll p 
                  LEFT JOIN employees e ON p.employee_id = e.id
                  WHERE p.id = ?`,
            args: [id],
        });
        if (result.rows.length === 0) return null;
        return result.rows[0] as unknown as Payroll;
    }

    async findByEmployeeId(employeeId: string): Promise<Payroll[]> {
        const result = await db.execute({
            sql: `SELECT p.*, e.name as employee_name, e.position as employee_position
                  FROM payroll p 
                  LEFT JOIN employees e ON p.employee_id = e.id
                  WHERE p.employee_id = ?
                  ORDER BY p.created_at DESC`,
            args: [employeeId],
        });
        return result.rows as unknown as Payroll[];
    }

    async create(data: Payroll): Promise<Payroll> {
        await db.execute({
            sql: `INSERT INTO payroll 
                  (id, employee_id, period, base_salary, bonuses, bonus_description, 
                   deductions, deduction_description, net_salary, payment_method, 
                   status, paid_at, created_by, created_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                data.id,
                data.employee_id,
                data.period,
                data.base_salary,
                data.bonuses,
                data.bonus_description || null,
                data.deductions,
                data.deduction_description || null,
                data.net_salary,
                data.payment_method,
                data.status,
                data.paid_at || null,
                data.created_by || null,
                data.created_at,
            ],
        });
        return data;
    }

    async delete(id: string): Promise<void> {
        await db.execute({
            sql: "DELETE FROM payroll WHERE id = ?",
            args: [id],
        });
    }
}