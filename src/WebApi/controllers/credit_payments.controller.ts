import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { ICreditPaymentsService } from "../../Application/interfaces/credit_payments.service.interface";

@injectable()
export class CreditPaymentsController {

    constructor(
        @inject("ICreditPaymentsService")
        private _creditPaymentsService: ICreditPaymentsService
    ) {}

    async registerPayment(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id || (req as any).userId;
            const data = {
                ...req.body,
                created_by: userId,
            };

            const payment = await this._creditPaymentsService.registerPayment(data);
            res.status(201).json(payment);
        } catch (error: any) {
            console.error("Error al registrar abono:", error);
            res.status(400).json({ error: error.message });
        }
    }

    async getPaymentsBySale(req: Request, res: Response) {
        try {
            // ✅ Forzar a string (Express 5 puede devolver string[])
            const saleId = String(req.params.saleId);
            const payments = await this._creditPaymentsService.getPaymentsBySale(saleId);
            res.json(payments);
        } catch (error: any) {
            console.error("Error al obtener abonos:", error);
            res.status(500).json({ error: error.message });
        }
    }
}