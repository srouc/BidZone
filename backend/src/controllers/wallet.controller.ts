import { Response } from "express";
import { db } from "../db/store.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export class WalletController {
  static async getBalance(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user?.id || (req.query.userId as string) || "usr-buyer-1";
    const user = await db.getUserById(userId);

    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    res.json({
      success: true,
      wallet: {
        balance: user.walletBalance,
        heldInBids: user.heldInBids,
        availableBiddingPower: user.availableBiddingPower
      }
    });
  }

  static async deposit(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user?.id || req.body.userId || "usr-buyer-1";
    const { amount, method } = req.body;

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      res.status(400).json({ success: false, error: "Valid deposit amount is required" });
      return;
    }

    const user = await db.getUserById(userId);
    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    const updatedBalance = user.walletBalance + numericAmount;
    const updatedPower = user.availableBiddingPower + (numericAmount * 3);

    const updatedUser = await db.updateUser(userId, {
      walletBalance: updatedBalance,
      availableBiddingPower: updatedPower
    });

    await db.addLog({
      userId,
      action: "WALLET_DEPOSIT",
      details: `$${numericAmount.toLocaleString()} credited via ${method || "Fedwire"}. Bidding power updated to $${updatedPower.toLocaleString()}`,
      severity: "info"
    });

    res.json({
      success: true,
      message: `Deposit of $${numericAmount.toLocaleString()} credited successfully.`,
      wallet: {
        balance: updatedUser?.walletBalance,
        heldInBids: updatedUser?.heldInBids,
        availableBiddingPower: updatedUser?.availableBiddingPower
      }
    });
  }
}
