import CreditPayments from "../../Domain/entities/credit_payments";
import { CreditPaymentsDto } from "../dtos/credit_payments.dto";

export interface ICreditPaymentsService {
    registerPayment(data: CreditPaymentsDto): Promise<CreditPayments>;
    getPaymentsBySale(saleId: string): Promise<CreditPayments[]>;
}