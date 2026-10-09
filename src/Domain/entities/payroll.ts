export default interface Payroll {
    id: string;
    employee_id: string;
    period: string;
    base_salary: number;
    bonuses: number;
    bonus_description?: string;
    deductions: number;
    deduction_description?: string;
    net_salary: number;
    payment_method: string;
    status: string;
    paid_at?: string;
    created_by?: string;
    created_at: string;
    employee_name?: string;
    employee_position?: string;
}