import { Router } from "express";
import { container } from "../container/dependencyContainer";
import { SalesController } from "../controllers/sales.controller";

const router = Router();
const controller = container.resolve(SalesController);

// ✅ Rutas específicas primero
router.get("/pending-credits", controller.getPendingCredits);
router.get("/overdue-credits", controller.getOverdueCredits);
router.get("/pending", (req, res) => controller.getPendingSales(req, res));

// Rutas generales
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.post("/:id/pay", controller.registerPayment);
router.delete("/:id", controller.delete);
router.post("/:id/cancel-reservation", (req, res) => controller.cancelReservation(req, res));
router.put("/:id/payment-date", (req, res) => controller.updatePaymentDate(req, res));

export default router;