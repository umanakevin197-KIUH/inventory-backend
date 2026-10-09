import express from "express";
import { container } from "tsyringe";
import { AuthController } from "../controllers/auth.controller";

const router = express.Router();

const controller = container.resolve(AuthController);

router.post("/login", controller.login);
router.post(
  "/register",
  controller.register.bind(controller)
);

export default router;