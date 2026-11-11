import { Request, Response } from "express";
import { db } from "../db/store.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export class AdminController {
  static async getMetrics(req: Request, res: Response): Promise<void> {
    const auctions = await db.getAuctions();
    const users = await db.getUsers();
    const escrowOrders = await db.getEscrowOrders();

    const totalGMV = auctions.reduce((acc, curr) => acc + curr.currentBid, 0);
    const platformFees = Math.round(totalGMV * 0.05);
    const liveCount = auctions.filter((a) => a.isLive && a.status === "live").length;
    const totalVault = escrowOrders.reduce((acc, curr) => acc + curr.totalHeld, 0);

    res.json({
      success: true,
      metrics: {
        totalGMV,
        platformFees,
        totalAuctions: auctions.length,
        liveAuctions: liveCount,
        totalUsers: users.length,
        verifiedBidders: users.filter((u) => u.kycStatus === "verified").length,
        escrowVaultBalance: totalVault,
        escrowContractsCount: escrowOrders.length
      }
    });
  }

  static async approveLot(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const updated = await db.updateAuction(id, {
      status: "live",
      isLive: true
    });

    if (!updated) {
      res.status(404).json({ success: false, error: "Auction not found" });
      return;
    }

    await db.addLog({
      userId: req.user?.id,
      action: "ADMIN_LOT_APPROVED",
      details: `Lot #${updated.lotNumber} (${updated.title}) approved for live bidding`,
      severity: "info"
    });

    res.json({ success: true, message: "Lot approved and set live.", auction: updated });
  }

  static async verifyKYC(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { userId, status } = req.body;
    const target = await db.getUserById(userId);

    if (!target) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    const updated = await db.updateUser(userId, {
      kycStatus: status || "verified",
      verifiedAt: new Date().toISOString()
    });

    res.json({ success: true, message: `KYC status for ${target.name} updated to ${status || "verified"}`, user: updated });
  }

  static async getActivityLogs(req: Request, res: Response): Promise<void> {
    const logs = await db.getLogs(100);
    res.json({ success: true, count: logs.length, logs });
  }
}
