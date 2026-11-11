"use client";

import React from "react";
import Link from "next/link";
import { Gavel, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAuction } from "@/lib/auction-context";

export default function AdminAuctionsPage() {
  const { auctions, approveAuction } = useAuction();

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">
            <Gavel className="w-4 h-4" />
            <span>Curator Lot Moderation</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950">Auction Lots & Approvals</h1>
          <p className="text-sm text-slate-500 mt-1">Manage active auctions, verify reserves, and approve pending lots.</p>
        </div>
        <Link href="/admin/dashboard" className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center space-x-1.5">
          <ArrowLeft className="w-4 h-4" />
          <span>Admin Console</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
        {auctions.map((lot) => (
          <div key={lot.id} className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <img src={lot.featuredImage} alt="" className="w-16 h-16 rounded-2xl object-cover border border-slate-200" />
              <div>
                <span className="font-mono text-xs text-slate-400 font-bold">Lot #{lot.lotNumber} • {lot.category}</span>
                <h4 className="font-bold text-slate-900 text-sm">{lot.title}</h4>
                <div className="text-xs text-slate-500">Current Bid: <strong className="font-mono text-slate-900">${lot.currentBid.toLocaleString()}</strong></div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {lot.status !== "live" ? (
                <button onClick={() => approveAuction(lot.id)} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">
                  Approve & Set Live
                </button>
              ) : (
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> <span>Live</span>
                </span>
              )}
              <Link href={`/auctions/${lot.id}`} className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold">
                Inspect
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
