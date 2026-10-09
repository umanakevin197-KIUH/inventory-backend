import { Router } from "express";
import { container } from "../container/dependencyContainer";
import { EmployeesController } from "../controllers/employees.controller";

const router = Router();
const controller = container.resolve(EmployeesController);

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;