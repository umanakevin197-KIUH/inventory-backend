export interface SaleItemDto {
    product_id: string;
    product_name?: string;
    quantity: number;
    unit_price: number;
}

export interface SalesDto {
    customer_id?: string;
    payment_method: string;
    payment_status?: string;    
    due_date?: string;  
    status?: string;
    created_by?: string;
    items: SaleItemDto[];
}