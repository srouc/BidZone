import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { PaymentService } from "../services/payment.service.js";
import { db } from "../db/store.js";

export class PaymentController {
  /**
   * Generates ABA Bakong KHQR for Escrow / Wallet Top-Up
   * POST /api/payments/aba/create-khqr
   */
  static async createAbaKhqr(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user?.id || req.body.userId || "usr-buyer-1";
    const amount = Number(req.body.amount);
    const currency = req.body.currency === "KHR" ? "KHR" : "USD";

    if (!amount || amount <= 0) {
      res.status(400).json({ success: false, error: "Valid deposit amount is required" });
      return;
    }

    try {
      const payment = await PaymentService.createAbaKhqr(userId, amount, currency);
      res.status(201).json({
        success: true,
        payment: {
          id: payment.id,
          reference: payment.reference,
          amount: payment.amount,
          currency: payment.currency,
          method: payment.method,
          status: payment.status,
          qrString: payment.qrString,
          qrImage: payment.qrImage,
          checkoutUrl: payment.checkoutUrl,
          merchantName: payment.metadata?.merchantName,
          expiresInSeconds: payment.metadata?.expiresInSeconds || 900
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || "Failed to generate ABA KHQR" });
    }
  }

  /**
   * Creates a Stripe Payment Intent
   * POST /api/payments/stripe/create-intent
   */
  static async createStripeIntent(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user?.id || req.body.userId || "usr-buyer-1";
    const amount = Number(req.body.amount);
    const currency = req.body.currency || "usd";

    if (!amount || amount <= 0) {
      res.status(400).json({ success: false, error: "Valid deposit amount is required" });
      return;
    }

    try {
      const payment = await PaymentService.createStripeIntent(userId, amount, currency);
      res.status(201).json({
        success: true,
        payment: {
          id: payment.id,
          reference: payment.reference,
          amount: payment.amount,
          currency: payment.currency,
          method: payment.method,
          status: payment.status,
          clientSecret: payment.clientSecret,
          checkoutUrl: payment.checkoutUrl
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || "Failed to create Stripe intent" });
    }
  }

  /**
   * Finalizes / Confirms Payment (called by client, script, or webhook)
   * POST /api/payments/confirm
   */
  static async confirmPayment(req: Request, res: Response): Promise<void> {
    const { reference, paymentId, metadata } = req.body;
    const ref = reference || paymentId;

    if (!ref) {
      res.status(400).json({ success: false, error: "Payment reference or id is required" });
      return;
    }

    try {
      const result = await PaymentService.confirmPayment(ref, metadata);
      if (!result.success) {
        res.status(404).json(result);
        return;
      }

      res.json({
        success: true,
        message: "Payment successfully confirmed and credited to wallet.",
        payment: result.payment
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || "Payment confirmation failed" });
    }
  }

  /**
   * Checks Status of a Payment
   * GET /api/payments/status/:reference
   */
  static async checkStatus(req: Request, res: Response): Promise<void> {
    const { reference } = req.params;
    if (!reference) {
      res.status(400).json({ success: false, error: "Reference parameter is required" });
      return;
    }

    try {
      const payment = await PaymentService.getPaymentStatus(reference);
      if (!payment) {
        res.status(404).json({ success: false, error: "Payment record not found" });
        return;
      }

      res.json({
        success: true,
        payment: {
          id: payment.id,
          reference: payment.reference,
          amount: payment.amount,
          currency: payment.currency,
          method: payment.method,
          status: payment.status,
          createdAt: payment.createdAt,
          completedAt: payment.completedAt
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Webhook listener for ABA PayWay / Bakong
   * POST /api/payments/aba/webhook
   */
  static async abaWebhook(req: Request, res: Response): Promise<void> {
    const { tran_id, status, hash } = req.body;
    console.log(`🔔 [ABA PayWay Webhook Received] TranID: ${tran_id}, Status: ${status}`);

    if (tran_id) {
      await PaymentService.confirmPayment(tran_id, {
        webhookReceivedAt: new Date().toISOString(),
        rawStatus: status,
      });
    }

    res.json({ response_code: "00", message: "Transaction received and processed" });
  }

  /**
   * Webhook listener for Stripe
   * POST /api/payments/stripe/webhook
   */
  static async stripeWebhook(req: Request, res: Response): Promise<void> {
    const event = req.body;
    console.log(`🔔 [Stripe Webhook Received] Event Type: ${event.type}`);

    if (event.type === "payment_intent.succeeded" && event.data?.object) {
      const pi = event.data.object;
      const ref = pi.metadata?.reference || pi.id;
      await PaymentService.confirmPayment(ref, {
        stripePaymentIntentId: pi.id,
      });
    }

    res.json({ received: true });
  }

  /**
   * Get Current User's Payment History
   * GET /api/payments/history
   */
  static async getHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user?.id || (req.query.userId as string) || "usr-buyer-1";

    try {
      const history = await db.getPaymentsByUser(userId);
      res.json({
        success: true,
        count: history.length,
        payments: history
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
