"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Gavel, 
  Clock, 
  ShieldCheck, 
  Bookmark, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  ArrowLeft, 
  Info, 
  ChevronRight, 
  Share2, 
  Zap, 
  Lock,
  DollarSign,
  TrendingUp,
  UserCheck
} from "lucide-react";
import { useAuction } from "@/lib/auction-context";
import { CountdownTimer } from "@/components/countdown-timer";

export default function AuctionDetailPage() {
  const params = useParams();
  const auctionId = params.id as string;
  const { 
    auctions, 
    bidHistories, 
    currentUser, 
    placeBid, 
    simulateOpponentBid, 
    isWatchlisted, 
    toggleWatchlist 
  } = useAuction();

  const lot = auctions.find((a) => a.id === auctionId) || auctions[0];
  const history = bidHistories[lot?.id] || [];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "escrow" | "seller">("overview");
  const [customBidAmount, setCustomBidAmount] = useState<string>("");
  const [isProxyBidding, setIsProxyBidding] = useState(false);
  const [proxyMaxAmount, setProxyMaxAmount] = useState<string>("");
  const [bidError, setBidError] = useState<string | null>(null);
  const [bidSuccess, setBidSuccess] = useState<string | null>(null);

  if (!lot) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Auction Lot Not Found</h2>
        <Link href="/auctions" className="text-blue-600 hover:underline mt-2 inline-block">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const minNextBid = lot.currentBid + lot.minIncrement;
  const isUserWinning = history.length > 0 && history[0].bidderId === currentUser.id;
  const watchlisted = isWatchlisted(lot.id);

  const handleQuickBid = (incrementMultiple: number) => {
    setBidError(null);
    setBidSuccess(null);
    const amount = lot.currentBid + (lot.minIncrement * incrementMultiple);
    const result = placeBid(lot.id, amount);
    if (!result.success) {
      setBidError(result.message);
    } else {
      setBidSuccess(result.message);
      setTimeout(() => setBidSuccess(null), 5000);
    }
  };

  const handleCustomBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBidError(null);
    setBidSuccess(null);
    const numeric = Number(customBidAmount.replace(/[^0-9]/g, ""));
    if (!numeric || numeric < minNextBid) {
      setBidError(`Minimum acceptable bid is $${minNextBid.toLocaleString()}`);
      return;
    }
    const result = placeBid(lot.id, numeric);
    if (!result.success) {
      setBidError(result.message);
    } else {
      setBidSuccess(result.message);
      setCustomBidAmount("");
      setTimeout(() => setBidSuccess(null), 5000);
    }
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      {/* 1. Breadcrumbs & Top Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-2">
          <Link href="/auctions" className="hover:text-blue-600 flex items-center space-x-1 font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Marketplace</span>
          </Link>
          <span>/</span>
          <Link href={`/auctions?category=${encodeURIComponent(lot.category)}`} className="hover:text-blue-600 font-semibold">
            {lot.category}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold truncate max-w-xs">Lot #{lot.lotNumber}</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => toggleWatchlist(lot.id)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
              watchlisted 
                ? "bg-blue-50 border-blue-200 text-blue-700" 
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" fill={watchlisted ? "currentColor" : "none"} />
            <span>{watchlisted ? "Watching" : "Watch Lot"}</span>
          </button>

          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              alert("Auction link copied to clipboard!");
            }}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* 2. Main Auction Arena Layout (Gallery + Live Bidding Block) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Gallery & Lot Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Large Display */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 shadow-md aspect-video sm:aspect-[4/3]">
            <img
              src={lot.images[activeImageIndex] || lot.featuredImage}
              alt={lot.title}
              className="w-full h-full object-cover"
            />

            {/* Overlays */}
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                lot.isLive ? "bg-red-600 text-white animate-pulse" : "bg-slate-800 text-white"
              }`}>
                {lot.isLive ? "🔴 Live Arena" : "Concluded"}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur text-slate-900 border border-slate-200">
                Lot #{lot.lotNumber}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-xl text-white text-xs font-medium">
              Photo {activeImageIndex + 1} of {lot.images.length}
            </div>
          </div>

          {/* Thumbnails */}
          {lot.images.length > 1 && (
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              {lot.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition shrink-0 ${
                    activeImageIndex === idx ? "border-blue-600 ring-2 ring-blue-500/20" : "border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Title & Key Highlights */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>{lot.category}</span>
              <span>•</span>
              <span className="text-blue-600">{lot.subcategory}</span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold">{lot.condition}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
              {lot.title}
            </h1>

            {/* Price Estimates & Reserve */}
            <div className="flex flex-wrap items-center gap-4 text-xs py-3 px-4 bg-slate-100/70 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-500 block">Auction Estimate</span>
                <span className="font-bold text-slate-900 font-mono text-sm">
                  ${lot.estimatedLow.toLocaleString()} – ${lot.estimatedHigh.toLocaleString()}
                </span>
              </div>
              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
              <div>
                <span className="text-slate-500 block">Reserve Price Status</span>
                <span className={`font-bold text-sm ${lot.reserveMet ? "text-emerald-600" : "text-amber-600"}`}>
                  {lot.reserveMet ? "✓ Reserve Has Been Met" : "⚠ Reserve Still Pending"}
                </span>
              </div>
              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
              <div>
                <span className="text-slate-500 block">Buyer Premium</span>
                <span className="font-bold text-slate-900 text-sm">{lot.buyerPremiumPercent}% Flat</span>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-slate-200 flex space-x-6 text-sm font-bold">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-3 transition relative ${
                activeTab === "overview" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Overview & Provenance
            </button>
            <button
              onClick={() => setActiveTab("specs")}
              className={`pb-3 transition relative ${
                activeTab === "specs" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab("escrow")}
              className={`pb-3 transition relative ${
                activeTab === "escrow" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Escrow & Delivery Terms
            </button>
            <button
              onClick={() => setActiveTab("seller")}
              className={`pb-3 transition relative ${
                activeTab === "seller" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Consignor Profile
            </button>
          </div>

          {/* Tab Content */}
          <div className="text-slate-700 text-sm leading-relaxed">
            {activeTab === "overview" && (
              <div className="space-y-4">
                <p>{lot.description}</p>
                {lot.provenance && (
                  <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-100 space-y-1">
                    <div className="font-bold text-xs uppercase tracking-wider text-blue-900 flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>Documented Provenance</span>
                    </div>
                    <p className="text-xs text-blue-950 font-medium">{lot.provenance}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "specs" && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                {Object.entries(lot.specifications).map(([key, val]) => (
                  <div key={key} className="px-4 py-3 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">{key}</span>
                    <span className="font-bold text-slate-900 font-mono text-right">{val}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "escrow" && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="font-bold text-emerald-900 text-sm flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Protected by Zurich FreePort Escrow Custody</span>
                  </div>
                  <p className="text-xs text-emerald-800">
                    Buyer funds are held in independent escrow until item is received and inspected.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500 block">Inspection Period</span>
                    <strong className="text-slate-900 text-sm">{lot.inspectionPeriodDays} Business Days</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500 block">Shipping Origin</span>
                    <strong className="text-slate-900 text-sm">{lot.shippingOrigin}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 col-span-2">
                    <span className="text-slate-500 block">Delivery Method</span>
                    <strong className="text-slate-900 text-sm">{lot.deliveryMethod}</strong>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "seller" && (
              <div className="p-5 bg-white rounded-2xl border border-slate-200 flex items-start space-x-4">
                <img
                  src={lot.seller.avatar}
                  alt={lot.seller.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                />
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-slate-900 text-base">{lot.seller.name}</h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Verified Consignor
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Rating: <strong className="text-slate-800">★ {lot.seller.rating} / 5.0</strong> • Completed Sales: <strong className="text-slate-800">{lot.seller.salesCount} lots</strong>
                  </div>
                  <p className="text-xs text-slate-500 pt-1">
                    Certified high-value consignor adhering to BidZone strict grading authenticity and escrow standards.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: High-Stakes Live Bidding Engine Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Bidding Card */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-6 space-y-6 sticky top-24">
            {/* Live Status Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                </span>
                <span className="font-black text-sm uppercase tracking-wide text-red-600">
                  Live Bidding Session
                </span>
              </div>

              {/* Status Badge */}
              {isUserWinning ? (
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-200 animate-pulse">
                  ★ YOU ARE WINNING
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                  {lot.bidsCount} Bids Logged
                </span>
              )}
            </div>

            {/* Countdown Clock */}
            <CountdownTimer 
              endTime={lot.endTime} 
              isLive={lot.isLive}
              snipingExtensionMinutes={lot.snipingExtendedMinutes} 
            />

            {/* Price Display */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-1 shadow-inner">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Current Highest Hammer Bid
              </span>
              <div className="text-4xl font-black font-mono tracking-tight text-white flex items-baseline space-x-2">
                <span>${lot.currentBid.toLocaleString()}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-normal">USD</span>
              </div>
              <div className="text-xs text-slate-400 pt-1 flex items-center justify-between">
                <span>Min Next Bid: <strong className="text-white">${minNextBid.toLocaleString()}</strong></span>
                <span>Increment: <strong className="text-white">+${lot.minIncrement.toLocaleString()}</strong></span>
              </div>
            </div>

            {/* Error or Success Alerts */}
            {bidError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{bidError}</span>
              </div>
            )}
            {bidSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center space-x-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{bidSuccess}</span>
              </div>
            )}

            {/* Quick Bid 1-Click Buttons */}
            {lot.isLive && (
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Quick Bid Increments
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleQuickBid(1)}
                    className="p-3 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-xs border border-blue-200 hover:border-blue-600 transition flex flex-col items-center justify-center space-y-1"
                  >
                    <span>+${lot.minIncrement.toLocaleString()}</span>
                    <span className="text-[10px] font-mono opacity-80">
                      ${(lot.currentBid + lot.minIncrement).toLocaleString()}
                    </span>
                  </button>

                  <button
                    onClick={() => handleQuickBid(2)}
                    className="p-3 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-xs border border-blue-200 hover:border-blue-600 transition flex flex-col items-center justify-center space-y-1"
                  >
                    <span>+${(lot.minIncrement * 2).toLocaleString()}</span>
                    <span className="text-[10px] font-mono opacity-80">
                      ${(lot.currentBid + lot.minIncrement * 2).toLocaleString()}
                    </span>
                  </button>

                  <button
                    onClick={() => handleQuickBid(5)}
                    className="p-3 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-xs border border-blue-200 hover:border-blue-600 transition flex flex-col items-center justify-center space-y-1"
                  >
                    <span>+${(lot.minIncrement * 5).toLocaleString()}</span>
                    <span className="text-[10px] font-mono opacity-80">
                      ${(lot.currentBid + lot.minIncrement * 5).toLocaleString()}
                    </span>
                  </button>
                </div>

                {/* Custom Bid Form */}
                <form onSubmit={handleCustomBidSubmit} className="space-y-2 pt-2">
                  <div className="flex rounded-xl border border-slate-200 overflow-hidden shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                    <span className="px-3.5 py-2.5 bg-slate-50 text-slate-500 font-bold text-sm border-r border-slate-200">
                      $
                    </span>
                    <input
                      type="text"
                      placeholder={`Enter custom bid >= $${minNextBid.toLocaleString()}`}
                      value={customBidAmount}
                      onChange={(e) => setCustomBidAmount(e.target.value)}
                      className="w-full px-3 py-2 text-sm font-bold font-mono outline-none text-slate-900 placeholder-slate-400"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition"
                    >
                      Place Bid
                    </button>
                  </div>
                </form>

                {/* Interactive Demo Simulation Button */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => simulateOpponentBid(lot.id)}
                    className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition flex items-center justify-center space-x-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>⚡ Test Live Arena (Simulate Competitor Counter-Bid)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Live Bid History Feed */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Live Bid Ledger ({history.length})
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>Streaming</span>
                </span>
              </div>

              <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
                {history.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No bids logged yet. Be the first to bid!
                  </div>
                ) : (
                  history.map((item, index) => {
                    const isCurrentUser = item.bidderId === currentUser.id;
                    return (
                      <div
                        key={item.id}
                        className={`py-2.5 px-3 rounded-xl flex items-center justify-between text-xs transition ${
                          index === 0
                            ? isCurrentUser 
                              ? "bg-emerald-50/70 border border-emerald-200"
                              : "bg-blue-50/50"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] ${
                            isCurrentUser ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"
                          }`}>
                            {item.bidderName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                              <span>{isCurrentUser ? "You (Alexander Vance)" : item.bidderName}</span>
                              {index === 0 && (
                                <span className="px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[9px] font-bold">
                                  LEAD
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-black text-slate-950 font-mono text-sm">
                            ${item.amount.toLocaleString()}
                          </div>
                          {item.isProxy && (
                            <span className="text-[9px] text-blue-600 font-semibold block">Auto-Proxy</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Escrow Shield Guarantee Footer */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center space-x-1 font-bold text-slate-800">
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                <span>Zero Risk Bidder Escrow Protection</span>
              </div>
              <p>
                Bidding is legally binding. Your deposit is held securely in escrow and only transferred upon approved inspection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

