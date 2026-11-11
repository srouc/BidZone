"use client";

import React from "react";
import Link from "next/link";
import { Building, PlusCircle, ArrowLeft } from "lucide-react";
import { useAuction } from "@/lib/auction-context";

export default function SellerListingsPage() {
  const { currentUser, auctions } = useAuction();
  const myLots = auctions.filter((a) => a.seller.id === currentUser.id);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
            <Building className="w-4 h-4" />
            <span>Consignor Inventory</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950">
            Managed Auction Lots
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            All lots consigned by {currentUser.name}.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/seller/create"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Consign Lot</span>
          </Link>
          <Link
            href="/seller/dashboard"
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
          >
            Studio Dashboard
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
        {myLots.map((lot) => (
          <div key={lot.id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-50/50 transition">
            <div className="flex items-center space-x-4">
              <img src={lot.featuredImage} alt="" className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-slate-200" />
              <div>
                <span className="font-mono text-xs font-bold text-slate-400">Lot #{lot.lotNumber}</span>
                <Link href={`/auctions/${lot.id}`}>
                  <h4 className="font-bold text-slate-900 text-base hover:text-blue-600">{lot.title}</h4>
                </Link>
                <div className="text-xs text-slate-500 mt-1">
                  Reserve: <strong className={lot.reserveMet ? "text-emerald-600" : "text-amber-600"}>${lot.reservePrice.toLocaleString()}</strong> • Status: <strong className="uppercase">{lot.status}</strong>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Bid</span>
              <span className="text-xl font-black text-slate-950 font-mono">${lot.currentBid.toLocaleString()}</span>
              <span className="text-xs text-slate-400 block">{lot.bidsCount} bids</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

