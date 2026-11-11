"use client";

import React from "react";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";
import { useAuction } from "@/lib/auction-context";

export default function FinanceTransactionsPage() {
  const { escrowOrders } = useAuction();

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">
            <FileText className="w-4 h-4" />
            <span>Fiduciary Audit Trail</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950">All Financial Transactions</h1>
          <p className="text-sm text-slate-500 mt-1">Complete immutable ledger of escrow holds, fees, and disbursements.</p>
        </div>
        <Link href="/escrow/dashboard" className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center space-x-1.5">
          <ArrowLeft className="w-4 h-4" />
          <span>Escrow Hub</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Reference</th>
              <th className="px-6 py-4">Lot</th>
              <th className="px-6 py-4">Buyer → Seller</th>
              <th className="px-6 py-4">Hammer</th>
              <th className="px-6 py-4">Platform Fee</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {escrowOrders.map((ord) => (
              <tr key={ord.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-mono font-bold text-slate-900">{ord.orderNumber}</td>
                <td className="px-6 py-4 font-semibold text-slate-800 max-w-xs truncate">{ord.auctionTitle}</td>
                <td className="px-6 py-4 text-slate-600">{ord.buyerName} → {ord.sellerName}</td>
                <td className="px-6 py-4 font-mono font-bold text-slate-900">${ord.hammerPrice.toLocaleString()}</td>
                <td className="px-6 py-4 font-mono text-emerald-600 font-bold">+${ord.platformFee.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-bold text-[10px]">
                    {ord.milestone.replace(/_/g, " ")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

