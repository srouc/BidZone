"use client";

import React from "react";
import Link from "next/link";
import { Users, CheckCircle2, ArrowLeft } from "lucide-react";
import { initialUsers } from "@/lib/mock-data";

export default function AdminUsersPage() {
  const usersList = Object.values(initialUsers);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">
            <Users className="w-4 h-4" />
            <span>Identity & Role Governance</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950">Platform Users & KYC</h1>
          <p className="text-sm text-slate-500 mt-1">Manage accredited collectors, consignors, escrow officers, and administrators.</p>
        </div>
        <Link href="/admin/dashboard" className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center space-x-1.5">
          <ArrowLeft className="w-4 h-4" />
          <span>Admin Console</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Country</th>
              <th className="px-6 py-4">KYC Status</th>
              <th className="px-6 py-4">Wallet Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {usersList.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 flex items-center space-x-3">
                  <img src={u.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <div className="text-slate-400">{u.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">{u.role}</span>
                </td>
                <td className="px-6 py-4 text-slate-600">{u.country}</td>
                <td className="px-6 py-4">
                  <span className="text-emerald-600 font-bold inline-flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> <span>{u.kycStatus}</span>
                  </span>
                </td>
                <td className="px-6 py-4 font-mono font-bold text-slate-900">${u.walletBalance.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
