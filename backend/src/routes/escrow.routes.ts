import { Router } from "express";
import { EscrowController } from "../controllers/escrow.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/orders", authenticate, EscrowController.getOrders);
router.get("/orders/:id", authenticate, EscrowController.getOrderById);
router.post("/orders/:id/release", authenticate, EscrowController.releaseFunds);
router.post("/orders/:id/dispute", authenticate, EscrowController.openDispute);

export default router;

