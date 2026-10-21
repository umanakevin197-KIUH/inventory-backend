export interface SaleItemDto {
    product_id: string;
    product_name?: string;
    quantity: number;
    unit_price: number;
    original_price?: number;    
    discount?: number; 
}

export interface SalesDto {
    customer_id?: string;
    customer_name_optional?: string;
    payment_method: string;
    payment_status?: string;
    sale_type?: string;
    due_date?: string;
    next_payment_date?: string;
    notification_days_before?: number;
    status?: string;
    created_by?: string;
    items: SaleItemDto[];
}