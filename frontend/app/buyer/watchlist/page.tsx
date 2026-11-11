"use client";

import React from "react";
import Link from "next/link";
import { Bookmark, ArrowLeft, Gavel, Trash2, ArrowRight } from "lucide-react";
import { useAuction } from "@/lib/auction-context";
import { AuctionCard } from "@/components/auction-card";

export default function WatchlistPage() {
  const { watchlist, auctions, toggleWatchlist } = useAuction();

  const watchlistedLots = auctions.filter((a) => watchlist.includes(a.id));

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
            <Bookmark className="w-4 h-4" />
            <span>Saved Curations</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950">
            My Auction Watchlist
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track closing times, incoming competitive bids, and price movements.
          </p>
        </div>

        <Link
          href="/auctions"
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse More Lots</span>
        </Link>
      </div>

      {watchlistedLots.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Your watchlist is currently empty</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Browse our curated auction catalog and click the bookmark icon on any lot to track it here.
          </p>
          <Link
            href="/auctions"
            className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md"
          >
            Explore Active Auctions
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {watchlistedLots.map((lot) => (
            <AuctionCard key={lot.id} lot={lot} />
          ))}
        </div>
      )}
    </div>
  );
}

