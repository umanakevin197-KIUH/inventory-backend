import { Router } from "express";
import { container } from "tsyringe";
import { CreditPaymentsController } from "../controllers/credit_payments.controller";

const router = Router();
const controller = container.resolve(CreditPaymentsController);

// Registrar un abono
router.post("/", (req, res) => controller.registerPayment(req, res));

// Ver abonos de una venta
router.get("/sale/:saleId", (req, res) => controller.getPaymentsBySale(req, res));

export default router;