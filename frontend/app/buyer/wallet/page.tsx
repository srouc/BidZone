"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ShieldCheck, 
  Lock, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  Plus
} from "lucide-react";
import { useAuction } from "@/lib/auction-context";

export default function BuyerWalletPage() {
  const { currentUser, depositFunds } = useAuction();
  const [depositAmount, setDepositAmount] = useState<string>("50000");
  const [depositMethod, setDepositMethod] = useState<string>("Fedwire");
  const [depositSuccess, setDepositSuccess] = useState(false);

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(depositAmount);
    if (!amount || amount <= 0) return;
    depositFunds(amount);
    setDepositSuccess(true);
    setTimeout(() => setDepositSuccess(false), 4000);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
            <Lock className="w-4 h-4" />
            <span>Segregated Escrow Custody Account</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950">
            Escrow Wallet & Collateral
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your bidding collateral, wire disbursements, and settlement escrow accounts.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>FDIC Insured & Swiss FINMA Custody Vault</span>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-2 relative overflow-hidden">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Available Escrow Cash Balance
          </div>
          <div className="text-3xl font-black font-mono">
            ${currentUser.walletBalance.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 pt-1">
            Refundable at any time with 0 platform withdrawal penalty.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Collateral Held in Active Bids
          </div>
          <div className="text-3xl font-black text-amber-600 font-mono">
            ${currentUser.heldInBids.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 pt-1">
            Securing active bids on Lot #101 (1967 Shelby GT500).
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Authorized Bidding Power
          </div>
          <div className="text-3xl font-black text-blue-600 font-mono">
            ${currentUser.availableBiddingPower.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 pt-1">
            3x leverage with cash collateral backing.
          </p>
        </div>
      </div>

      {/* Deposit Simulation Form & Bank Wire Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Deposit Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="font-black text-xl text-slate-900">Add Escrow Deposit Collateral</h3>
            <p className="text-xs text-slate-500">
              Increase your bidding allowance immediately. Funds are held in escrow.
            </p>
          </div>

          {depositSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                Deposit successfully credited to your Escrow Wallet! Your available bidding power has increased.
              </span>
            </div>
          )}

          <form onSubmit={handleDepositSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Deposit Amount (USD)</label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {["10000", "25000", "50000", "100000"].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDepositAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      depositAmount === amt 
                        ? "bg-blue-600 text-white border-blue-600" 
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    +${Number(amt).toLocaleString()}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold font-mono outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Settlement Transfer Channel</label>
              <select
                value={depositMethod}
                onChange={(e) => setDepositMethod(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500 bg-white"
              >
                <option value="Fedwire">Fedwire Institutional Same-Day (US)</option>
                <option value="SWIFT">SWIFT International Wire (Geneva FreePort)</option>
                <option value="ACH">ACH Direct Treasury Debit</option>
                <option value="USDC">USDC Stablecoin Smart Escrow Contract</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Confirm & Credit Deposit (${Number(depositAmount).toLocaleString()})</span>
            </button>
          </form>
        </div>

        {/* Bank Instructions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-4 text-xs">
            <div className="font-bold text-sm text-slate-900 flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Official Escrow Custody Account</span>
            </div>

            <div className="divide-y divide-slate-200 space-y-2">
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Bank Institution:</span>
                <strong className="text-slate-900">JPMorgan Chase Private Bank (Zurich Branch)</strong>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Beneficiary Name:</span>
                <strong className="text-slate-900">BidZone Escrow Fiduciary Ltd.</strong>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Account / IBAN:</span>
                <strong className="text-slate-900 font-mono">CH93 0024 0240 1829 4810 2</strong>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">SWIFT / BIC:</span>
                <strong className="text-slate-900 font-mono">CHASCHZZXXX</strong>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Your Reference Code:</span>
                <strong className="text-blue-600 font-mono">BZ-KYC-99128-VANCE</strong>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 pt-2">
              Wires submitted before 3:00 PM EST are reconciled and credited instantly to your bidding power.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

