import { Router } from "express";
import { container } from "../container/dependencyContainer";
import { CustomersController } from "../controllers/customers.controller";

const router = Router();
const controller = container.resolve(CustomersController);

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;