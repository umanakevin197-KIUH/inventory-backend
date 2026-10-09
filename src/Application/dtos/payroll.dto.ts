export interface PayrollDto {
    employee_id: string;
    period: string;
    base_salary: number;
    bonuses?: number;
    bonus_description?: string;
    deductions?: number;
    deduction_description?: string;
    payment_method?: string;
    status?: string;
    created_by?: string;
}