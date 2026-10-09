export default interface Customers {
    id: string;
    name: string;
    ruc?: string;
    phone?: string;
    email?: string;
    address?: string;
    status: boolean;
    created_at: string;
}