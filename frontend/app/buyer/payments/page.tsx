"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CreditCard, Building2, CheckCircle2, Plus, ArrowLeft, ShieldCheck } from "lucide-react";

export default function BuyerPaymentsPage() {
  const [methods, setMethods] = useState([
    { id: "pm-1", type: "Fedwire Bank Account", details: "JPMorgan Private Bank •••• 8842", primary: true, verified: true },
    { id: "pm-2", type: "SWIFT International Wire", details: "UBS Zurich •••• 1029", primary: false, verified: true },
    { id: "pm-3", type: "Amex Centurion", details: "•••• •••• •••• 9001", primary: false, verified: true },
  ]);

  return (
    <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
            <CreditCard className="w-4 h-4" />
            <span>Payment & Settlement Methods</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950">Linked Bank & Wire Accounts</h1>
          <p className="text-sm text-slate-500 mt-1">Manage verified funding channels for instant escrow deposits.</p>
        </div>
        <Link href="/buyer/wallet" className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center space-x-1.5">
          <ArrowLeft className="w-4 h-4" />
          <span>Escrow Wallet</span>
        </Link>
      </div>

      <div className="space-y-4">
        {methods.map((m) => (
          <div key={m.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <span>{m.type}</span>
                  {m.primary && <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold">Primary</span>}
                </div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">{m.details}</div>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified</span>
            </span>
          </div>
        ))}
      </div>

      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-3 text-xs text-slate-600">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <span>All linked bank accounts are safeguarded under PCI-DSS Level 1 and FINMA fiduciary standards.</span>
        </div>
        <Link href="/buyer/wallet" className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs">
          Make Deposit
        </Link>
      </div>
    </div>
  );
}

