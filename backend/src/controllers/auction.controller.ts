import { Request, Response } from "express";
import { AuctionService } from "../services/auction.service.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export class AuctionController {
  static async getAuctions(req: Request, res: Response): Promise<void> {
    const { category, status, q, minPrice, maxPrice, sortBy } = req.query;

    const auctions = await AuctionService.getAuctions({
      category: category as string,
      status: status as string,
      query: q as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sortBy: sortBy as any
    });

    res.json({
      success: true,
      count: auctions.length,
      auctions
    });
  }

  static async getAuctionById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const auction = await AuctionService.getAuctionById(id);

    if (!auction) {
      res.status(404).json({ success: false, error: "Auction lot not found" });
      return;
    }

    res.json({ success: true, auction });
  }

  static async createAuction(req: AuthenticatedRequest, res: Response): Promise<void> {
    const sellerId = req.user?.id || req.body.sellerId || "usr-seller-1";
    const newLot = await AuctionService.createConsignment(req.body, sellerId);
    res.status(201).json({ success: true, auction: newLot });
  }
}
