"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, ShieldCheck, Key, Mail, Phone, Globe, CheckCircle2, ArrowLeft } from "lucide-react";
import { useAuction } from "@/lib/auction-context";

export default function BuyerProfilePage() {
  const { currentUser } = useAuction();
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
            <User className="w-4 h-4" />
            <span>Bidder Account Identity</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950">Profile & Security</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your verified bidder credentials and 2FA protections.</p>
        </div>

        <Link
          href="/buyer/dashboard"
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="flex items-center space-x-4 pb-6 border-b border-slate-100">
          <img src={currentUser.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover border border-slate-200" />
          <div>
            <h3 className="font-black text-xl text-slate-900">{currentUser.name}</h3>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>KYC Tier 3 Verified</span>
              </span>
              <span>•</span>
              <span>Member since {currentUser.joinedDate}</span>
            </div>
          </div>
        </div>

        {saved && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            Profile preferences updated securely.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Legal Name</label>
              <input type="text" defaultValue={currentUser.name} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Email Address</label>
              <input type="email" defaultValue={currentUser.email} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Phone Number</label>
              <input type="text" defaultValue={currentUser.phone || "+1 (555) 234-8901"} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Country of Residence</label>
              <input type="text" defaultValue={currentUser.country} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium" />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

