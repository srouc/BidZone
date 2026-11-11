"use client";

import React from "react";
import Link from "next/link";
import { Building, DollarSign, CheckCircle2, ArrowLeft } from "lucide-react";
import { useAuction } from "@/lib/auction-context";

export default function SellerSettlementsPage() {
  const { currentUser, escrowOrders } = useAuction();

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
            <Building className="w-4 h-4" />
            <span>Consignor Payout Fiduciary</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950">
            Settlements & Wire Payouts
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Disbursements released from the escrow vault upon buyer inspection completion.
          </p>
        </div>

        <Link
          href="/seller/dashboard"
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Seller Studio</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-lg space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Settled Consignor Balance</span>
          <div className="text-3xl font-black font-mono">${currentUser.walletBalance.toLocaleString()}</div>
          <span className="text-xs text-emerald-400 font-semibold block">Available for SWIFT / Fedwire</span>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">All-Time Sales Volume</span>
          <div className="text-3xl font-black font-mono text-slate-900">${currentUser.totalSold.toLocaleString()}</div>
          <span className="text-xs text-slate-500 block">48 authenticated lots</span>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Average Hammer Price</span>
          <div className="text-3xl font-black font-mono text-blue-600">$71,875</div>
          <span className="text-xs text-slate-500 block">Top 5% consignor volume</span>
        </div>
      </div>
    </div>
  );
}

