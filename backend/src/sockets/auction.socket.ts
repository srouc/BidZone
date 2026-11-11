import { Server, Socket } from "socket.io";
import { BiddingService } from "../services/bidding.service.js";
import { db } from "../db/store.js";

export const registerAuctionSocketHandlers = (io: Server): void => {
  io.on("connection", (socket: Socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    socket.on("join_auction", (auctionId: string) => {
      socket.join(`auction:${auctionId}`);
      socket.emit("joined_auction", { auctionId, timestamp: new Date().toISOString() });
    });

    socket.on("leave_auction", (auctionId: string) => {
      socket.leave(`auction:${auctionId}`);
    });

    socket.on("place_bid", async ({ auctionId, bidderId, amount }: { auctionId: string; bidderId: string; amount: number }) => {
      const result = await BiddingService.placeBid(auctionId, bidderId, amount);

      if (!result.success) {
        socket.emit("bid_error", { message: result.message });
        return;
      }

      io.to(`auction:${auctionId}`).emit("bid_updated", {
        auctionId,
        bid: result.bid,
        auction: result.auction,
        antiSnipingTriggered: result.antiSnipingTriggered
      });

      if (result.antiSnipingTriggered && result.auction) {
        io.to(`auction:${auctionId}`).emit("auction_extended", {
          auctionId,
          newEndTime: result.auction.endTime,
          extendedMinutes: result.auction.snipingExtendedMinutes,
          message: "Anti-sniping protocol active: Clock extended by +120s!"
        });
      }

      if (result.outbidUser) {
        io.emit("outbid_alert", {
          auctionId,
          outbidUserId: result.outbidUser.id,
          newLeadAmount: amount,
          message: `You were outbid on Lot #${result.auction?.lotNumber} by a new lead bid of $${amount.toLocaleString()}`
        });
      }

      if (result.proxyCounterBid) {
        setTimeout(async () => {
          io.to(`auction:${auctionId}`).emit("bid_updated", {
            auctionId,
            bid: result.proxyCounterBid,
            auction: await db.getAuctionById(auctionId),
            isProxyCounter: true
          });
        }, 1000);
      }
    });

    socket.on("simulate_counter_bid", async ({ auctionId }: { auctionId: string }) => {
      const auction = await db.getAuctionById(auctionId);
      if (!auction || !auction.isLive) return;

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
      const updated = await db.updateAuction(auctionId, {
        currentBid: counterAmount,
        bidsCount: auction.bidsCount + 1,
        reserveMet: counterAmount >= auction.reservePrice
      });

      io.to(`auction:${auctionId}`).emit("bid_updated", {
        auctionId,
        bid: competitorBid,
        auction: updated
      });
    });

    socket.on("disconnect", () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });
};
