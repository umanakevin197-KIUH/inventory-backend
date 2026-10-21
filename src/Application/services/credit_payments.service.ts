import { injectable, inject } from "tsyringe";
import { ICreditPaymentsService } from "../interfaces/credit_payments.service.interface";
import { ICreditPaymentsRepository } from "../../Domain/repositories/credit_paymentsRepository.interface";
import CreditPayments from "../../Domain/entities/credit_payments";
import { CreditPaymentsDto } from "../dtos/credit_payments.dto";
import { executeWithRetry } from "../../shared/utils/dbHelper";
import { randomUUID } from "crypto";

@injectable()
export class CreditPaymentsService implements ICreditPaymentsService {

    constructor(
        @inject("ICreditPaymentsRepository")
        private _creditPaymentsRepository: ICreditPaymentsRepository
    ) {}

    async registerPayment(data: CreditPaymentsDto): Promise<CreditPayments> {
        // 1. Verificar que la venta exista
        const saleResult = await executeWithRetry(
            "SELECT * FROM sales WHERE id = ?",
            [data.sale_id]
        );

        if (saleResult.rows.length === 0) {
            throw new Error("La venta no existe");
        }

        const sale = saleResult.rows[0] as any;
        const currentBalance = Number(sale.balance_due) || 0;
        const currentPaid = Number(sale.total_paid) || 0;
        const saleType = sale.sale_type || "NORMAL";

        // 2. Validar el monto
        if (data.amount <= 0) {
            throw new Error("El monto del abono debe ser mayor a 0");
        }

        if (data.amount > currentBalance) {
            throw new Error(
                `El abono (C$ ${data.amount.toFixed(2)}) supera el saldo pendiente (C$ ${currentBalance.toFixed(2)})`
            );
        }

        // 3. Registrar el abono
        const newPayment: CreditPayments = {
            id: randomUUID(),
            sale_id: data.sale_id,
            amount: data.amount,
            payment_method: "EFECTIVO",
            notes: data.notes,
            created_by: data.created_by,
            created_at: new Date().toISOString(),
        };

        await this._creditPaymentsRepository.create(newPayment);

        // 4. Actualizar la venta
        const newPaid = currentPaid + data.amount;
        const newBalance = currentBalance - data.amount;
        const isComplete = newBalance <= 0;

        // Si es APARTADO y se completó → se entrega y se descuenta stock
        let deliveryStatus = sale.delivery_status || "ENTREGADO";
        if (isComplete && saleType === "APARTADO") {
            deliveryStatus = "ENTREGADO";
        }

           // ✅ LÓGICA AUTOMÁTICA DE NUEVA FECHA
        let nextPaymentDate = sale.next_payment_date;
        
        // Si no ha terminado de pagar, calculamos la próxima fecha sumando 15 días (puedes cambiar el 15)
        if (!isComplete) {
            const newDate = new Date();
            newDate.setDate(newDate.getDate() + 15); // Por defecto sumamos 15 días
            nextPaymentDate = newDate.toISOString().split("T")[0]; // Formato YYYY-MM-DD
        } else {
            // Si ya terminó de pagar, limpiamos la fecha
            nextPaymentDate = null; 
        }

        await executeWithRetry(
            `UPDATE sales SET 
                total_paid = ?,
                balance_due = ?,
                payment_status = ?,
                delivery_status = ?
             WHERE id = ?`,
            [
                newPaid,
                newBalance,
                isComplete ? "PAGADO" : "PENDIENTE",
                deliveryStatus,
                data.sale_id,
            ]
        );

        // 5. Si es APARTADO y se completó → descontar stock real
        if (isComplete && saleType === "APARTADO") {
            const itemsResult = await executeWithRetry(
                "SELECT * FROM sale_items WHERE sale_id = ?",
                [data.sale_id]
            );

            for (const item of itemsResult.rows as any[]) {
                // Descontar del stock real y liberar la reserva
                await executeWithRetry(
                    `UPDATE products 
                     SET stock = stock - ?,
                         reserved_stock = reserved_stock - ?
                     WHERE id = ?`,
                    [item.quantity, item.quantity, item.product_id]
                );

                // Registrar el movimiento de salida
                const productResult = await executeWithRetry(
                    "SELECT stock FROM products WHERE id = ?",
                    [item.product_id]
                );
                const newStock = productResult.rows[0]?.stock || 0;

                await executeWithRetry(
                    `INSERT INTO inventory_movements 
                     (ID, PRODUCT_ID, MOVEMENT_TYPE, QUANTITY, PREVIOUS_STOCK, NEW_STOCK, REASON, CREATED_BY, CREATED_AT)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        randomUUID(),
                        item.product_id,
                        "salida",
                        item.quantity,
                        newStock + Number(item.quantity),
                        newStock,
                        `Apartado completado - Venta ${sale.sale_number}`,
                        data.created_by || "system",
                        new Date().toISOString(),
                    ]
                );
            }
        }

        return newPayment;
    }

    async getPaymentsBySale(saleId: string): Promise<CreditPayments[]> {
        return await this._creditPaymentsRepository.findBySaleId(saleId);
    }
}