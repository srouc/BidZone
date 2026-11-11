"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Gavel, CheckCircle2, ShieldCheck, ArrowRight, UserCheck, Building } from "lucide-react";
import { useAuction } from "@/lib/auction-context";

export default function RegisterPage() {
  const router = useRouter();
  const { switchRole } = useAuction();
  const [accountType, setAccountType] = useState<"BUYER" | "SELLER">("BUYER");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("United States");
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert("Please agree to the Auction Marketplace Rules and Escrow Terms.");
      return;
    }
    switchRole(accountType);
    if (accountType === "BUYER") {
      router.push("/buyer/dashboard");
    } else {
      router.push("/seller/dashboard");
    }
  };

  return (
    <div className="py-12 max-w-lg mx-auto px-4 sm:px-6 w-full space-y-8">
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
            <Gavel className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-slate-950 font-display">
            Bid<span className="text-blue-600">Zone</span>
          </span>
        </Link>
        <h1 className="text-2xl font-black text-slate-900">Create Verified Account</h1>
        <p className="text-xs text-slate-500">Join the world's premier authenticated auction and bidding network.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Account Role Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">I am joining primarily as:</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAccountType("BUYER")}
              className={`p-4 rounded-2xl border text-left transition space-y-1.5 ${
                accountType === "BUYER"
                  ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <UserCheck className="w-5 h-5 text-blue-600" />
                {accountType === "BUYER" && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              </div>
              <div className="font-bold text-sm text-slate-900">Collector / Buyer</div>
              <div className="text-[11px] text-slate-500">Compete in live and timed auctions with escrow custody.</div>
            </button>

            <button
              type="button"
              onClick={() => setAccountType("SELLER")}
              className={`p-4 rounded-2xl border text-left transition space-y-1.5 ${
                accountType === "SELLER"
                  ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <Building className="w-5 h-5 text-blue-600" />
                {accountType === "SELLER" && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              </div>
              <div className="font-bold text-sm text-slate-900">Consignor / Seller</div>
              <div className="text-[11px] text-slate-500">List curated lots with bank-guaranteed payouts.</div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Full Legal Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Julian Hayes"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <input
              type="email"
              required
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Country of Tax Residence</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500 bg-white"
            >
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Switzerland</option>
              <option>Monaco</option>
              <option>United Arab Emirates</option>
              <option>Singapore</option>
              <option>Canada</option>
              <option>Germany</option>
              <option>France</option>
              <option>Japan</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <input
              type="password"
              required
              placeholder="Min 8 characters with numbers & symbols"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500"
            />
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start space-x-2.5 pt-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="terms" className="text-xs text-slate-600 leading-normal">
              I certify that I am at least 18 years of age and agree to the{" "}
              <Link href="/terms" className="text-blue-600 font-bold hover:underline">
                BidZone Auction Marketplace Rules
              </Link>
              ,{" "}
              <Link href="/how-it-works#anti-sniping" className="text-blue-600 font-bold hover:underline">
                Anti-Sniping Protocol
              </Link>
              , and{" "}
              <Link href="/how-it-works#escrow" className="text-blue-600 font-bold hover:underline">
                Escrow Custody Agreement
              </Link>
              .
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2"
          >
            <span>Complete Registration</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Already registered?{" "}
          <Link href="/login" className="font-bold text-blue-600 hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}

