import { inject, injectable } from "tsyringe";
import { ISalesService } from "../interfaces/sales.service.interface";
import { ISalesRepository } from "../../Domain/repositories/salesRepository.interface";
import { SalesDto } from "../dtos/sales.dto";
import Sales, { SaleItem } from "../../Domain/entities/sales";
import { generateId } from "../../shared/utils/generateId";
import { db } from "../../Infrastructure/database/initializeDatabase";
import { executeWithRetry } from "../../shared/utils/dbHelper";

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

    // ============================================
    // CREAR VENTA (NORMAL / APARTADO / CREDITO)
    // ============================================
    async create(data: SalesDto): Promise<Sales> {
        const saleId = generateId();
        const saleNumber = `V-${Date.now().toString().slice(-8)}`;

        // ✅ Tipo de venta (default NORMAL)
        const saleType = (data.sale_type || "NORMAL").toUpperCase();
        const isApartado = saleType === "APARTADO";
        const isCredito = saleType === "CREDITO";
        const isNormal = saleType === "NORMAL";

        // ============================================
        // VALIDACIONES SEGÚN TIPO
        // ============================================
        if (!isNormal && !isApartado && !isCredito) {
            throw new Error(`Tipo de venta inválido: ${saleType}`);
        }

        // Para APARTADO y CREDITO: requiere cliente O nombre opcional
        if ((isApartado || isCredito) && !data.customer_id && !data.customer_name_optional) {
            throw new Error(
                "Debe seleccionar un cliente registrado o ingresar un nombre para apartados/créditos"
            );
        }

        // Para APARTADO y CREDITO: requiere próxima fecha de abono
        if ((isApartado || isCredito) && !data.next_payment_date) {
            throw new Error("Debe especificar la fecha del próximo abono");
        }

        // ============================================
        // PROCESAR ITEMS
        // ============================================
        const items: SaleItem[] = [];

        for (const item of data.items) {
            const productResult = await executeWithRetry(
                "SELECT * FROM PRODUCTS WHERE ID = ?",
                [item.product_id]
            );

            if (productResult.rows.length === 0) {
                throw new Error(`Producto no encontrado: ${item.product_id}`);
            }

            const product = productResult.rows[0];
            const currentStock = Number(product.STOCK) || 0;
            const currentReserved = Number(product.RESERVED_STOCK) || 0;
            const productName = String(product.NAME || "Producto");
            const availableStock = currentStock - currentReserved;

            // ✅ Validar stock disponible (restando lo reservado)
            if (availableStock < item.quantity) {
                throw new Error(
                    `Stock insuficiente para ${productName}. Disponible: ${availableStock}`
                );
            }

            const unitPrice = Number(item.unit_price) || 0;
            const quantity = Number(item.quantity) || 0;
            const itemTotal = quantity * unitPrice;
            const originalPrice = Number(item.original_price) || unitPrice;
            const discount = Number(item.discount) || (originalPrice > unitPrice ? originalPrice - unitPrice : 0);

            items.push({
                id: generateId(),
                sale_id: saleId,
                product_id: item.product_id,
                product_name: productName,
                quantity: quantity,
                unit_price: unitPrice,
                original_price: originalPrice,  
                discount: discount * quantity,
                total: itemTotal,
            });

            // ============================================
            // MANEJO DE STOCK SEGÚN TIPO
            // ============================================
            if (isApartado) {
                // 🔒 APARTADO: reservar stock (NO descontar)
                const newReserved = currentReserved + quantity;
                await executeWithRetry(
                    "UPDATE PRODUCTS SET RESERVED_STOCK = ? WHERE ID = ?",
                    [newReserved, item.product_id]
                );

                // Registrar movimiento de reserva (auditoría)
                await executeWithRetry(
                    `INSERT INTO INVENTORY_MOVEMENTS 
                     (ID, PRODUCT_ID, MOVEMENT_TYPE, QUANTITY, PREVIOUS_STOCK, NEW_STOCK, REASON, CREATED_BY, CREATED_AT)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        generateId(),
                        item.product_id,
                        "reserva",
                        quantity,
                        currentStock,
                        currentStock, // No cambia el stock real
                        `Apartado: ${saleNumber}`,
                        data.created_by || "system",
                        new Date().toISOString(),
                    ]
                );
            } else {
                // 💵 NORMAL o 📝 CREDITO: descontar stock real
                const newStock = currentStock - quantity;
                await executeWithRetry(
                    "UPDATE PRODUCTS SET STOCK = ? WHERE ID = ?",
                    [newStock, item.product_id]
                );

                await executeWithRetry(
                    `INSERT INTO INVENTORY_MOVEMENTS 
                     (ID, PRODUCT_ID, MOVEMENT_TYPE, QUANTITY, PREVIOUS_STOCK, NEW_STOCK, REASON, CREATED_BY, CREATED_AT)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        generateId(),
                        item.product_id,
                        "salida",
                        quantity,
                        currentStock,
                        newStock,
                        `Venta${isCredito ? " a crédito" : ""}: ${saleNumber}${discount > 0 ? ` (rebaja: C$ ${discount.toFixed(2)})` : ""}`,
                        data.created_by || "system",
                        new Date().toISOString(),
                    ]
                );
            }
        }

        // ============================================
        // CÁLCULOS FINALES
        // ============================================
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const tax = subtotal * 0.15;
        const total = subtotal + tax;

        // ✅ Según el tipo, definir estados
        const totalPaid = isNormal ? total : 0;
        const balanceDue = isNormal ? 0 : total;
        const paymentStatus = isNormal ? "PAGADO" : "PENDIENTE";
        const deliveryStatus = isApartado ? "RESERVADO" : "ENTREGADO";

        const newSale: Sales = {
            id: saleId,
            sale_number: saleNumber,
            customer_id: data.customer_id || undefined,
            customer_name_optional: data.customer_name_optional || undefined,
            subtotal,
            tax,
            total,
            total_paid: totalPaid,
            balance_due: balanceDue,
            payment_method: data.payment_method,
            payment_status: paymentStatus,
            sale_type: saleType,
            delivery_status: deliveryStatus,
            due_date: data.due_date || undefined,
            next_payment_date: data.next_payment_date || undefined,
            notification_days_before: data.notification_days_before ?? 3,
            paid_at: isNormal ? new Date().toISOString() : undefined,
            status: data.status || "COMPLETADA",
            created_by: data.created_by,
            created_at: new Date().toISOString(),
            items,
        };

        await this._salesRepository.create(newSale, items);
        return newSale;
    }

    // ============================================
    // REGISTRAR PAGO COMPLETO (créditos simples)
    // ============================================
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

    // ============================================
    // VENTAS CON SALDO PENDIENTE
    // ============================================
    async getPendingSales(): Promise<Sales[]> {
        const result = await executeWithRetry(
            `SELECT 
                s.*,
                c.name as customer_name,
                c.email as customer_email,
                c.phone as customer_phone
             FROM sales s
             LEFT JOIN customers c ON s.customer_id = c.id
             WHERE s.balance_due > 0 
               AND s.status != 'ANULADA'
             ORDER BY s.next_payment_date ASC, s.created_at DESC`
        );

        return result.rows as unknown as Sales[];
    }

    // ============================================
    // CANCELAR APARTADO Y LIBERAR STOCK
    // ============================================
    async cancelReservation(saleId: string, userId: string): Promise<{ message: string }> {
        const saleResult = await executeWithRetry(
            "SELECT * FROM sales WHERE id = ?",
            [saleId]
        );

        if (saleResult.rows.length === 0) {
            throw new Error("La venta no existe");
        }

        const sale = saleResult.rows[0] as Record<string, unknown>;

        if (sale.sale_type !== "APARTADO") {
            throw new Error("Solo se pueden cancelar apartados");
        }

        if (sale.delivery_status === "ENTREGADO") {
            throw new Error("Este apartado ya fue entregado");
        }

        // Liberar stock reservado
        const itemsResult = await executeWithRetry(
            "SELECT * FROM sale_items WHERE sale_id = ?",
            [saleId]
        );

        for (const item of itemsResult.rows as Array<Record<string, unknown>>) {
            await executeWithRetry(
                `UPDATE products 
                 SET reserved_stock = reserved_stock - ?
                 WHERE id = ?`,
                [item.quantity, item.product_id]
            );
        }

        // Marcar la venta como cancelada
        await executeWithRetry(
            `UPDATE sales 
             SET status = 'CANCELADA',
                 delivery_status = 'CANCELADO',
                 balance_due = 0
             WHERE id = ?`,
            [saleId]
        );

        console.log(`✅ Apartado ${sale.sale_number} cancelado por ${userId}`);

        return { message: "Apartado cancelado correctamente" };
    }

        // ✅ Actualizar fecha de pago (Re-negociación)
    async updatePaymentDate(saleId: string, newDate: string): Promise<{ message: string }> {
        // Validar que la venta exista
        const sale = await this._salesRepository.findById(saleId);
        if (!sale) throw new Error("La venta no existe");

        // Validar que no esté pagada
        if (sale.payment_status === "PAGADO") {
            throw new Error("Esta venta ya está pagada");
        }

        await this._salesRepository.updateNextPaymentDate(saleId, newDate);
        return { message: "Fecha de pago actualizada correctamente" };
    }
}