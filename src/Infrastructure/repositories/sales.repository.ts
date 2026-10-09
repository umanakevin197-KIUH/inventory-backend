import { injectable } from "tsyringe";
import { ISalesRepository } from "../../Domain/repositories/salesRepository.interface";
import Sales, { SaleItem } from "../../Domain/entities/sales";
import { db } from "../database/initializeDatabase";

@injectable()
export class SalesRepository implements ISalesRepository {

    async findAll(page: number = 1, pageSize: number = 100): Promise<Sales[]> {
        const offset = (page - 1) * pageSize;
        const result = await db.execute({
            sql: "SELECT * FROM sales ORDER BY created_at DESC LIMIT ? OFFSET ?",
            args: [pageSize, offset],
        });

        const sales = result.rows as unknown as Sales[];
        for (const sale of sales) {
            sale.items = await this.findItemsBySaleId(sale.id);
        }
        return sales;
    }

    async findById(id: string): Promise<Sales | null> {
        const result = await db.execute({
            sql: "SELECT * FROM sales WHERE id = ?",
            args: [id],
        });
        if (result.rows.length === 0) return null;

        const sale = result.rows[0] as unknown as Sales;
        sale.items = await this.findItemsBySaleId(id);
        return sale;
    }

    async findItemsBySaleId(saleId: string): Promise<SaleItem[]> {
        const result = await db.execute({
            sql: "SELECT * FROM sale_items WHERE sale_id = ?",
            args: [saleId],
        });
        return result.rows as unknown as SaleItem[];
    }

    async findPendingCredits(): Promise<Sales[]> {
        const result = await db.execute({
            sql: `SELECT * FROM sales 
                  WHERE payment_method = 'CREDITO' 
                  AND payment_status = 'PENDIENTE'
                  ORDER BY due_date ASC`,
            args: [],
        });
        const sales = result.rows as unknown as Sales[];
        for (const sale of sales) {
            sale.items = await this.findItemsBySaleId(sale.id);
        }
        return sales;
    }

    async findOverdueCredits(): Promise<Sales[]> {
        const today = new Date().toISOString().split("T")[0];
        const result = await db.execute({
            sql: `SELECT * FROM sales 
                  WHERE payment_method = 'CREDITO' 
                  AND payment_status = 'PENDIENTE'
                  AND due_date < ?
                  ORDER BY due_date ASC`,
            args: [today],
        });
        const sales = result.rows as unknown as Sales[];
        for (const sale of sales) {
            sale.items = await this.findItemsBySaleId(sale.id);
        }
        return sales;
    }

    async create(data: Sales, items: SaleItem[]): Promise<Sales> {
        await db.execute({
            sql: `INSERT INTO sales 
                  (id, sale_number, customer_id, subtotal, tax, total, payment_method, payment_status, due_date, paid_at, status, created_by, created_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                data.id,
                data.sale_number,
                data.customer_id || null,
                data.subtotal,
                data.tax,
                data.total,
                data.payment_method,
                data.payment_status || "PAGADO",
                data.due_date || null,
                data.paid_at || null,
                data.status,
                data.created_by || null,
                data.created_at,
            ],
        });

        for (const item of items) {
            await db.execute({
                sql: `INSERT INTO sale_items 
                      (id, sale_id, product_id, product_name, quantity, unit_price, total)
                      VALUES (?, ?, ?, ?, ?, ?, ?)`,
                args: [
                    item.id,
                    data.id,
                    item.product_id,
                    item.product_name || null,
                    item.quantity,
                    item.unit_price,
                    item.total,
                ],
            });
        }

        data.items = items;
        return data;
    }

    async registerPayment(id: string): Promise<void> {
        await db.execute({
            sql: `UPDATE sales SET 
                    payment_status = 'PAGADO',
                    paid_at = ?
                  WHERE id = ?`,
            args: [new Date().toISOString(), id],
        });
    }

    async delete(id: string): Promise<void> {
        await db.execute({
            sql: "DELETE FROM sale_items WHERE sale_id = ?",
            args: [id],
        });
        await db.execute({
            sql: "DELETE FROM sales WHERE id = ?",
            args: [id],
        });
    }
}