import { Request, Response } from "express";
import { BiddingService } from "../services/bidding.service.js";
import { db } from "../db/store.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export class BidController {
  static async placeBid(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { auctionId, amount } = req.body;
    const bidderId = req.user?.id || req.body.bidderId || "usr-buyer-1";

    if (!auctionId || !amount) {
      res.status(400).json({ success: false, error: "auctionId and amount are required" });
      return;
    }

    const result = await BiddingService.placeBid(auctionId, bidderId, Number(amount));

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.json(result);
  }

  static async getBids(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const bids = await db.getBidsByAuction(id);
    res.json({ success: true, count: bids.length, bids });
  }

  static async setProxyBid(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { auctionId, maxAmount } = req.body;
    const userId = req.user?.id || req.body.userId || "usr-buyer-1";

    if (!auctionId || !maxAmount) {
      res.status(400).json({ success: false, error: "auctionId and maxAmount are required" });
      return;
    }

    const success = await BiddingService.setProxyCeiling(auctionId, userId, Number(maxAmount));
    if (!success) {
      res.status(400).json({ success: false, error: "Failed to configure proxy bid. Ceiling must exceed current high bid." });
      return;
    }

    res.json({ success: true, message: `Auto proxy ceiling of $${Number(maxAmount).toLocaleString()} configured successfully.` });
  }

  static async simulateCompetitor(req: Request, res: Response): Promise<void> {
    const { auctionId } = req.body;
    const auction = await db.getAuctionById(auctionId);

    if (!auction) {
      res.status(404).json({ success: false, error: "Auction not found" });
      return;
    }

    const competitorNames = ["MonacoVault_88", "AlpineCollector", "GenevaSyndicate", "KyotoHeritage"];
    const randomName = competitorNames[Math.floor(Math.random() * competitorNames.length)];
    const counterAmount = auction.currentBid + auction.minIncrement;

    const competitorBid = {
      id: `bid-comp-${Date.now()}`,
      auctionId,
      bidderId: `usr-comp-${Date.now()}`,
      bidderName: randomName,
      amount: counterAmount,
      timestamp: new Date().toISOString(),
      isWinning: true
    };

    await db.addBid(competitorBid);
    await db.updateAuction(auctionId, {
      currentBid: counterAmount,
      bidsCount: auction.bidsCount + 1,
      reserveMet: counterAmount >= auction.reservePrice
    });

    res.json({
      success: true,
      message: `${randomName} placed counter-bid of $${counterAmount.toLocaleString()}`,
      bid: competitorBid,
      auction: await db.getAuctionById(auctionId)
    });
  }
}
