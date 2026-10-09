import { injectable } from "tsyringe";
import { ICustomersRepository } from "../../Domain/repositories/customersRepository.interface";
import Customers from "../../Domain/entities/customers";
import { db } from "../database/initializeDatabase";

@injectable()
export class CustomersRepository implements ICustomersRepository {
    async findAll(page: number = 1, pageSize: number = 100): Promise<Customers[]> {
        const offset = (page - 1) * pageSize;
        const result = await db.execute({
            sql: "SELECT * FROM customers ORDER BY created_at DESC LIMIT ? OFFSET ?",
            args: [pageSize, offset],
        });
        return result.rows as unknown as Customers[];
    }

    async findById(id: string): Promise<Customers | null> {
        const result = await db.execute({
            sql: "SELECT * FROM customers WHERE id = ?",
            args: [id],
        });
        if (result.rows.length === 0) return null;
        return result.rows[0] as unknown as Customers;
    }

    async create(data: Customers): Promise<Customers> {
        await db.execute({
            sql: `INSERT INTO customers 
                  (id, name, ruc, phone, email, address, status, created_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                data.id,
                data.name,
                data.ruc || null,
                data.phone || null,
                data.email || null,
                data.address || null,
                data.status ? 1 : 0,
                data.created_at,
            ],
        });
        return data;
    }

    async update(data: Customers): Promise<Customers> {
        await db.execute({
            sql: `UPDATE customers SET 
                    name = ?, ruc = ?, phone = ?, email = ?, address = ?, status = ?
                  WHERE id = ?`,
            args: [
                data.name,
                data.ruc || null,
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
            sql: "DELETE FROM customers WHERE id = ?",
            args: [id],
        });
    }
}