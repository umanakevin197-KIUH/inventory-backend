export default interface CreditPayments {
    id: string;
    sale_id: string;
    amount: number;
    payment_method: string;
    notes?: string;
    created_by?: string;
    created_at: string;
}