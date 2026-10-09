export default interface Purchases {
    id: string;
    supplier_id: string;
    order_number: string;
    status: string;
    subtotal: number;
    tax: number;
    total: number;
    notes?: string;
    created_by?: string;
    created_at: string;
    received_at?: string;
    items?: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
    id: string;
    purchase_order_id: string;
    product_id: string;
    product_name?: string;
    quantity: number;
    unit_price: number;
    total: number;
}