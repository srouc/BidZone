"use client";

import React from "react";
import Link from "next/link";
import { RotateCcw, ArrowLeft, ShieldCheck } from "lucide-react";

export default function FinanceRefundsPage() {
  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">
            <RotateCcw className="w-4 h-4" />
            <span>Escrow Collateral Reversals</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950">Refunds & Released Holds</h1>
          <p className="text-sm text-slate-500 mt-1">Manage returned bidder collateral and disputed transaction refunds.</p>
        </div>
        <Link href="/escrow/dashboard" className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center space-x-1.5">
          <ArrowLeft className="w-4 h-4" />
          <span>Escrow Hub</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-sm">
        <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
        <h3 className="font-bold text-slate-900 text-lg">Zero Pending Refund Claims</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          All outbid collateral holds are automatically released in real-time back to bidder wallets. No disputed arbitration refunds are currently pending.
        </p>
      </div>
    </div>
  );
}

