"use client";

import React from "react";
import Link from "next/link";
import { ArrowDownLeft, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAuction } from "@/lib/auction-context";

export default function FinancePaymentsPage() {
  const { escrowOrders } = useAuction();

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">
            <ArrowDownLeft className="w-4 h-4" />
            <span>Inbound Fiduciary Wires</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950">Buyer Escrow Payments</h1>
          <p className="text-sm text-slate-500 mt-1">Verified inbound wire settlements received into custody.</p>
        </div>
        <Link href="/escrow/dashboard" className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center space-x-1.5">
          <ArrowLeft className="w-4 h-4" />
          <span>Escrow Hub</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
        {escrowOrders.map((ord) => (
          <div key={ord.id} className="p-6 flex items-center justify-between">
            <div>
              <span className="font-mono text-xs text-slate-400 font-bold">{ord.orderNumber}</span>
              <h4 className="font-bold text-slate-900 text-sm">{ord.auctionTitle}</h4>
              <span className="text-xs text-slate-500">From: {ord.buyerName} • {new Date(ord.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-black font-mono text-emerald-600">+${ord.totalHeld.toLocaleString()}</div>
              <span className="text-[10px] font-bold text-emerald-700 inline-flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" /> <span>Cleared into Vault</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

