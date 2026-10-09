import { injectable } from "tsyringe";
import { IPurchasesRepository } from "../../Domain/repositories/purchasesRepository.interface";
import Purchases, { PurchaseOrderItem } from "../../Domain/entities/purchases";
import { db } from "../database/initializeDatabase";

@injectable()
export class PurchasesRepository implements IPurchasesRepository {

    async findAll(page: number = 1, pageSize: number = 100): Promise<Purchases[]> {
        const offset = (page - 1) * pageSize;
        const result = await db.execute({
            sql: "SELECT * FROM purchase_orders ORDER BY created_at DESC LIMIT ? OFFSET ?",
            args: [pageSize, offset],
        });

        const purchases = result.rows as unknown as Purchases[];

        // ✅ CARGAR LOS ITEMS DE CADA ORDEN
        for (const purchase of purchases) {
            purchase.items = await this.findItemsByPurchaseId(purchase.id);
        }

        return purchases;
    }

    async findById(id: string): Promise<Purchases | null> {
        const result = await db.execute({
            sql: "SELECT * FROM purchase_orders WHERE id = ?",
            args: [id],
        });
        if (result.rows.length === 0) return null;

        const purchase = result.rows[0] as unknown as Purchases;
        purchase.items = await this.findItemsByPurchaseId(id);
        return purchase;
    }

    async findItemsByPurchaseId(purchaseId: string): Promise<PurchaseOrderItem[]> {
        const result = await db.execute({
            sql: "SELECT * FROM purchase_order_items WHERE purchase_order_id = ?",
            args: [purchaseId],
        });
        return result.rows as unknown as PurchaseOrderItem[];
    }

    async create(data: Purchases, items: PurchaseOrderItem[]): Promise<Purchases> {
        // Insertar orden
        await db.execute({
            sql: `INSERT INTO purchase_orders 
                  (id, supplier_id, order_number, status, subtotal, tax, total, notes, created_by, created_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                data.id,
                data.supplier_id,
                data.order_number,
                data.status,
                data.subtotal,
                data.tax,
                data.total,
                data.notes || null,
                data.created_by || null,
                data.created_at,
            ],
        });

        // ✅ Insertar items CON el purchase_order_id correcto
        for (const item of items) {
            await db.execute({
                sql: `INSERT INTO purchase_order_items 
                      (id, purchase_order_id, product_id, product_name, quantity, unit_price, total)
                      VALUES (?, ?, ?, ?, ?, ?, ?)`,
                args: [
                    item.id,
                    data.id,  // ✅ Usar el ID de la orden recién creada
                    item.product_id,
                    item.product_name || null,
                    item.quantity,
                    item.unit_price,
                    item.total,
                ],
            });
        }

        // ✅ Asignar los items al objeto de retorno
        data.items = items;
        return data;
    }

    async update(data: Purchases, items: PurchaseOrderItem[]): Promise<Purchases> {
        // Actualizar orden
        await db.execute({
            sql: `UPDATE purchase_orders SET 
                    supplier_id = ?, order_number = ?, status = ?, 
                    subtotal = ?, tax = ?, total = ?, notes = ?
                  WHERE id = ?`,
            args: [
                data.supplier_id,
                data.order_number,
                data.status,
                data.subtotal,
                data.tax,
                data.total,
                data.notes || null,
                data.id,
            ],
        });

        // Eliminar items anteriores
        await db.execute({
            sql: "DELETE FROM purchase_order_items WHERE purchase_order_id = ?",
            args: [data.id],
        });

        // Insertar nuevos items
        for (const item of items) {
            await db.execute({
                sql: `INSERT INTO purchase_order_items 
                      (id, purchase_order_id, product_id, product_name, quantity, unit_price, total)
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

    async updateStatus(id: string, status: string): Promise<void> {
        const receivedAt = status === "RECIBIDA" ? new Date().toISOString() : null;
        await db.execute({
            sql: "UPDATE purchase_orders SET status = ?, received_at = ? WHERE id = ?",
            args: [status, receivedAt, id],
        });
    }

    async delete(id: string): Promise<void> {
        await db.execute({
            sql: "DELETE FROM purchase_order_items WHERE purchase_order_id = ?",
            args: [id],
        });
        await db.execute({
            sql: "DELETE FROM purchase_orders WHERE id = ?",
            args: [id],
        });
    }
}