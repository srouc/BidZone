"use client";

import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Gavel, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  Settings, 
  Lock,
  Layers
} from "lucide-react";
import { useAuction } from "@/lib/auction-context";

export default function AdminDashboardPage() {
  const { auctions, approveAuction } = useAuction();

  const totalGMV = auctions.reduce((acc, curr) => acc + curr.currentBid, 0);
  const platformFees = Math.round(totalGMV * 0.05);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Chief Curator Administrative Operations</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950">
            Platform Operations & Moderation
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Global lot catalog surveillance, anti-shill monitoring, and institutional bidder onboarding.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center space-x-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Real-time Anti-Shill AI Active</span>
          </span>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Catalog Gross GMV
          </div>
          <div className="text-2xl font-black font-mono">
            ${totalGMV.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400">
            Active and completed lots
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Platform 5% Fee Revenue
          </div>
          <div className="text-2xl font-black text-emerald-600 font-mono">
            ${platformFees.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            Automated escrow commissions
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Managed Lots
          </div>
          <div className="text-2xl font-black text-slate-950 font-mono">
            {auctions.length}
          </div>
          <div className="text-[11px] text-blue-600 font-semibold">
            {auctions.filter((a) => a.isLive).length} currently accepting live bids
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            KYC Verified Bidders
          </div>
          <div className="text-2xl font-black text-slate-950 font-mono">
            1,482
          </div>
          <div className="text-[11px] text-slate-500">
            Tier 3 accredited collectors
          </div>
        </div>
      </div>

      {/* Catalog Moderation & Live Surveillance */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-black text-lg text-slate-950">Live Auction Lots Moderation</h3>
            <p className="text-xs text-slate-500">Real-time hammer surveillance and anti-sniping log inspect.</p>
          </div>
          <Link href="/seller/create" className="text-xs font-bold text-blue-600 hover:underline">
            + Consign Lot
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {auctions.map((lot) => (
            <div key={lot.id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-50/50 transition">
              <div className="flex items-center space-x-4 w-full md:w-auto">
                <img
                  src={lot.featuredImage}
                  alt=""
                  className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200"
                />
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-mono font-bold text-slate-400">Lot #{lot.lotNumber}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">{lot.category}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      lot.isLive ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"
                    }`}>
                      {lot.isLive ? "LIVE" : "ENDED"}
                    </span>
                  </div>
                  <Link href={`/auctions/${lot.id}`}>
                    <h4 className="font-bold text-slate-900 text-sm hover:text-blue-600">{lot.title}</h4>
                  </Link>
                  <div className="text-xs text-slate-500">
                    Seller: <strong className="text-slate-800">{lot.seller.name}</strong> • {lot.bidsCount} Bids • Reserve: <strong className={lot.reserveMet ? "text-emerald-600" : "text-amber-600"}>
                      ${lot.reservePrice.toLocaleString()} ({lot.reserveMet ? "Met" : "Pending"})
                    </strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end space-x-4 w-full md:w-auto">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Hammer</span>
                  <span className="text-lg font-black text-slate-950 font-mono">
                    ${lot.currentBid.toLocaleString()}
                  </span>
                </div>

                <Link
                  href={`/auctions/${lot.id}`}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
                >
                  Inspect Arena
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

