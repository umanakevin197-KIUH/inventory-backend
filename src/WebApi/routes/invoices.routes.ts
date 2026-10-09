import { Router } from "express";
import { container } from "../container/dependencyContainer";
import { InvoicesController } from "../controllers/invoices.controller";

const router = Router();
const controller = container.resolve(InvoicesController);

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.post("/:id/cancel", controller.cancel);
router.delete("/:id", controller.delete);

export default router;