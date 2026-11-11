"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AuctionLot, BidHistoryItem } from "@/types/auction";
import { UserProfile, UserRole } from "@/types/user";
import { EscrowTransaction } from "@/types/escrow";
import { initialAuctions, initialBidHistories, initialEscrowOrders, initialUsers } from "./mock-data";
import { api } from "@/services/api";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "info" | "outbid";
  timestamp: string;
  read: boolean;
  link?: string;
}

interface AuctionContextType {
  auctions: AuctionLot[];
  currentUser: UserProfile;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  watchlist: string[];
  toggleWatchlist: (auctionId: string) => void;
  isWatchlisted: (auctionId: string) => boolean;
  bidHistories: Record<string, BidHistoryItem[]>;
  escrowOrders: EscrowTransaction[];
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  backendConnected: boolean;

  // Actions
  placeBid: (auctionId: string, amount: number) => { success: boolean; message: string };
  simulateOpponentBid: (auctionId: string) => void;
  createAuction: (newLot: Partial<AuctionLot>) => AuctionLot;
  approveAuction: (auctionId: string) => void;
  releaseEscrow: (orderId: string) => void;
  depositFunds: (amount: number) => void;
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

const STORAGE_KEY_AUCTIONS = "bidzone_auctions_v1";
const STORAGE_KEY_WATCHLIST = "bidzone_watchlist_v1";
const STORAGE_KEY_ROLE = "bidzone_active_role_v1";

export const AuctionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auctions, setAuctions] = useState<AuctionLot[]>(initialAuctions);
  const [currentRole, setCurrentRole] = useState<UserRole>("BUYER");
  const [watchlist, setWatchlist] = useState<string[]>(["auc-1", "auc-2"]);
  const [bidHistories, setBidHistories] = useState<Record<string, BidHistoryItem[]>>(initialBidHistories);
  const [escrowOrders, setEscrowOrders] = useState<EscrowTransaction[]>(initialEscrowOrders);
  const [backendConnected, setBackendConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      title: "Live Bidding Active",
      message: "1967 Shelby GT500 Fastback lot is entering final 2 hours.",
      type: "info",
      timestamp: "5 mins ago",
      read: false,
      link: "/auctions/auc-1",
    },
    {
      id: "notif-2",
      title: "Inspection Window Open",
      message: "Apple-1 Motherboard delivered. 5 days remaining in inspection window.",
      type: "success",
      timestamp: "2 hours ago",
      read: false,
      link: "/buyer/orders",
    }
  ]);

  const currentUser: UserProfile =
    currentRole === "BUYER" ? initialUsers.buyer :
    currentRole === "SELLER" ? initialUsers.seller :
    currentRole === "ESCROW_OFFICER" ? initialUsers.escrow :
    initialUsers.admin;

  // Sync with MySQL-backed API if running, fallback to localStorage
  useEffect(() => {
    let mounted = true;

    const syncFromBackend = async () => {
      const res = await api.getAuctions();
      if (res?.success && Array.isArray(res.auctions) && res.auctions.length > 0 && mounted) {
        setBackendConnected(true);
        setAuctions(res.auctions);

        // Fetch bids for loaded auctions
        const bidMap: Record<string, BidHistoryItem[]> = {};
        await Promise.all(
          res.auctions.map(async (lot: AuctionLot) => {
            const bRes = await api.getAuctionBids(lot.id);
            if (bRes?.success && Array.isArray(bRes.bids)) {
              bidMap[lot.id] = bRes.bids;
            }
          })
        );
        if (mounted && Object.keys(bidMap).length > 0) {
          setBidHistories((prev) => ({ ...prev, ...bidMap }));
        }

        // Fetch escrow orders
        const escRes = await api.getEscrowOrders("usr-buyer-1");
        if (escRes?.success && Array.isArray(escRes.orders) && mounted) {
          setEscrowOrders(escRes.orders);
        }
        return;
      }

      // Offline / local fallback
      try {
        const savedAuctions = localStorage.getItem(STORAGE_KEY_AUCTIONS);
        if (savedAuctions) setAuctions(JSON.parse(savedAuctions));
      } catch {
        // ignore
      }
    };

    syncFromBackend();

    try {
      const savedWatch = localStorage.getItem(STORAGE_KEY_WATCHLIST);
      if (savedWatch) setWatchlist(JSON.parse(savedWatch));
      const savedRole = localStorage.getItem(STORAGE_KEY_ROLE) as UserRole | null;
      if (savedRole && ["BUYER", "SELLER", "ESCROW_OFFICER", "ADMIN"].includes(savedRole)) {
        setCurrentRole(savedRole);
      }
    } catch {
      // ignore
    }

    return () => {
      mounted = false;
    };
  }, []);

  const saveAuctions = (updated: AuctionLot[]) => {
    setAuctions(updated);
    try {
      localStorage.setItem(STORAGE_KEY_AUCTIONS, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    try {
      localStorage.setItem(STORAGE_KEY_ROLE, role);
    } catch {
      // ignore
    }
  };

  const toggleWatchlist = (auctionId: string) => {
    setWatchlist((prev) => {
      const next = prev.includes(auctionId)
        ? prev.filter((id) => id !== auctionId)
        : [...prev, auctionId];
      try {
        localStorage.setItem(STORAGE_KEY_WATCHLIST, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const isWatchlisted = (auctionId: string) => watchlist.includes(auctionId);

  const placeBid = (auctionId: string, amount: number): { success: boolean; message: string } => {
    const lot = auctions.find((a) => a.id === auctionId);
    if (!lot) return { success: false, message: "Auction lot not found" };

    const minAllowed = lot.currentBid + lot.minIncrement;
    if (amount < minAllowed) {
      return {
        success: false,
        message: `Minimum required bid is $${minAllowed.toLocaleString()} (+$${lot.minIncrement.toLocaleString()} increment)`
      };
    }

    // Sync to MySQL backend asynchronously
    api.placeBid(auctionId, amount, currentUser.id).then((res) => {
      if (res?.success && res.auction) {
        setAuctions((prev) => prev.map((a) => (a.id === auctionId ? res.auction : a)));
      }
    });

    let extendedMinutes = lot.snipingExtendedMinutes;
    let antiSniped = false;
    const nowTime = new Date().getTime();
    const endTime = new Date(lot.endTime).getTime();
    if (endTime - nowTime < 3 * 60 * 1000 && endTime > nowTime) {
      extendedMinutes += 2;
      antiSniped = true;
    }

    const newHistoryItem: BidHistoryItem = {
      id: `bid-${Date.now()}`,
      auctionId,
      bidderId: currentUser.id,
      bidderName: currentUser.name,
      bidderAvatar: currentUser.avatar,
      amount,
      timestamp: "Just now",
      isWinning: true,
    };

    setBidHistories((prev) => {
      const existing = (prev[auctionId] || []).map((b) => ({ ...b, isWinning: false }));
      return {
        ...prev,
        [auctionId]: [newHistoryItem, ...existing],
      };
    });

    const updatedAuctions = auctions.map((a) => {
      if (a.id === auctionId) {
        return {
          ...a,
          currentBid: amount,
          bidsCount: a.bidsCount + 1,
          reserveMet: amount >= a.reservePrice,
          snipingExtendedMinutes: extendedMinutes,
          endTime: antiSniped ? new Date(endTime + 2 * 60 * 1000).toISOString() : a.endTime,
        };
      }
      return a;
    });

    saveAuctions(updatedAuctions);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Bid Confirmed!",
        message: `You are currently the highest bidder on Lot #${lot.lotNumber} at $${amount.toLocaleString()}.${antiSniped ? " Anti-sniping rule extended timer by 2 minutes!" : ""}`,
        type: "success",
        timestamp: "Just now",
        read: false,
        link: `/auctions/${lot.id}`,
      },
      ...prev,
    ]);

    return {
      success: true,
      message: `Your bid of $${amount.toLocaleString()} was placed successfully! You are highest bidder.`
    };
  };

  const simulateOpponentBid = (auctionId: string) => {
    const lot = auctions.find((a) => a.id === auctionId);
    if (!lot) return;

    api.simulateCompetitorBid(auctionId);

    const opponentBid = lot.currentBid + lot.minIncrement;
    const opponentNames = ["Collector_Monaco_7", "VaultHoldingsZurich", "AlpineSyndicate", "SothebyCollector"];
    const randomName = opponentNames[Math.floor(Math.random() * opponentNames.length)];

    const opponentItem: BidHistoryItem = {
      id: `bid-opp-${Date.now()}`,
      auctionId,
      bidderId: `usr-opp-${Date.now()}`,
      bidderName: randomName,
      amount: opponentBid,
      timestamp: "Just now",
      isWinning: true,
    };

    setBidHistories((prev) => {
      const existing = (prev[auctionId] || []).map((b) => ({ ...b, isWinning: false }));
      return {
        ...prev,
        [auctionId]: [opponentItem, ...existing],
      };
    });

    const updatedAuctions = auctions.map((a) => {
      if (a.id === auctionId) {
        return {
          ...a,
          currentBid: opponentBid,
          bidsCount: a.bidsCount + 1,
          reserveMet: opponentBid >= a.reservePrice,
        };
      }
      return a;
    });

    saveAuctions(updatedAuctions);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "OUTBID ALERT! 🚨",
        message: `${randomName} just placed a higher bid of $${opponentBid.toLocaleString()} on ${lot.title}. Counter-bid to regain lead!`,
        type: "outbid",
        timestamp: "Just now",
        read: false,
        link: `/auctions/${lot.id}`,
      },
      ...prev,
    ]);
  };

  const createAuction = (newLot: Partial<AuctionLot>): AuctionLot => {
    const lotNumber = 200 + auctions.length + 1;
    const created: AuctionLot = {
      id: `auc-${Date.now()}`,
      lotNumber,
      title: newLot.title || "Untitled Consignment Lot",
      slug: (newLot.title || "lot").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category: newLot.category || "Vehicles",
      subcategory: newLot.subcategory || "Curated",
      description: newLot.description || "No description provided.",
      condition: newLot.condition || "Brand New / Mint",
      provenance: newLot.provenance || "Consignor Certificate of Authenticity provided.",
      startingBid: newLot.startingBid || 10000,
      currentBid: newLot.startingBid || 10000,
      reservePrice: newLot.reservePrice || (newLot.startingBid ? newLot.startingBid * 1.2 : 12000),
      reserveMet: false,
      minIncrement: newLot.minIncrement || 1000,
      estimatedLow: newLot.estimatedLow || (newLot.startingBid || 10000),
      estimatedHigh: newLot.estimatedHigh || ((newLot.startingBid || 10000) * 1.5),
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "live",
      isLive: true,
      snipingExtendedMinutes: 0,
      bidsCount: 0,
      watchersCount: 1,
      viewsCount: 12,
      featuredImage: newLot.featuredImage || "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1200&q=80",
      images: newLot.images && newLot.images.length > 0
        ? newLot.images
        : ["https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1200&q=80"],
      specifications: newLot.specifications || { "Verification": "Authenticated by BidZone Specialist" },
      seller: {
        id: currentUser.id,
        name: currentUser.name,
        rating: 4.95,
        verified: true,
        salesCount: 1,
        avatar: currentUser.avatar,
      },
      escrowProtected: true,
      inspectionPeriodDays: newLot.inspectionPeriodDays || 5,
      shippingOrigin: newLot.shippingOrigin || "New York, USA",
      deliveryMethod: newLot.deliveryMethod || "Insured White-Glove Escrow Carrier",
      buyerPremiumPercent: 7.5,
      createdAt: new Date().toISOString(),
    };

    // Persist to MySQL backend
    api.createAuction(created, currentUser.id);

    const nextAuctions = [created, ...auctions];
    saveAuctions(nextAuctions);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Listing Published!",
        message: `Your consignment lot "${created.title}" is now live and accepting competitive bids.`,
        type: "success",
        timestamp: "Just now",
        read: false,
        link: `/auctions/${created.id}`,
      },
      ...prev,
    ]);

    return created;
  };

  const approveAuction = (auctionId: string) => {
    const updated = auctions.map((a) => {
      if (a.id === auctionId) {
        return { ...a, status: "live" as const, isLive: true };
      }
      return a;
    });
    saveAuctions(updated);
  };

  const releaseEscrow = (orderId: string) => {
    api.releaseEscrowFunds(orderId, currentUser.id);

    setEscrowOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? { ...ord, milestone: "FUNDS_DISBURSED" as const, updatedAt: new Date().toISOString() }
          : ord
      )
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Escrow Disbursed!",
        message: `Order #${orderId} was confirmed inspected. Escrow funds have been successfully released to the seller.`,
        type: "success",
        timestamp: "Just now",
        read: false,
        link: "/buyer/orders",
      },
      ...prev,
    ]);
  };

  const depositFunds = (amount: number) => {
    api.depositFunds(amount, "Fedwire", currentUser.id);

    initialUsers.buyer.walletBalance += amount;
    initialUsers.buyer.availableBiddingPower += amount * 3;
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Deposit Credited",
        message: `$${amount.toLocaleString()} has been secured in your Escrow Wallet. Your bidding power increased to $${initialUsers.buyer.availableBiddingPower.toLocaleString()}.`,
        type: "success",
        timestamp: "Just now",
        read: false,
        link: "/buyer/wallet",
      },
      ...prev,
    ]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => n.id === id ? { ...n, read: true } : n)
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <AuctionContext.Provider
      value={{
        auctions,
        currentUser,
        currentRole,
        switchRole,
        watchlist,
        toggleWatchlist,
        isWatchlisted,
        bidHistories,
        escrowOrders,
        notifications,
        unreadNotificationsCount,
        markNotificationRead,
        clearAllNotifications,
        backendConnected,
        placeBid,
        simulateOpponentBid,
        createAuction,
        approveAuction,
        releaseEscrow,
        depositFunds,
      }}
    >
      {children}
    </AuctionContext.Provider>
  );
};

export const useAuction = () => {
  const context = useContext(AuctionContext);
  if (!context) {
    throw new Error("useAuction must be used within an AuctionProvider");
  }
  return context;
};
