import CreditPayments from "../entities/credit_payments";

export interface ICreditPaymentsRepository {
    create(data: CreditPayments): Promise<CreditPayments>;
    findBySaleId(saleId: string): Promise<CreditPayments[]>;
    findById(id: string): Promise<CreditPayments | null>;
}