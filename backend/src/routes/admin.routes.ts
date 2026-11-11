import { Router } from "express";
import { AdminController } from "../controllers/admin.controller.js";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/metrics", AdminController.getMetrics);
router.post("/auctions/:id/approve", authenticate, requireRole(["ADMIN"]), AdminController.approveLot);
router.post("/users/verify-kyc", authenticate, requireRole(["ADMIN"]), AdminController.verifyKYC);
router.get("/logs", authenticate, requireRole(["ADMIN"]), AdminController.getActivityLogs);

export default router;

