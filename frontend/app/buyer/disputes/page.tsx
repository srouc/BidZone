"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ShieldCheck, ArrowLeft, CheckCircle2, MessageSquare } from "lucide-react";
import { useAuction } from "@/lib/auction-context";

export default function BuyerDisputesPage() {
  const { escrowOrders } = useAuction();
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setReason("");
  };

  return (
    <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>Escrow Arbitration Desk</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950">Disputes & Claims</h1>
          <p className="text-sm text-slate-500 mt-1">Open an inspection discrepancy claim to pause escrow disbursement.</p>
        </div>
        <Link href="/buyer/orders" className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center space-x-1.5">
          <ArrowLeft className="w-4 h-4" />
          <span>My Orders</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-black text-lg text-slate-900">File an Escrow Inspection Dispute</h3>
          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-emerald-950">Dispute Ticket Logged — Escrow Frozen</h4>
              <p className="text-xs text-emerald-800">
                Funds remain locked in Zurich custody. An independent appraiser will contact you within 4 hours.
              </p>
              <button onClick={() => setSubmitted(false)} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleDisputeSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Select Escrow Order</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white">
                  {escrowOrders.map((ord) => (
                    <option key={ord.id} value={ord.id}>
                      {ord.orderNumber} — {ord.auctionTitle}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Discrepancy Details</label>
                <textarea
                  required
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe condition issues, missing provenance certificates, or transit damage..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500"
                ></textarea>
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm">
                Freeze Escrow & Submit Dispute
              </button>
            </form>
          )}
        </div>

        <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>100% Buyer Escrow Protection</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Filing a dispute during your inspection period automatically suspends payout to the seller. BidZone arbitrators evaluate third-party inspection reports and enforce full refunds if lot specifications were misrepresented.
          </p>
        </div>
      </div>
    </div>
  );
}

