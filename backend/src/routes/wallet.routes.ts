import { Router } from "express";
import { WalletController } from "../controllers/wallet.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/balance", authenticate, WalletController.getBalance);
router.post("/deposit", authenticate, WalletController.deposit);

export default router;

