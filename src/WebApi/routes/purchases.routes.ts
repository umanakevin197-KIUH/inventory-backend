import { Router } from "express";
import { container } from "../container/dependencyContainer";
import { PurchasesController } from "../controllers/purchases.controller";

const router = Router();
const controller = container.resolve(PurchasesController);

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.post("/:id/receive", controller.receive);
router.delete("/:id", controller.delete);

export default router;