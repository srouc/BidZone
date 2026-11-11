"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAuction } from "@/lib/auction-context";

export default function FinanceReleasesPage() {
  const { escrowOrders, releaseEscrow } = useAuction();

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">
            <ArrowUpRight className="w-4 h-4" />
            <span>Consignor Disbursement Queue</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950">Escrow Wire Releases</h1>
          <p className="text-sm text-slate-500 mt-1">Authorize outbound seller disbursements following completed inspection windows.</p>
        </div>
        <Link href="/escrow/dashboard" className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center space-x-1.5">
          <ArrowLeft className="w-4 h-4" />
          <span>Escrow Hub</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
        {escrowOrders.map((ord) => (
          <div key={ord.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-xs text-slate-400 font-bold">{ord.orderNumber}</span>
              <h4 className="font-bold text-slate-900 text-sm">{ord.auctionTitle}</h4>
              <span className="text-xs text-slate-500">To: {ord.sellerName} • Payout: ${ord.sellerPayout.toLocaleString()}</span>
            </div>
            <div>
              {ord.milestone === "FUNDS_DISBURSED" ? (
                <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold inline-flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> <span>Disbursed</span>
                </span>
              ) : (
                <button
                  onClick={() => releaseEscrow(ord.id)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
                >
                  Release ${ord.sellerPayout.toLocaleString()}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

