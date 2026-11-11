"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, FileCheck, ArrowLeft, Lock } from "lucide-react";
import { useAuction } from "@/lib/auction-context";

export default function BuyerVerificationPage() {
  const { currentUser } = useAuction();

  return (
    <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Institutional Compliance</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950">KYC & Bidder Accreditation</h1>
          <p className="text-sm text-slate-500 mt-1">Verify your identity to unlock high-limit luxury auction bidding.</p>
        </div>
        <Link href="/buyer/dashboard" className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center space-x-1.5">
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex items-start space-x-4">
        <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="font-black text-emerald-950 text-lg">Tier 3 Institutional Accreditation Active</h3>
          <p className="text-xs text-emerald-800 leading-relaxed">
            Your identity ({currentUser.kycDocumentType || "Passport Verified"}) was approved on {currentUser.verifiedAt || "2026-01-15"}. You are authorized for bids up to $10,000,000+ per lot with 3x escrow collateral leverage.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
        <h4 className="font-bold text-slate-900 text-sm">Verified Credentials on File</h4>
        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-3 flex justify-between">
            <span className="text-slate-500">Government Identity Document</span>
            <strong className="text-emerald-600 flex items-center space-x-1"><CheckCircle2 className="w-3.5 h-3.5" /> <span>Verified</span></strong>
          </div>
          <div className="py-3 flex justify-between">
            <span className="text-slate-500">Proof of Residential Address</span>
            <strong className="text-emerald-600 flex items-center space-x-1"><CheckCircle2 className="w-3.5 h-3.5" /> <span>Verified</span></strong>
          </div>
          <div className="py-3 flex justify-between">
            <span className="text-slate-500">AML / Source of Funds Check</span>
            <strong className="text-emerald-600 flex items-center space-x-1"><CheckCircle2 className="w-3.5 h-3.5" /> <span>Cleared</span></strong>
          </div>
        </div>
      </div>
    </div>
  );
}

