"use client";

import React from "react";
import Link from "next/link";
import { Gavel, Clock, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";
import { useAuction } from "@/lib/auction-context";

export default function BuyerBidsPage() {
  const { currentUser, auctions, bidHistories, placeBid } = useAuction();

  const userParticipatingLots = Object.entries(bidHistories).map(([auctionId, bids]) => {
    const lot = auctions.find((a) => a.id === auctionId);
    const userBids = bids.filter((b) => b.bidderId === currentUser.id);
    const isLead = bids.length > 0 && bids[0].bidderId === currentUser.id;
    return {
      lot,
      userBids,
      isLead,
      currentLeadBid: bids[0],
    };
  }).filter((item) => item.lot && item.userBids.length > 0);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
            <Gavel className="w-4 h-4" />
            <span>Bidder Audit Log</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950">
            My Bidding History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            All submitted bids across live and historic auction lots.
          </p>
        </div>

        <Link
          href="/buyer/dashboard"
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Buyer Dashboard</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100">
          {userParticipatingLots.map(({ lot, userBids, isLead, currentLeadBid }) => {
            if (!lot) return null;
            return (
              <div key={lot.id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-50/50 transition">
                <div className="flex items-center space-x-4 w-full md:w-auto">
                  <img src={lot.featuredImage} alt="" className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-slate-200" />
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-bold text-slate-400">Lot #{lot.lotNumber}</span>
                    <Link href={`/auctions/${lot.id}`}>
                      <h4 className="font-bold text-slate-900 text-base hover:text-blue-600">{lot.title}</h4>
                    </Link>
                    <div className="text-xs text-slate-500">
                      You placed <strong>{userBids.length}</strong> bids • Highest: <strong className="font-mono text-slate-900">${userBids[0]?.amount.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {isLead ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                      WINNING LEAD
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-black">
                      OUTBID (${lot.currentBid.toLocaleString()})
                    </span>
                  )}

                  <Link
                    href={`/auctions/${lot.id}`}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                  >
                    View Lot
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

