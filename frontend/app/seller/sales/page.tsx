"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowLeft, FileText } from "lucide-react";
import { useAuction } from "@/lib/auction-context";

export default function SellerSalesPage() {
  const { escrowOrders } = useAuction();

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
            <FileText className="w-4 h-4" />
            <span>Completed Consignment Ledger</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950">Sold Lots & Escrow Releases</h1>
          <p className="text-sm text-slate-500 mt-1">Completed hammer transactions and verified consignor payouts.</p>
        </div>
        <Link href="/seller/dashboard" className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center space-x-1.5">
          <ArrowLeft className="w-4 h-4" />
          <span>Seller Studio</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
        {escrowOrders.map((ord) => (
          <div key={ord.id} className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <img src={ord.auctionImage} alt="" className="w-16 h-16 rounded-2xl object-cover border border-slate-200" />
              <div>
                <span className="font-mono text-xs text-slate-400 font-bold">{ord.orderNumber}</span>
                <h4 className="font-bold text-slate-900 text-sm">{ord.auctionTitle}</h4>
                <div className="text-xs text-slate-500">Buyer: {ord.buyerName} • {ord.milestone.replace(/_/g, " ")}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-black font-mono text-emerald-600">+${ord.sellerPayout.toLocaleString()}</div>
              <span className="text-[11px] text-slate-400">Net Consignor Payout</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

