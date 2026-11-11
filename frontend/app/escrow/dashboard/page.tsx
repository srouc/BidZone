"use client";

import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  Clock, 
  ArrowRight,
  FileCheck
} from "lucide-react";
import { useAuction } from "@/lib/auction-context";

export default function EscrowDashboardPage() {
  const { escrowOrders, releaseEscrow } = useAuction();

  const totalVaultHeld = escrowOrders.reduce((acc, curr) => acc + curr.totalHeld, 0);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">
            <Lock className="w-4 h-4" />
            <span>FINMA Regulated Escrow Fiduciary Desk</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950">
            Escrow Vault Custody & Settlements
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Oversee segregated buyer funds, verify carrier inspection milestones, and authorize automated wire disbursements.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs bg-purple-50 text-purple-800 border border-purple-200 px-3.5 py-1.5 rounded-full font-bold">
          <ShieldCheck className="w-4 h-4 text-purple-600" />
          <span>Zurich FreePort Vault Node Active</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Custody Held in Vault
          </div>
          <div className="text-2xl font-black font-mono">
            ${totalVaultHeld.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Segregated Fiduciary Reserve</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Active Escrow Contracts
          </div>
          <div className="text-2xl font-black text-slate-950 font-mono">
            {escrowOrders.length}
          </div>
          <div className="text-[11px] text-slate-500">
            {escrowOrders.filter((o) => o.milestone !== "FUNDS_DISBURSED").length} awaiting release
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Platform Fiduciary Fees Earned
          </div>
          <div className="text-2xl font-black text-emerald-600 font-mono">
            ${escrowOrders.reduce((acc, curr) => acc + curr.platformFee, 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">
            Escrow fee share
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Dispute Arbitration Rate
          </div>
          <div className="text-2xl font-black text-blue-600 font-mono">
            0.02%
          </div>
          <div className="text-[11px] text-slate-500">
            Near-zero arbitration disputes
          </div>
        </div>
      </div>

      {/* Escrow Orders Queue */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-black text-lg text-slate-950">Active Escrow Contracts & Release Authorizations</h3>
            <p className="text-xs text-slate-500">Review carrier proof-of-delivery and trigger final consignor disbursements.</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {escrowOrders.map((ord) => {
            const isCompleted = ord.milestone === "FUNDS_DISBURSED";
            return (
              <div key={ord.id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-50/50 transition">
                <div className="flex items-center space-x-4 w-full md:w-auto">
                  <img
                    src={ord.auctionImage}
                    alt=""
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="font-mono font-bold text-slate-400">{ord.orderNumber}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isCompleted ? "bg-emerald-100 text-emerald-800" : "bg-purple-100 text-purple-800"
                      }`}>
                        {ord.milestone.replace(/_/g, " ")}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{ord.auctionTitle}</h4>
                    <div className="text-xs text-slate-500">
                      Buyer: <strong className="text-slate-800">{ord.buyerName}</strong> → Seller: <strong className="text-slate-800">{ord.sellerName}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end space-x-6 w-full md:w-auto">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Consignor Net Payout</span>
                    <span className="text-xl font-black text-slate-950 font-mono">
                      ${ord.sellerPayout.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Total held: ${ord.totalHeld.toLocaleString()}</span>
                  </div>

                  {!isCompleted ? (
                    <button
                      onClick={() => releaseEscrow(ord.id)}
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Authorize Wire Release</span>
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Disbursed</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

