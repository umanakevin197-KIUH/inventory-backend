import { injectable } from "tsyringe";
import { IEmployeesRepository } from "../../Domain/repositories/employeesRepository.interface";
import Employees from "../../Domain/entities/employees";
import { db } from "../database/initializeDatabase";

@injectable()
export class EmployeesRepository implements IEmployeesRepository {

    async findAll(page: number = 1, pageSize: number = 100): Promise<Employees[]> {
        const offset = (page - 1) * pageSize;
        const result = await db.execute({
            sql: "SELECT * FROM employees ORDER BY name ASC LIMIT ? OFFSET ?",
            args: [pageSize, offset],
        });
        return result.rows as unknown as Employees[];
    }

    async findById(id: string): Promise<Employees | null> {
        const result = await db.execute({
            sql: "SELECT * FROM employees WHERE id = ?",
            args: [id],
        });
        if (result.rows.length === 0) return null;
        return result.rows[0] as unknown as Employees;
    }

    async create(data: Employees): Promise<Employees> {
        await db.execute({
            sql: `INSERT INTO employees 
                  (id, name, position, salary, hire_date, phone, email, address, status, created_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                data.id,
                data.name,
                data.position || null,
                data.salary || 0,
                data.hire_date || null,
                data.phone || null,
                data.email || null,
                data.address || null,
                data.status ? 1 : 0,
                data.created_at,
            ],
        });
        return data;
    }

    async update(data: Employees): Promise<Employees> {
        await db.execute({
            sql: `UPDATE employees SET 
                    name = ?, position = ?, salary = ?, hire_date = ?, 
                    phone = ?, email = ?, address = ?, status = ?
                  WHERE id = ?`,
            args: [
                data.name,
                data.position || null,
                data.salary || 0,
                data.hire_date || null,
                data.phone || null,
                data.email || null,
                data.address || null,
                data.status ? 1 : 0,
                data.id,
            ],
        });
        return data;
    }

    async delete(id: string): Promise<void> {
        await db.execute({
            sql: "DELETE FROM employees WHERE id = ?",
            args: [id],
        });
    }
}