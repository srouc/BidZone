"use client";

import React from "react";
import Link from "next/link";
import { Bookmark, Clock, Flame, ShieldCheck, CheckCircle2 } from "lucide-react";
import { AuctionLot } from "@/types/auction";
import { useAuction } from "@/lib/auction-context";
import { CountdownTimer } from "./countdown-timer";

interface AuctionCardProps {
  lot: AuctionLot;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({ lot }) => {
  const { isWatchlisted, toggleWatchlist } = useAuction();
  const watchlisted = isWatchlisted(lot.id);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-400 transition-all flex flex-col group relative">
      {/* 1. Image Thumbnail & Badges */}
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <Link href={`/auctions/${lot.id}`}>
          <img
            src={lot.featuredImage}
            alt={lot.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            lot.isLive && lot.status === "live"
              ? "bg-red-600 text-white animate-pulse"
              : "bg-slate-700 text-white"
          }`}>
            {lot.isLive && lot.status === "live" ? "Live" : "Ended"}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 backdrop-blur text-slate-800 border border-slate-200">
            {lot.category}
          </span>
        </div>

        {/* Watchlist Toggle */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWatchlist(lot.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur transition ${
            watchlisted
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white/80 text-slate-600 hover:bg-white hover:text-blue-600"
          }`}
          title={watchlisted ? "Remove from watchlist" : "Add to watchlist"}
        >
          <Bookmark className="w-4 h-4" fill={watchlisted ? "currentColor" : "none"} />
        </button>

        {/* Countdown Ticker at bottom of image */}
        <div className="absolute bottom-3 right-3">
          <CountdownTimer 
            endTime={lot.endTime} 
            isLive={lot.isLive && lot.status === "live"} 
            compact={true} 
          />
        </div>

        {/* Lot Number */}
        <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur px-2 py-0.5 rounded text-white text-[10px] font-mono font-bold">
          Lot #{lot.lotNumber}
        </div>
      </div>

      {/* 2. Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <Link href={`/auctions/${lot.id}`}>
            <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition line-clamp-2 leading-snug">
              {lot.title}
            </h3>
          </Link>

          <div className="flex items-center justify-between text-xs text-slate-500 mt-2 font-medium">
            <span className="flex items-center space-x-1">
              <span className="font-bold text-slate-800">{lot.bidsCount}</span>
              <span>bids</span>
            </span>
            <span className={lot.reserveMet ? "text-emerald-600 font-semibold" : "text-amber-600 font-semibold"}>
              {lot.reserveMet ? "✓ Reserve Met" : "⚠ Reserve Pending"}
            </span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Current High Bid</span>
            <span className="text-lg font-black text-slate-950 font-mono">
              ${lot.currentBid.toLocaleString()}
            </span>
          </div>

          <Link
            href={`/auctions/${lot.id}`}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm hover:shadow-md transition flex items-center space-x-1"
          >
            <span>{lot.isLive ? "Bid Now" : "View Lot"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

