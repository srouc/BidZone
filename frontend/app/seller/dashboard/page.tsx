"use client";

import React from "react";
import Link from "next/link";
import { 
  Building, 
  PlusCircle, 
  TrendingUp, 
  Gavel, 
  Clock, 
  DollarSign, 
  Eye, 
  ShieldCheck, 
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { useAuction } from "@/lib/auction-context";

export default function SellerDashboardPage() {
  const { currentUser, auctions } = useAuction();

  // Find lots consigned by this seller
  const sellerLots = auctions.filter((a) => a.seller.id === currentUser.id);

  const totalGrossHammer = sellerLots.reduce((acc, curr) => acc + curr.currentBid, 0);
  const totalBids = sellerLots.reduce((acc, curr) => acc + curr.bidsCount, 0);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
            <Building className="w-4 h-4" />
            <span>Consignor Studio</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950">
            {currentUser.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Consignment portfolio, real-time bidder engagement, and escrow disbursements.
          </p>
        </div>

        <Link
          href="/seller/create"
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center space-x-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Consign New Auction Lot</span>
        </Link>
      </div>

      {/* 2. KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Hammer Value
          </div>
          <div className="text-2xl font-black text-slate-950 font-mono">
            ${totalGrossHammer.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Across {sellerLots.length} consigned lots</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Bids Received
          </div>
          <div className="text-2xl font-black text-blue-600 font-mono">
            {totalBids}
          </div>
          <div className="text-[11px] text-slate-500">
            High bidder engagement
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Consignor Payout Escrow
          </div>
          <div className="text-2xl font-black text-emerald-600 font-mono">
            ${currentUser.walletBalance.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">
            Available for wire transfer
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Consignor Rating
          </div>
          <div className="text-2xl font-black text-slate-950 font-mono">
            ★ {currentUser.sellerRating || 4.98}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            Top Tier Certified Consignor
          </div>
        </div>
      </div>

      {/* 3. My Consigned Lots Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-black text-lg text-slate-950">Active & Scheduled Consignments</h3>
            <p className="text-xs text-slate-500">Monitor live pricing, watcher engagement, and reserve status.</p>
          </div>
          <Link href="/seller/create" className="text-xs font-bold text-blue-600 hover:underline">
            + Consign Another Lot
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {sellerLots.map((lot) => (
            <div key={lot.id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-50/50 transition">
              <div className="flex items-center space-x-4 w-full md:w-auto">
                <img
                  src={lot.featuredImage}
                  alt=""
                  className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-slate-200"
                />
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-mono font-bold text-slate-400">Lot #{lot.lotNumber}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">{lot.category}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      lot.isLive ? "bg-red-100 text-red-700 animate-pulse" : "bg-slate-200 text-slate-700"
                    }`}>
                      {lot.isLive ? "🔴 Live Arena" : "Concluded"}
                    </span>
                  </div>
                  <Link href={`/auctions/${lot.id}`}>
                    <h4 className="font-bold text-slate-900 text-sm hover:text-blue-600 transition">
                      {lot.title}
                    </h4>
                  </Link>
                  <div className="flex items-center space-x-3 text-xs text-slate-500 pt-1">
                    <span>Reserve: <strong className={lot.reserveMet ? "text-emerald-600" : "text-amber-600"}>
                      ${lot.reservePrice.toLocaleString()} ({lot.reserveMet ? "Met" : "Pending"})
                    </strong></span>
                    <span>•</span>
                    <span>{lot.watchersCount} Watchers</span>
                    <span>•</span>
                    <span>{lot.viewsCount} Views</span>
                  </div>
                </div>
              </div>

              {/* Price & Status */}
              <div className="flex items-center justify-between md:justify-end space-x-6 w-full md:w-auto">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Hammer Price</span>
                  <span className="text-xl font-black text-slate-950 font-mono">
                    ${lot.currentBid.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 block">{lot.bidsCount} bids placed</span>
                </div>

                <Link
                  href={`/auctions/${lot.id}`}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
                >
                  Live Arena
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

