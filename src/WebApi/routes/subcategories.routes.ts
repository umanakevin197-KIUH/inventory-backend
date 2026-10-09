import express from "express";
import { container } from "tsyringe";
import { SubcategoriesController } from "../controllers/subcategories.controller";

const router = express.Router();
const controller = container.resolve(SubcategoriesController);

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/by-category/:id", controller.getByCategory);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
