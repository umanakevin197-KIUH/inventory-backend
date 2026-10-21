import { injectable } from "tsyringe";
import { ISalesRepository } from "../../Domain/repositories/salesRepository.interface";
import Sales, { SaleItem } from "../../Domain/entities/sales";
import { db } from "../database/initializeDatabase";
import { executeWithRetry } from "../../shared/utils/dbHelper";

@injectable()
export class SalesRepository implements ISalesRepository {

    async findAll(page: number = 1, pageSize: number = 100): Promise<Sales[]> {
        const offset = (page - 1) * pageSize;
        const result = await executeWithRetry(
            "SELECT * FROM sales ORDER BY created_at DESC LIMIT ? OFFSET ?",
            [pageSize, offset]
        );

        const sales = result.rows as unknown as Sales[];
        for (const sale of sales) {
            sale.items = await this.findItemsBySaleId(sale.id);
        }
        return sales;
    }

    async findById(id: string): Promise<Sales | null> {
        const result = await executeWithRetry(
            "SELECT * FROM sales WHERE id = ?",
            [id]
        );
        if (result.rows.length === 0) return null;

        const sale = result.rows[0] as unknown as Sales;
        sale.items = await this.findItemsBySaleId(id);
        return sale;
    }

    async findItemsBySaleId(saleId: string): Promise<SaleItem[]> {
        const result = await executeWithRetry(
            "SELECT * FROM sale_items WHERE sale_id = ?",
            [saleId]
        );
        return result.rows as unknown as SaleItem[];
    }

    // ============================================
    // CRÉDITOS PENDIENTES (usando balance_due)
    // ============================================
    async findPendingCredits(): Promise<Sales[]> {
        const result = await executeWithRetry(
            `SELECT * FROM sales 
             WHERE balance_due > 0 
               AND status != 'CANCELADA'
             ORDER BY next_payment_date ASC`,
            []
        );
        const sales = result.rows as unknown as Sales[];
        for (const sale of sales) {
            sale.items = await this.findItemsBySaleId(sale.id);
        }
        return sales;
    }

    // ============================================
    // CRÉDITOS VENCIDOS
    // ============================================
    async findOverdueCredits(): Promise<Sales[]> {
        const today = new Date().toISOString().split("T")[0];
        const result = await executeWithRetry(
            `SELECT * FROM sales 
             WHERE balance_due > 0 
               AND status != 'CANCELADA'
               AND next_payment_date IS NOT NULL
               AND next_payment_date < ?
             ORDER BY next_payment_date ASC`,
            [today]
        );
        const sales = result.rows as unknown as Sales[];
        for (const sale of sales) {
            sale.items = await this.findItemsBySaleId(sale.id);
        }
        return sales;
    }

    // ============================================
    // CREAR VENTA (con todos los campos nuevos)
    // ============================================
    async create(data: Sales, items: SaleItem[]): Promise<Sales> {
        await executeWithRetry(
            `INSERT INTO sales 
             (id, sale_number, customer_id, customer_name_optional, 
              subtotal, tax, total, total_paid, balance_due,
              payment_method, payment_status, sale_type, delivery_status,
              due_date, next_payment_date, notification_days_before,
              reservation_expires_at, paid_at, status, created_by, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.id,
                data.sale_number,
                data.customer_id || null,
                data.customer_name_optional || null,
                data.subtotal,
                data.tax,
                data.total,
                data.total_paid ?? 0,
                data.balance_due ?? data.total,
                data.payment_method,
                data.payment_status || "PAGADO",
                data.sale_type || "NORMAL",
                data.delivery_status || "ENTREGADO",
                data.due_date || null,
                data.next_payment_date || null,
                data.notification_days_before ?? 3,
                data.reservation_expires_at || null,
                data.paid_at || null,
                data.status,
                data.created_by || null,
                data.created_at,
            ]
        );

        for (const item of items) {
            await executeWithRetry(
                `INSERT INTO sale_items 
                 (id, sale_id, product_id, product_name, quantity, unit_price, original_price, discount, total)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    item.id,
                    data.id,
                    item.product_id,
                    item.product_name || null,
                    item.quantity,
                    item.unit_price,
                    item.original_price || item.unit_price,
                    item.discount || 0,
                    item.total,
                ]
            );
        }

        data.items = items;
        return data;
    }

    // ============================================
    // REGISTRAR PAGO COMPLETO
    // ============================================
    async registerPayment(id: string): Promise<void> {
        // Obtener la venta para saber el total
        const saleResult = await executeWithRetry(
            "SELECT total FROM sales WHERE id = ?",
            [id]
        );

        const total = saleResult.rows.length > 0 
            ? Number(saleResult.rows[0].total) 
            : 0;

        await executeWithRetry(
            `UPDATE sales SET 
                payment_status = 'PAGADO',
                total_paid = ?,
                balance_due = 0,
                delivery_status = CASE 
                    WHEN sale_type = 'APARTADO' THEN 'ENTREGADO'
                    ELSE delivery_status
                END,
                paid_at = ?
             WHERE id = ?`,
            [total, new Date().toISOString(), id]
        );
    }

    // ============================================
    // ELIMINAR
    // ============================================
    async delete(id: string): Promise<void> {
        await executeWithRetry(
            "DELETE FROM sale_items WHERE sale_id = ?",
            [id]
        );
        await executeWithRetry(
            "DELETE FROM sales WHERE id = ?",
            [id]
        );
    }

        // ✅ Actualizar la fecha de próximo pago
    async updateNextPaymentDate(saleId: string, newDate: string): Promise<void> {
        await executeWithRetry(
            `UPDATE sales SET next_payment_date = ? WHERE id = ?`,
            [newDate, saleId]
        );
    }
}