import { Router } from "express";
import { AuctionController } from "../controllers/auction.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", AuctionController.getAuctions);
router.get("/:id", AuctionController.getAuctionById);
router.post("/", authenticate, AuctionController.createAuction);

export default router;

