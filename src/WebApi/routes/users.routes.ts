import express from "express";
import { container } from "tsyringe";
import { UsersController } from "../controllers/users.controller";

const router = express.Router();
const controller = container.resolve(UsersController);

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);
router.put("/:id/reset-password",controller.resetPassword);

export default router;
