import { Router } from "express";
import { BidController } from "../controllers/bid.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authenticate, BidController.placeBid);
router.get("/auction/:id", BidController.getBids);
router.post("/proxy", authenticate, BidController.setProxyBid);
router.post("/simulate", BidController.simulateCompetitor);

export default router;

