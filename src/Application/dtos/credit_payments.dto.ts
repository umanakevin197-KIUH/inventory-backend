export interface CreditPaymentsDto {
    sale_id: string;
    amount: number;
    payment_method?: string;
    notes?: string;
    created_by?: string;
}