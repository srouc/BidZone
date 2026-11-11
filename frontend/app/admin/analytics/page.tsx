"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, ArrowLeft } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useAuction } from "@/lib/auction-context";

export default function AdminAnalyticsPage() {
  const { auctions } = useAuction();

  const categoryMap: Record<string, number> = {};
  auctions.forEach((a) => {
    categoryMap[a.category] = (categoryMap[a.category] || 0) + a.currentBid;
  });

  const chartData = Object.entries(categoryMap).map(([category, volume]) => ({
    category,
    volume,
  }));

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Platform Intelligence</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950">GMV & Category Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Gross hammer distribution across authenticated asset classes.</p>
        </div>
        <Link href="/admin/dashboard" className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center space-x-1.5">
          <ArrowLeft className="w-4 h-4" />
          <span>Admin Console</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="font-black text-lg text-slate-900">Gross Hammer Volume by Category (USD)</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="category" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(val: any) => `$${Number(val).toLocaleString()}`} />
              <Bar dataKey="volume" name="Hammer Volume" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
