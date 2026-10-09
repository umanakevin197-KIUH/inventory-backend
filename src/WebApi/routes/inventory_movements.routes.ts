import express from "express";
import { container } from "tsyringe";
import { inventory_movementsController } from "../controllers/inventory_movements.controller";

const router = express.Router();
const controller = container.resolve(inventory_movementsController);

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
/*router.put("/:id", controller.update);*/
router.delete("/:id", controller.delete);

export default router;
