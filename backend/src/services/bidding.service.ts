import { db } from "../db/store.js";
import { config } from "../config/index.js";
import { Bid, AuctionLot } from "../types/index.js";

export interface BidResult {
  success: boolean;
  message: string;
  bid?: Bid;
  auction?: AuctionLot;
  antiSnipingTriggered?: boolean;
  outbidUser?: { id: string; name: string };
  proxyCounterBid?: Bid;
}

export class BiddingService {
  static async placeBid(auctionId: string, bidderId: string, amount: number): Promise<BidResult> {
    const auction = await db.getAuctionById(auctionId);
    if (!auction) {
      return { success: false, message: "Auction lot not found" };
    }

    if (!auction.isLive || auction.status !== "live") {
      return { success: false, message: "Auction is not currently open for bidding" };
    }

    const nowTime = new Date().getTime();
    const endTime = new Date(auction.endTime).getTime();

    if (nowTime >= endTime) {
      await db.updateAuction(auctionId, { isLive: false, status: "ended" });
      return { success: false, message: "Auction has concluded" };
    }

    const minRequired = auction.currentBid + auction.minIncrement;
    if (amount < minRequired) {
      return {
        success: false,
        message: `Minimum acceptable bid is $${minRequired.toLocaleString()} (+$${auction.minIncrement.toLocaleString()} increment)`
      };
    }

    const bidder = await db.getUserById(bidderId);
    if (!bidder) {
      return { success: false, message: "Bidder profile not found" };
    }

    if (bidder.availableBiddingPower < amount) {
      return {
        success: false,
        message: `Insufficient bidding power ($${bidder.availableBiddingPower.toLocaleString()}). Deposit escrow funds to increase limit.`
      };
    }

    const previousLeadId = auction.winningBidderId;
    let outbidUser: { id: string; name: string } | undefined;
    if (previousLeadId && previousLeadId !== bidderId) {
      const prevBidder = await db.getUserById(previousLeadId);
      if (prevBidder) {
        outbidUser = { id: prevBidder.id, name: prevBidder.name };
      }
    }

    let antiSnipingTriggered = false;
    let newEndTime = auction.endTime;
    let extendedMinutes = auction.snipingExtendedMinutes;
    const windowMs = config.antiSniping.windowSeconds * 1000;

    if (endTime - nowTime <= windowMs) {
      antiSnipingTriggered = true;
      const extensionMs = config.antiSniping.extensionSeconds * 1000;
      newEndTime = new Date(endTime + extensionMs).toISOString();
      extendedMinutes += Math.round(config.antiSniping.extensionSeconds / 60);

      await db.addLog({
        userId: bidder.id,
        action: "ANTI_SNIPING_TRIGGERED",
        details: `Lot #${auction.lotNumber} extended by ${config.antiSniping.extensionSeconds}s due to last-minute bid`,
        severity: "warning"
      });
    }

    const newBid: Bid = {
      id: `bid-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      auctionId,
      bidderId: bidder.id,
      bidderName: bidder.name,
      bidderAvatar: bidder.avatar,
      amount,
      timestamp: new Date().toISOString(),
      isWinning: true
    };

    await db.addBid(newBid);

    const updatedAuction = await db.updateAuction(auctionId, {
      currentBid: amount,
      bidsCount: auction.bidsCount + 1,
      reserveMet: amount >= auction.reservePrice,
      winningBidderId: bidder.id,
      endTime: newEndTime,
      snipingExtendedMinutes: extendedMinutes
    });

    await db.addLog({
      userId: bidder.id,
      action: "BID_LOGGED",
      details: `${bidder.name} placed bid of $${amount.toLocaleString()} on Lot #${auction.lotNumber}`,
      severity: "info"
    });

    // Check proxy counter-bid
    let proxyCounterBid: Bid | undefined;
    const activeProxies = (await db.getProxyBids(auctionId)).filter((p) => p.userId !== bidder.id);
    const highestProxy = activeProxies.sort((a, b) => b.maxAmount - a.maxAmount)[0];

    if (highestProxy && highestProxy.maxAmount > amount) {
      const counterAmount = amount + (updatedAuction?.minIncrement || 2500);
      if (counterAmount <= highestProxy.maxAmount) {
        const proxyUser = await db.getUserById(highestProxy.userId);
        if (proxyUser) {
          proxyCounterBid = {
            id: `bid-proxy-${Date.now()}`,
            auctionId,
            bidderId: proxyUser.id,
            bidderName: proxyUser.name,
            bidderAvatar: proxyUser.avatar,
            amount: counterAmount,
            timestamp: new Date().toISOString(),
            isProxy: true,
            isWinning: true
          };

          await db.addBid(proxyCounterBid);
          await db.updateAuction(auctionId, {
            currentBid: counterAmount,
            bidsCount: (updatedAuction?.bidsCount || 0) + 1,
            winningBidderId: proxyUser.id,
            reserveMet: counterAmount >= (updatedAuction?.reservePrice || 0)
          });
        }
      }
    }

    return {
      success: true,
      message: `Bid of $${amount.toLocaleString()} accepted. You are the highest bidder!`,
      bid: newBid,
      auction: await db.getAuctionById(auctionId),
      antiSnipingTriggered,
      outbidUser,
      proxyCounterBid
    };
  }

  static async setProxyCeiling(auctionId: string, userId: string, maxAmount: number): Promise<boolean> {
    const auction = await db.getAuctionById(auctionId);
    if (!auction) return false;
    if (maxAmount <= auction.currentBid) return false;

    await db.setProxyBid({
      id: `proxy-${Date.now()}`,
      auctionId,
      userId,
      maxAmount,
      createdAt: new Date().toISOString(),
      isActive: true
    });

    return true;
  }
}
