export default interface Suppliers {
    id: string;
    name: string;
    ruc?: string;
    phone?: string;
    email?: string;
    address?: string;
    contact_name?: string;
    rating?: number;
    payment_terms?: string;
    notes?: string;
    status: boolean;
    created_at: string;
    updated_at?: string;
}