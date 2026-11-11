"use client";

import React from "react";
import Link from "next/link";
import { 
  Wallet, 
  Gavel, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Bookmark, 
  ShieldCheck, 
  TrendingUp, 
  Plus, 
  Eye
} from "lucide-react";
import { useAuction } from "@/lib/auction-context";

export default function BuyerDashboardPage() {
  const { currentUser, auctions, bidHistories, watchlist, escrowOrders, placeBid } = useAuction();

  // Find active lots where current user has placed bids
  const userBids = Object.entries(bidHistories).map(([auctionId, bids]) => {
    const lot = auctions.find((a) => a.id === auctionId);
    const userHighestBid = bids.find((b) => b.bidderId === currentUser.id);
    const isLead = bids.length > 0 && bids[0].bidderId === currentUser.id;
    return {
      lot,
      userHighestBid,
      isLead,
      currentLeadBid: bids[0],
    };
  }).filter((item) => item.lot && item.userHighestBid);

  const pendingOrders = escrowOrders.filter((o) => o.buyerId === currentUser.id);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      {/* 1. Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified Institutional Bidder Portal</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor active live bids, escrow collateral custody, and white-glove inspection deliveries.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/buyer/wallet"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Deposit Escrow Funds</span>
          </Link>
          <Link
            href="/auctions?status=live"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center space-x-1.5"
          >
            <Gavel className="w-4 h-4" />
            <span>Enter Live Arena</span>
          </Link>
        </div>
      </div>

      {/* 2. Financial & Bidding Limits Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Escrow Wallet Cash</span>
            <Wallet className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-950 font-mono">
            ${currentUser.walletBalance.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Held in segregated Swiss custody</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Available Bidding Power</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-blue-600 font-mono">
            ${currentUser.availableBiddingPower.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">
            3x collateral leverage limit
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Participating Lots</span>
            <Gavel className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-950 font-mono">
            {userBids.length}
          </div>
          <div className="text-[11px] text-slate-500">
            {userBids.filter((b) => b.isLead).length} currently leading
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Saved Watchlist</span>
            <Bookmark className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-950 font-mono">
            {watchlist.length} Lots
          </div>
          <Link href="/buyer/watchlist" className="text-[11px] font-bold text-blue-600 hover:underline">
            View saved auctions →
          </Link>
        </div>
      </div>

      {/* 3. Active Live Bids Ledger */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-black text-lg text-slate-950">Active Bids in Arena</h3>
            <p className="text-xs text-slate-500">Lots you have bid on that are currently live.</p>
          </div>
          <Link href="/auctions?status=live" className="text-xs font-bold text-blue-600 hover:underline">
            Browse More Live Lots →
          </Link>
        </div>

        {userBids.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500 space-y-3">
            <p>You have not placed bids on any active auction lots yet.</p>
            <Link
              href="/auctions"
              className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Explore Live Auctions
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {userBids.map(({ lot, userHighestBid, isLead, currentLeadBid }) => {
              if (!lot) return null;
              const minRebid = lot.currentBid + lot.minIncrement;
              return (
                <div key={lot.id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-50/50 transition">
                  <div className="flex items-center space-x-4 w-full md:w-auto">
                    <img
                      src={lot.featuredImage}
                      alt={lot.title}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="font-mono font-bold text-slate-400">Lot #{lot.lotNumber}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">{lot.category}</span>
                      </div>
                      <Link href={`/auctions/${lot.id}`}>
                        <h4 className="font-bold text-slate-900 text-sm hover:text-blue-600 transition">
                          {lot.title}
                        </h4>
                      </Link>
                      <div className="flex items-center space-x-3 text-xs text-slate-500 pt-1">
                        <span>Your bid: <strong className="font-mono text-slate-900">${userHighestBid?.amount.toLocaleString()}</strong></span>
                        <span>•</span>
                        <span>Hammer: <strong className="font-mono text-slate-900">${lot.currentBid.toLocaleString()}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center justify-between md:justify-end space-x-4 w-full md:w-auto">
                    <div>
                      {isLead ? (
                        <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-200 flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>HIGH BIDDER</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 rounded-full bg-red-100 text-red-800 text-xs font-black border border-red-200 flex items-center space-x-1.5 animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>OUTBID BY {currentLeadBid?.bidderName}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {!isLead && (
                        <button
                          onClick={() => placeBid(lot.id, minRebid)}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition"
                        >
                          Re-bid ${minRebid.toLocaleString()}
                        </button>
                      )}

                      <Link
                        href={`/auctions/${lot.id}`}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition"
                      >
                        Enter Arena
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Escrow Deliveries & Inspection Queue */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-lg text-slate-950">Won Lots in Escrow Custody</h3>
            <p className="text-xs text-slate-500">Track shipments, verify delivery, and authorize fund release.</p>
          </div>
          <Link href="/buyer/orders" className="text-xs font-bold text-blue-600 hover:underline">
            View All Orders ({pendingOrders.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingOrders.map((ord) => (
            <div key={ord.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-4">
              <img src={ord.auctionImage} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400">{ord.orderNumber}</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                    {ord.milestone.replace(/_/g, " ")}
                  </span>
                </div>
                <h5 className="font-bold text-xs text-slate-900 line-clamp-1">{ord.auctionTitle}</h5>
                <div className="text-xs font-mono font-bold text-slate-900">
                  Total Held: ${ord.totalHeld.toLocaleString()}
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">Tracking: {ord.carrier}</span>
                  <Link href="/buyer/orders" className="text-xs font-bold text-blue-600 hover:underline">
                    Manage Escrow →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

