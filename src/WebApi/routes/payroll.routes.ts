import { Router } from "express";
import { container } from "../container/dependencyContainer";
import { PayrollController } from "../controllers/payroll.controller";

const router = Router();
const controller = container.resolve(PayrollController);

router.get("/", controller.getAll);
router.get("/employee/:employeeId", controller.getByEmployeeId);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.delete("/:id", controller.delete);

export default router;