export default interface Invoices {
    id: string;
    invoice_number: string;
    sale_id: string;
    customer_id?: string;
    type: string;
    subtotal: number;
    tax: number;
    total: number;
    status: string;
    notes?: string;
    created_by?: string;
    created_at: string;
}