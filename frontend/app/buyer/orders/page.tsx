"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  AlertTriangle, 
  Lock,
  ArrowRight
} from "lucide-react";
import { useAuction } from "@/lib/auction-context";

export default function BuyerOrdersPage() {
  const { escrowOrders, releaseEscrow } = useAuction();
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Escrow Settlement Tracker</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950">
            Purchased Lots & Deliveries
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Every transaction is protected in independent escrow until you verify physical delivery.
          </p>
        </div>

        <div className="text-xs text-slate-500">
          Showing <strong>{escrowOrders.length}</strong> Escrow Orders
        </div>
      </div>

      <div className="space-y-6">
        {escrowOrders.map((ord) => {
          const isInspecting = ord.milestone === "DELIVERED_INSPECTION_WINDOW";
          const isDisbursed = ord.milestone === "FUNDS_DISBURSED";

          return (
            <div key={ord.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              {/* Order Header */}
              <div className="p-6 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="text-slate-400 block font-semibold">Order Reference</span>
                    <strong className="text-slate-900 font-mono text-sm">{ord.orderNumber}</strong>
                  </div>
                  <div className="h-6 w-px bg-slate-200"></div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Date Won</span>
                    <strong className="text-slate-900">{new Date(ord.createdAt).toLocaleDateString()}</strong>
                  </div>
                  <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
                  <div className="hidden sm:block">
                    <span className="text-slate-400 block font-semibold">Seller / Consignor</span>
                    <strong className="text-slate-900">{ord.sellerName}</strong>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isDisbursed
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : isInspecting
                      ? "bg-amber-100 text-amber-800 border border-amber-200 animate-pulse"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {ord.milestone.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8 flex items-center space-x-4">
                  <img
                    src={ord.auctionImage}
                    alt=""
                    className="w-24 h-24 rounded-2xl object-cover shrink-0 border border-slate-200"
                  />
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-base">{ord.auctionTitle}</h3>
                    <div className="text-xs text-slate-500">
                      Hammer Price: <span className="font-mono font-bold text-slate-900">${ord.hammerPrice.toLocaleString()}</span> + Premium: <span className="font-mono text-slate-900">${ord.buyerPremium.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-blue-600 font-bold flex items-center space-x-1 pt-1">
                      <Truck className="w-3.5 h-3.5" />
                      <span>{ord.carrier} • Tracking: <span className="font-mono">{ord.trackingNumber}</span></span>
                    </div>
                  </div>
                </div>

                {/* Price & Action Column */}
                <div className="lg:col-span-4 flex flex-col items-end space-y-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Funds in Escrow</span>
                    <span className="text-2xl font-black text-slate-950 font-mono">
                      ${ord.totalHeld.toLocaleString()}
                    </span>
                  </div>

                  {isInspecting ? (
                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => releaseEscrow(ord.id)}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accept & Release Escrow</span>
                      </button>

                      <button
                        onClick={() => alert("Escrow dispute ticket opened. Our chief curator will contact you immediately.")}
                        className="w-full sm:w-auto px-3 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs transition"
                      >
                        Raise Dispute
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-emerald-600 font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed & Disbursed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

