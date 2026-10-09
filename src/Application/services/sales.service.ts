import { inject, injectable } from "tsyringe";
import { ISalesService } from "../interfaces/sales.service.interface";
import { ISalesRepository } from "../../Domain/repositories/salesRepository.interface";
import { SalesDto } from "../dtos/sales.dto";
import Sales, { SaleItem } from "../../Domain/entities/sales";
import { generateId } from "../../shared/utils/generateId";
import { db } from "../../Infrastructure/database/initializeDatabase";

@injectable()
export class SalesService implements ISalesService {
    private readonly _salesRepository: ISalesRepository;

    constructor(@inject("ISalesRepository") repository: ISalesRepository) {
        this._salesRepository = repository;
    }

    async findAll(page: number = 1, pageSize: number = 100): Promise<Sales[]> {
        return await this._salesRepository.findAll(page, pageSize);
    }

    async findById(id: string): Promise<Sales | null> {
        return await this._salesRepository.findById(id);
    }

    async findPendingCredits(): Promise<Sales[]> {
        return await this._salesRepository.findPendingCredits();
    }

    async findOverdueCredits(): Promise<Sales[]> {
        return await this._salesRepository.findOverdueCredits();
    }

    async create(data: SalesDto): Promise<Sales> {
        const saleId = generateId();
        const saleNumber = `V-${Date.now().toString().slice(-8)}`;

        // ✅ VALIDAR CRÉDITO
        const isCredit = data.payment_method === "CREDITO";
        
        if (isCredit && !data.due_date) {
            throw new Error("Debe especificar la fecha de pago para créditos");
        }
        if (isCredit && !data.customer_id) {
            throw new Error("Debe seleccionar un cliente para ventas a crédito");
        }

        const items: SaleItem[] = [];

        for (const item of data.items) {
            const productResult = await db.execute({
                sql: "SELECT * FROM PRODUCTS WHERE ID = ?",
                args: [item.product_id],
            });

            if (productResult.rows.length === 0) {
                throw new Error(`Producto no encontrado: ${item.product_id}`);
            }

            const product = productResult.rows[0];
            const currentStock = Number(product.STOCK) || 0;
            const productName = String(product.NAME || "Producto");

            if (currentStock < item.quantity) {
                throw new Error(`Stock insuficiente para ${productName}. Disponible: ${currentStock}`);
            }

            const unitPrice = Number(item.unit_price) || 0;
            const quantity = Number(item.quantity) || 0;
            const itemTotal = quantity * unitPrice;

            items.push({
                id: generateId(),
                sale_id: saleId,
                product_id: item.product_id,
                product_name: productName,
                quantity: quantity,
                unit_price: unitPrice,
                total: itemTotal,
            });

            const newStock = currentStock - quantity;
            await db.execute({
                sql: "UPDATE PRODUCTS SET STOCK = ? WHERE ID = ?",
                args: [newStock, item.product_id],
            });

            await db.execute({
                sql: `INSERT INTO INVENTORY_MOVEMENTS 
                      (ID, PRODUCT_ID, MOVEMENT_TYPE, QUANTITY, PREVIOUS_STOCK, NEW_STOCK, REASON, CREATED_BY, CREATED_AT)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                args: [
                    generateId(),
                    item.product_id,
                    "salida",
                    quantity,
                    currentStock,
                    newStock,
                    `Venta${isCredit ? " a crédito" : ""}: ${saleNumber}`,
                    data.created_by || "system",
                    new Date().toISOString(),
                ],
            });
        }

        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const tax = subtotal * 0.15;
        const total = subtotal + tax;

        const newSale: Sales = {
            id: saleId,
            sale_number: saleNumber,
            customer_id: data.customer_id,
            subtotal,
            tax,
            total,
            payment_method: data.payment_method,
            payment_status: isCredit ? "PENDIENTE" : "PAGADO",
            due_date: isCredit ? data.due_date : undefined,
            paid_at: isCredit ? undefined : new Date().toISOString(),
            status: data.status || "COMPLETADA",
            created_by: data.created_by,
            created_at: new Date().toISOString(),
            items,
        };

        await this._salesRepository.create(newSale, items);
        return newSale;
    }

    async registerPayment(id: string): Promise<Sales | null> {
        const sale = await this._salesRepository.findById(id);
        if (!sale) return null;
        if (sale.payment_status === "PAGADO") {
            throw new Error("Esta venta ya fue pagada");
        }

        await this._salesRepository.registerPayment(id);
        return await this._salesRepository.findById(id);
    }

    async delete(id: string): Promise<void> {
        const existing = await this._salesRepository.findById(id);
        if (!existing) return;
        return await this._salesRepository.delete(id);
    }
}