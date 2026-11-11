"use client";

import React from "react";
import Link from "next/link";
import { Award, ArrowLeft, ShieldCheck } from "lucide-react";
import { useAuction } from "@/lib/auction-context";

export default function WonAuctionsPage() {
  const { escrowOrders } = useAuction();

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">
            <Award className="w-4 h-4" />
            <span>Collector Acquisitions</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950">Won Auctions Archive</h1>
          <p className="text-sm text-slate-500 mt-1">Lots successfully acquired with verified hammer settlements.</p>
        </div>
        <Link href="/buyer/orders" className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold">
          Manage Escrow Orders
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {escrowOrders.map((ord) => (
          <div key={ord.id} className="bg-white rounded-3xl border border-slate-200 p-6 flex items-start space-x-4 shadow-sm">
            <img src={ord.auctionImage} alt="" className="w-24 h-24 rounded-2xl object-cover shrink-0 border border-slate-200" />
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-400">{ord.orderNumber}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {ord.milestone.replace(/_/g, " ")}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{ord.auctionTitle}</h3>
              <div className="text-lg font-black font-mono text-slate-950">${ord.hammerPrice.toLocaleString()}</div>
              <div className="pt-2">
                <Link href="/buyer/orders" className="text-xs font-bold text-blue-600 hover:underline">
                  View Custody & Tracking →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

