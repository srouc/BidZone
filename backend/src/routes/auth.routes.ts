import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/send-otp", AuthController.sendOtp);
router.post("/verify-otp", AuthController.verifyOtp);
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/2fa/toggle", authenticate, AuthController.toggle2FA);
router.get("/fast-pass/:role", AuthController.fastPass);
router.get("/me", authenticate, AuthController.getMe);

export default router;

