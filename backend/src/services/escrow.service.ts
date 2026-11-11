import { db } from "../db/store.js";
import { EscrowOrder } from "../types/index.js";

export class EscrowService {
  static async getOrders(): Promise<EscrowOrder[]> {
    return db.getEscrowOrders();
  }

  static async getOrderById(id: string): Promise<EscrowOrder | undefined> {
    return db.getEscrowOrderById(id);
  }

  static async releaseFunds(orderId: string, authorizedByUserId: string): Promise<EscrowOrder | undefined> {
    const order = await db.getEscrowOrderById(orderId);
    if (!order) return undefined;

    const seller = await db.getUserById(order.sellerId);
    if (seller) {
      await db.updateUser(seller.id, {
        walletBalance: seller.walletBalance + order.sellerPayout,
        totalSold: seller.totalSold + order.hammerPrice
      });
    }

    const updated = await db.updateEscrowOrder(orderId, {
      milestone: "FUNDS_DISBURSED"
    });

    await db.addLog({
      userId: authorizedByUserId,
      action: "ESCROW_FUNDS_DISBURSED",
      details: `Escrow Order #${order.orderNumber} disbursed $${order.sellerPayout.toLocaleString()} to ${order.sellerName}`,
      severity: "info"
    });

    return updated;
  }

  static async openDispute(orderId: string, reason: string, userId: string): Promise<EscrowOrder | undefined> {
    const updated = await db.updateEscrowOrder(orderId, {
      milestone: "DISPUTED",
      disputeReason: reason
    });

    await db.addLog({
      userId,
      action: "ESCROW_DISPUTE_OPENED",
      details: `Dispute opened on Order #${orderId}: ${reason}`,
      severity: "alert"
    });

    return updated;
  }
}
