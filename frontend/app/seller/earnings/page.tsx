"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, DollarSign, ArrowLeft, CheckCircle2 } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useAuction } from "@/lib/auction-context";

const revenueData = [
  { month: "Jun", hammer: 420000, net: 399000 },
  { month: "Jul", hammer: 580000, net: 551000 },
  { month: "Aug", hammer: 310000, net: 294500 },
  { month: "Sep", hammer: 890000, net: 845500 },
  { month: "Oct", hammer: 740000, net: 703000 },
  { month: "Nov", hammer: 1150000, net: 1092500 },
];

export default function SellerEarningsPage() {
  const { currentUser } = useAuction();

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Consignor Financial Performance</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950">Earnings & GMV Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Track gross hammer performance, platform fees, and net disbursements.</p>
        </div>
        <Link href="/seller/dashboard" className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center space-x-1.5">
          <ArrowLeft className="w-4 h-4" />
          <span>Seller Studio</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Net Earnings</span>
          <div className="text-3xl font-black font-mono">${(currentUser.totalSold || 3450000).toLocaleString()}</div>
          <span className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Settled via Escrow</span>
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Available Payout Balance</span>
          <div className="text-3xl font-black text-blue-600 font-mono">${currentUser.walletBalance.toLocaleString()}</div>
          <Link href="/seller/settlements" className="text-xs font-bold text-blue-600 hover:underline block">Request Wire →</Link>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Average Commission Rate</span>
          <div className="text-3xl font-black text-slate-950 font-mono">5.0%</div>
          <span className="text-xs text-slate-500">Institutional Consignor Tier</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-lg text-slate-900">6-Month Consignment Revenue Trajectory</h3>
            <p className="text-xs text-slate-500">Gross hammer volume vs. net consignor payouts (USD)</p>
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHammer" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip formatter={(val: any) => `$${Number(val).toLocaleString()}`} />
              <Area type="monotone" dataKey="hammer" name="Gross Hammer" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorHammer)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

