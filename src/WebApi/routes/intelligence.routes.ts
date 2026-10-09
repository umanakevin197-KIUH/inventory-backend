import { Router } from "express";
import { container } from "../container/dependencyContainer";
import { IntelligenceController } from "../controllers/intelligence.controller";

const router = Router();
const controller = container.resolve(IntelligenceController);

router.get("/abc", controller.getABC);
router.get("/eoq", controller.getEOQ);
router.get("/profitability", controller.getProfitability);

export default router;