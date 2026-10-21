import { injectable } from "tsyringe";
import { ICreditPaymentsRepository } from "../../Domain/repositories/credit_paymentsRepository.interface";
import CreditPayments from "../../Domain/entities/credit_payments";
import { executeWithRetry } from "../../shared/utils/dbHelper";

@injectable()
export class CreditPaymentsRepository implements ICreditPaymentsRepository {

    async create(data: CreditPayments): Promise<CreditPayments> {
        await executeWithRetry(
            `INSERT INTO credit_payments 
             (id, sale_id, amount, payment_method, notes, created_by, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                data.id,
                data.sale_id,
                data.amount,
                data.payment_method || "EFECTIVO",
                data.notes || null,
                data.created_by || null,
                data.created_at,
            ]
        );
        return data;
    }

    async findBySaleId(saleId: string): Promise<CreditPayments[]> {
        const result = await executeWithRetry(
            "SELECT * FROM credit_payments WHERE sale_id = ? ORDER BY created_at DESC",
            [saleId]
        );
        return result.rows as unknown as CreditPayments[];
    }

    async findById(id: string): Promise<CreditPayments | null> {
        const result = await executeWithRetry(
            "SELECT * FROM credit_payments WHERE id = ?",
            [id]
        );
        if (result.rows.length === 0) return null;
        return result.rows[0] as unknown as CreditPayments;
    }
}