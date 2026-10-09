import express from "express";
import { container } from "tsyringe";
import { Product_variantsController } from "../controllers/product_variants.controller";

const router = express.Router();
const controller = container.resolve(Product_variantsController);

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
