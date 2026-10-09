import { inject, injectable } from "tsyringe";
import { IPurchasesService } from "../interfaces/purchases.service.interface";
import { IPurchasesRepository } from "../../Domain/repositories/purchasesRepository.interface";
import { PurchasesDto } from "../dtos/purchases.dto";
import Purchases, { PurchaseOrderItem } from "../../Domain/entities/purchases";
import { generateId } from "../../shared/utils/generateId";
import { db } from "../../Infrastructure/database/initializeDatabase";

@injectable()
export class PurchasesService implements IPurchasesService {
    private readonly _purchasesRepository: IPurchasesRepository;

    constructor(@inject("IPurchasesRepository") repository: IPurchasesRepository) {
        this._purchasesRepository = repository;
    }

    async findAll(page: number = 1, pageSize: number = 100): Promise<Purchases[]> {
        return await this._purchasesRepository.findAll(page, pageSize);
    }

    async findById(id: string): Promise<Purchases | null> {
        return await this._purchasesRepository.findById(id);
    }

    async create(data: PurchasesDto): Promise<Purchases> {
        // ✅ PRIMERO crear el ID de la orden
    const purchaseId = generateId();
    const orderNumber = `OC-${Date.now().toString().slice(-8)}`;
        // Calcular totales
        const items: PurchaseOrderItem[] = data.items.map((item) => ({
            id: generateId(),
            purchase_order_id: purchaseId,
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.quantity * item.unit_price,
        }));

        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const tax = subtotal * 0.15; // IVA 15%
        const total = subtotal + tax;


        const newPurchase: Purchases = {
            id: purchaseId,
            supplier_id: data.supplier_id,
            order_number: orderNumber,
            status: data.status || "PENDIENTE",
            subtotal,
            tax,
            total,
            notes: data.notes,
            created_by: data.created_by,
            created_at: new Date().toISOString(),
            items: items,
        };

        await this._purchasesRepository.create(newPurchase, items);
        return newPurchase;
    }

    async update(id: string, data: PurchasesDto): Promise<Purchases | null> {
        const existing = await this._purchasesRepository.findById(id);
        if (!existing) return null;

        // Recalcular items
        const items: PurchaseOrderItem[] = data.items.map((item) => ({
            id: generateId(),
            purchase_order_id: id,
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.quantity * item.unit_price,
        }));

        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const tax = subtotal * 0.15;
        const total = subtotal + tax;

        const updatedPurchase: Purchases = {
            ...existing,
            supplier_id: data.supplier_id,
            status: data.status || existing.status,
            subtotal,
            tax,
            total,
            notes: data.notes,
        };

        await this._purchasesRepository.update(updatedPurchase, items);
        return updatedPurchase;
    }

    async receive(id: string): Promise<Purchases | null> {
        const purchase = await this._purchasesRepository.findById(id);
        if (!purchase) return null;

        if (purchase.status === "RECIBIDA") {
            throw new Error("Esta orden ya fue recibida");
        }

        // Actualizar stock de cada producto
        if (purchase.items) {
            for (const item of purchase.items) {
                await db.execute({
                    sql: `UPDATE products 
                          SET stock = stock + ? 
                          WHERE id = ?`,
                    args: [item.quantity, item.product_id],
                });

                // Registrar movimiento de entrada
                await db.execute({
                    sql: `INSERT INTO inventory_movements 
                          (ID, PRODUCT_ID, MOVEMENT_TYPE, QUANTITY, PREVIOUS_STOCK, NEW_STOCK, REASON, CREATED_BY, CREATED_AT)
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    args: [
                        generateId(),
                        item.product_id,
                        "entrada",
                        item.quantity,
                        0,
                        item.quantity,
                        `Compra recibida: ${purchase.order_number}`,
                        purchase.created_by || "system",
                        new Date().toISOString(),
                    ],
                });
            }
        }

        // Actualizar estado
        await this._purchasesRepository.updateStatus(id, "RECIBIDA");

        return await this._purchasesRepository.findById(id);
    }

    async delete(id: string): Promise<void> {
        const existing = await this._purchasesRepository.findById(id);
        if (!existing) return;
        return await this._purchasesRepository.delete(id);
    }
}