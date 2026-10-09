export default interface Sales {
    id: string;
    sale_number: string;
    customer_id?: string;
    subtotal: number;
    tax: number;
    total: number;
    payment_method: string;
    payment_status: string;     
    due_date?: string;          
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
    total: number;
}