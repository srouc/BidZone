"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Gavel, 
  Search, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  Lock, 
  DollarSign,
  Sparkles,
  Layers,
  Award,
  ChevronRight
} from "lucide-react";
import { useAuction } from "@/lib/auction-context";
import { AuctionCard } from "@/components/auction-card";
import { AuctionCategory } from "@/types/auction";

export default function HomePage() {
  const { auctions } = useAuction();
  const [searchQuery, setSearchQuery] = useState("");

  const liveAuctions = auctions.filter((a) => a.isLive && a.status === "live");
  const featuredLots = liveAuctions.slice(0, 4);

  const categories: { name: AuctionCategory; count: string; icon: string; desc: string }[] = [
    { name: "Vehicles", count: "142 Lots", icon: "🏎️", desc: "Classic Muscle & Hypercars" },
    { name: "Fine Watches", count: "89 Lots", icon: "⌚", desc: "Patek Philippe, Rolex, AP" },
    { name: "Tech & Artifacts", count: "64 Lots", icon: "💾", desc: "Historic Silicon & Patents" },
    { name: "Art & Antiquities", count: "115 Lots", icon: "🎨", desc: "Impressionist & Modern" },
    { name: "Rare Jewelry", count: "78 Lots", icon: "💎", desc: "Vivid Diamonds & Signed" },
    { name: "Real Estate", count: "32 Lots", icon: "🏛️", desc: "Trophy Compounds & Estates" },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50/70 via-white to-slate-50 py-16 sm:py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-100/90 border border-blue-200 text-blue-800 text-xs font-bold tracking-wide shadow-sm">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Bank-Grade Escrow Vaults • Real-Time Anti-Sniping Protocol</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-tight max-w-4xl mx-auto">
            Bid Smart. <span className="text-blue-600">Win More.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The enterprise live auction marketplace. Compete in timed and real-time lots with verified bidder protections, automatic proxy bidding, and financial escrow custody.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 flex flex-col sm:flex-row items-center gap-2">
            <div className="flex-1 flex items-center space-x-2 px-3 w-full">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rare cars, luxury watches, fine art, collectibles..."
                className="w-full py-2.5 text-sm bg-transparent outline-none text-slate-800 placeholder-slate-400 font-medium"
              />
            </div>
            <Link
              href={searchQuery ? `/auctions?q=${encodeURIComponent(searchQuery)}` : "/auctions"}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6">
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="text-2xl font-black text-slate-950 font-mono">$18.4M+</div>
              <div className="text-xs font-semibold text-slate-500">Gross Hammer Volume</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="text-2xl font-black text-blue-600 font-mono">100%</div>
              <div className="text-xs font-semibold text-slate-500">Escrow Custody Vault</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="text-2xl font-black text-emerald-600 font-mono">+120s</div>
              <div className="text-xs font-semibold text-slate-500">Anti-Sniping Engine</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="text-2xl font-black text-slate-950 font-mono">98.7%</div>
              <div className="text-xs font-semibold text-slate-500">Verified Sell-Through</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Live Auctions Section */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-red-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4" />
              <span>Live Bidding In Progress</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
              Featured Auction Lots
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Curated rare collector assets currently accepting competitive live bids.
            </p>
          </div>

          <Link
            href="/auctions"
            className="flex items-center space-x-1.5 text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            <span>Browse All {auctions.length} Auctions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Auctions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredLots.map((lot) => (
            <AuctionCard key={lot.id} lot={lot} />
          ))}
        </div>
      </section>

      {/* 3. Browse by Category */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-950">Curated Auction Categories</h2>
              <p className="text-sm text-slate-500">Explore authenticated lots across top luxury asset classes.</p>
            </div>
            <Link href="/categories" className="text-xs font-bold text-blue-600 hover:underline hidden sm:block">
              View All Categories →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                href={`/auctions?category=${encodeURIComponent(cat.name)}`}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-400 text-center transition group flex flex-col items-center justify-center space-y-2"
              >
                <div className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</div>
                <div className="font-bold text-sm text-slate-900 group-hover:text-blue-600">{cat.name}</div>
                <div className="text-xs text-slate-500 font-medium">{cat.count}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How It Works Workflow Bar */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-widest">Enterprise Auction Standard</div>
          <h2 className="text-3xl font-black text-slate-950">How Bidding Works on BidZone</h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            A transparent four-step process guaranteeing fair competition, instant proxy bidding, and complete financial security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black text-sm mb-4">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Verify Bidder Profile</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete automated KYC identity verification and deposit refundable escrow collateral to unlock institutional bidding power.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black text-sm mb-4">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Live & Proxy Bidding</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Place manual bids in real-time or configure Max Proxy Bidding to automatically defend your lead up to your predetermined ceiling.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black text-sm mb-4">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Anti-Sniping Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Any bid placed in the final 2 minutes triggers an automatic 120-second clock reset, preventing bot sniping and giving genuine collectors time.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-sm mb-4">
              04
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Escrow Delivery</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hammer funds stay in escrow custody until physical delivery, white-glove inspection, and your explicit inspection sign-off.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Trust & Platform Security Pillar */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
              <Lock className="w-3.5 h-3.5" />
              <span>Institutional Bid Integrity</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Bid with Total Confidence through Escrow Custody.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every winning bid is held securely in an independent financial escrow vault. Funds are only disbursed to the seller once verified physical delivery and inspection window are completed.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm">Anti-Shill Guarantee</div>
                  <div className="text-xs text-slate-400">Strict IP & seller relationship blocks prevent artificial price inflation.</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm">Anti-Sniping +120s</div>
                  <div className="text-xs text-slate-400">Last-minute bids automatically extend the auction clock for fairness.</div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <Link
                href="/auctions"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
              >
                Explore Active Auctions
              </Link>
              <Link
                href="/how-it-works"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
              >
                Learn Escrow Terms
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
