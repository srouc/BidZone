import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// ABA Pay / Bakong KHQR
router.post("/aba/create-khqr", PaymentController.createAbaKhqr);
router.post("/aba/webhook", PaymentController.abaWebhook);

// Stripe Card / Intent
router.post("/stripe/create-intent", PaymentController.createStripeIntent);
router.post("/stripe/webhook", PaymentController.stripeWebhook);

// Status, Confirmation & History
router.get("/status/:reference", PaymentController.checkStatus);
router.post("/confirm", PaymentController.confirmPayment);
router.get("/history", PaymentController.getHistory);

export default router;
