export interface PurchaseOrderItemDto {
    product_id: string;
    product_name?: string;
    quantity: number;
    unit_price: number;
    total?: number;
}

export interface PurchasesDto {
    supplier_id: string;
    order_number?: string;
    status?: string;
    notes?: string;
    created_by?: string;
    items: PurchaseOrderItemDto[];
}