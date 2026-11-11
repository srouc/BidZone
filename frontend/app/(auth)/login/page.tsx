"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Gavel, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, KeyRound } from "lucide-react";
import { useAuction } from "@/lib/auction-context";
import { UserRole } from "@/types/user";

export default function LoginPage() {
  const router = useRouter();
  const { switchRole } = useAuction();
  const [email, setEmail] = useState("alexander.vance@investments.com");
  const [password, setPassword] = useState("••••••••••••");

  const handleRoleQuickLogin = (role: UserRole, targetRoute: string) => {
    switchRole(role);
    router.push(targetRoute);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/buyer/dashboard");
  };

  return (
    <div className="py-16 max-w-md mx-auto px-4 sm:px-6 w-full space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
            <Gavel className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-slate-950 font-display">
            Bid<span className="text-blue-600">Zone</span>
          </span>
        </Link>
        <h1 className="text-2xl font-black text-slate-900">Sign in to your account</h1>
        <p className="text-xs text-slate-500">Access your live bidding arena, watchlists, and escrow vault.</p>
      </div>

      {/* 1-Click Role Switcher Demo Cards */}
      <div className="bg-blue-50/70 rounded-2xl border border-blue-200 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-blue-900 flex items-center space-x-1.5">
            <KeyRound className="w-4 h-4 text-blue-600" />
            <span>Interactive Demo: 1-Click Role Login</span>
          </span>
          <span className="text-[10px] bg-blue-200 text-blue-800 px-2 py-0.5 rounded font-bold">Fast Pass</span>
        </div>
        <p className="text-[11px] text-blue-800">
          Select any persona to instantly test its dedicated dashboard features:
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => handleRoleQuickLogin("BUYER", "/buyer/dashboard")}
            className="p-2.5 rounded-xl bg-white hover:bg-blue-600 hover:text-white border border-blue-200 text-slate-800 font-bold transition text-left shadow-sm flex flex-col"
          >
            <span className="text-xs">Alexander Vance</span>
            <span className="text-[10px] text-blue-600 group-hover:text-blue-200 font-normal">Active Buyer ($1.2M)</span>
          </button>

          <button
            onClick={() => handleRoleQuickLogin("SELLER", "/seller/dashboard")}
            className="p-2.5 rounded-xl bg-white hover:bg-blue-600 hover:text-white border border-blue-200 text-slate-800 font-bold transition text-left shadow-sm flex flex-col"
          >
            <span className="text-xs">Eleanor Sterling</span>
            <span className="text-[10px] text-blue-600 font-normal">Consignor (48 lots)</span>
          </button>

          <button
            onClick={() => handleRoleQuickLogin("ESCROW_OFFICER", "/escrow/dashboard")}
            className="p-2.5 rounded-xl bg-white hover:bg-blue-600 hover:text-white border border-blue-200 text-slate-800 font-bold transition text-left shadow-sm flex flex-col"
          >
            <span className="text-xs">Marcus Vance</span>
            <span className="text-[10px] text-purple-600 font-normal">Escrow Officer ($14.2M)</span>
          </button>

          <button
            onClick={() => handleRoleQuickLogin("ADMIN", "/admin/dashboard")}
            className="p-2.5 rounded-xl bg-white hover:bg-blue-600 hover:text-white border border-blue-200 text-slate-800 font-bold transition text-left shadow-sm flex flex-col"
          >
            <span className="text-xs">Sophia Ray</span>
            <span className="text-[10px] text-amber-600 font-normal">Chief Curator Admin</span>
          </button>
        </div>
      </div>

      {/* Standard Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <Link href="/forgot-password" className="text-xs font-bold text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-1.5"
          >
            <span>Sign In to BidZone</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Don't have an authenticated account?{" "}
          <Link href="/register" className="font-bold text-blue-600 hover:underline">
            Register as a Collector
          </Link>
        </div>
      </div>
    </div>
  );
}

