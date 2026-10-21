export default interface Sales {
    id: string;
    sale_number: string;
    customer_id?: string;
    customer_name_optional?: string;
    subtotal: number;
    tax: number;
    total: number;
    total_paid?: number;
    balance_due?: number;
    payment_method: string;
    payment_status: string;
    sale_type?: string;
    delivery_status?: string;
    due_date?: string;
    next_payment_date?: string;
    notification_days_before?: number;
    reservation_expires_at?: string;
    paid_at?: string;
    status: string;
    created_by?: string;
    created_at: string;
    items?: SaleItem[];
}

export interface SaleItem {
    id: string;
    sale_id: string;
    product_id: string;
    product_name?: string;
    quantity: number;
    unit_price: number;
    original_price?: number;    
    discount?: number; 
    total: number;
}