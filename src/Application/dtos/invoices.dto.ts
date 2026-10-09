export interface InvoicesDto {
    sale_id: string;
    customer_id?: string;
    type?: string;
    subtotal?: number;
    tax?: number;
    total?: number;
    status?: string;
    notes?: string;
    created_by?: string;
}