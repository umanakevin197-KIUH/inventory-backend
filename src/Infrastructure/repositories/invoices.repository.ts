import { injectable } from "tsyringe";
import { IInvoicesRepository } from "../../Domain/repositories/invoicesRepository.interface";
import Invoices from "../../Domain/entities/invoices";
import { db } from "../database/initializeDatabase";

@injectable()
export class InvoicesRepository implements IInvoicesRepository {

    async findAll(page: number = 1, pageSize: number = 100): Promise<Invoices[]> {
        const offset = (page - 1) * pageSize;
        const result = await db.execute({
            sql: "SELECT * FROM invoices ORDER BY created_at DESC LIMIT ? OFFSET ?",
            args: [pageSize, offset],
        });
        return result.rows as unknown as Invoices[];
    }

    async findById(id: string): Promise<Invoices | null> {
        const result = await db.execute({
            sql: "SELECT * FROM invoices WHERE id = ?",
            args: [id],
        });
        if (result.rows.length === 0) return null;
        return result.rows[0] as unknown as Invoices;
    }

    async findBySaleId(saleId: string): Promise<Invoices | null> {
        const result = await db.execute({
            sql: "SELECT * FROM invoices WHERE sale_id = ?",
            args: [saleId],
        });
        if (result.rows.length === 0) return null;
        return result.rows[0] as unknown as Invoices;
    }

    async create(data: Invoices): Promise<Invoices> {
        await db.execute({
            sql: `INSERT INTO invoices 
                  (id, invoice_number, sale_id, customer_id, type, subtotal, tax, total, status, notes, created_by, created_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                data.id,
                data.invoice_number,
                data.sale_id,
                data.customer_id || null,
                data.type,
                data.subtotal,
                data.tax,
                data.total,
                data.status,
                data.notes || null,
                data.created_by || null,
                data.created_at,
            ],
        });
        return data;
    }

    async updateStatus(id: string, status: string): Promise<void> {
        await db.execute({
            sql: "UPDATE invoices SET status = ? WHERE id = ?",
            args: [status, id],
        });
    }

    async delete(id: string): Promise<void> {
        await db.execute({
            sql: "DELETE FROM invoices WHERE id = ?",
            args: [id],
        });
    }
}