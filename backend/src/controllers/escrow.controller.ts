import { Request, Response } from "express";
import { EscrowService } from "../services/escrow.service.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export class EscrowController {
  static async getOrders(req: AuthenticatedRequest, res: Response): Promise<void> {
    const orders = await EscrowService.getOrders();
    res.json({ success: true, count: orders.length, orders });
  }

  static async getOrderById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const order = await EscrowService.getOrderById(id);
    if (!order) {
      res.status(404).json({ success: false, error: "Escrow order not found" });
      return;
    }
    res.json({ success: true, order });
  }

  static async releaseFunds(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = req.user?.id || "usr-escrow-1";
    const updated = await EscrowService.releaseFunds(id, userId);

    if (!updated) {
      res.status(404).json({ success: false, error: "Escrow order not found" });
      return;
    }

    res.json({
      success: true,
      message: `Escrow funds of $${updated.sellerPayout.toLocaleString()} disbursed to seller.`,
      order: updated
    });
  }

  static async openDispute(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user?.id || "usr-buyer-1";

    const updated = await EscrowService.openDispute(id, reason || "Physical condition discrepancy upon inspection", userId);
    if (!updated) {
      res.status(404).json({ success: false, error: "Escrow order not found" });
      return;
    }

    res.json({
      success: true,
      message: "Arbitration dispute registered. Funds frozen in vault.",
      order: updated
    });
  }
}
