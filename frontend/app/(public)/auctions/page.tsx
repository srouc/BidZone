"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Search, 
  SlidersHorizontal, 
  Grid, 
  List, 
  RotateCcw, 
  Clock, 
  Flame, 
  ShieldCheck, 
  ArrowUpDown,
  X
} from "lucide-react";
import { useAuction } from "@/lib/auction-context";
import { AuctionCard } from "@/components/auction-card";
import { AuctionCategory, AuctionStatus } from "@/types/auction";
import Link from "next/link";

export default function AuctionsPage() {
  const searchParams = useSearchParams();
  const { auctions } = useAuction();

  // Search & Filter state
  const initialCategory = searchParams.get("category") || "";
  const initialStatus = searchParams.get("status") || "";
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatus);
  const [sortBy, setSortBy] = useState<string>("ending_soon");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const categories: AuctionCategory[] = [
    "Vehicles",
    "Fine Watches",
    "Tech & Artifacts",
    "Art & Antiquities",
    "Rare Jewelry",
    "Real Estate",
  ];

  // Filtering
  const filteredAuctions = useMemo(() => {
    return auctions.filter((lot) => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = lot.title.toLowerCase().includes(q);
        const matchesCategory = lot.category.toLowerCase().includes(q);
        const matchesDesc = lot.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCategory && !matchesDesc) return false;
      }

      // Category filter
      if (selectedCategory && lot.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (selectedStatus === "live" && (!lot.isLive || lot.status !== "live")) {
        return false;
      }
      if (selectedStatus === "ended" && lot.status !== "ended") {
        return false;
      }

      // Price filter
      if (minPrice && lot.currentBid < Number(minPrice)) {
        return false;
      }
      if (maxPrice && lot.currentBid > Number(maxPrice)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "ending_soon") {
        return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
      }
      if (sortBy === "price_desc") {
        return b.currentBid - a.currentBid;
      }
      if (sortBy === "price_asc") {
        return a.currentBid - b.currentBid;
      }
      if (sortBy === "bids_desc") {
        return b.bidsCount - a.bidsCount;
      }
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });
  }, [auctions, searchQuery, selectedCategory, selectedStatus, sortBy, minPrice, maxPrice]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedStatus("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("ending_soon");
  };

  const hasActiveFilters = Boolean(
    searchQuery || selectedCategory || selectedStatus || minPrice || maxPrice || sortBy !== "ending_soon"
  );

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      {/* 1. Header & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Authenticated Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950">
            Auction Marketplace
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Discover {auctions.length} rare lots undergoing verified bidding and escrow settlement.
          </p>
        </div>

        {/* View Mode & Sorter */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition ${viewMode === "grid" ? "bg-slate-100 text-blue-600" : "text-slate-400"}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition ${viewMode === "list" ? "bg-slate-100 text-blue-600" : "text-slate-400"}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm text-xs font-semibold text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent outline-none cursor-pointer font-bold text-slate-900"
            >
              <option value="ending_soon">Ending Soonest</option>
              <option value="price_desc">Highest Price First</option>
              <option value="price_asc">Lowest Price First</option>
              <option value="bids_desc">Most Competitive (Bids)</option>
              <option value="newest">Recently Listed</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* Top search & status row */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center space-x-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by lot title, description, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-medium bg-transparent outline-none text-slate-900 placeholder-slate-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")}>
                <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700" />
              </button>
            )}
          </div>

          {/* Status Quick Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setSelectedStatus("")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedStatus === "" 
                  ? "bg-slate-900 text-white" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Lots
            </button>
            <button
              onClick={() => setSelectedStatus("live")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
                selectedStatus === "live"
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-red-400 animate-ping"></span>
              <span>Live Bidding</span>
            </button>
            <button
              onClick={() => setSelectedStatus("ended")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedStatus === "ended"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Past Results
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === ""
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Active Filters Clear Bar */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">
              Showing <strong className="text-slate-900">{filteredAuctions.length}</strong> matches
            </span>
            <button
              onClick={resetFilters}
              className="inline-flex items-center space-x-1 text-red-600 hover:text-red-700 font-bold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset all filters</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Results Section */}
      {filteredAuctions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">No matching auction lots found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters to browse all active auction lots.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
          >
            View All Lots
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAuctions.map((lot) => (
            <AuctionCard key={lot.id} lot={lot} />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredAuctions.map((lot) => (
            <div
              key={lot.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-blue-400 transition flex flex-col md:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-4 w-full md:w-auto">
                <img
                  src={lot.featuredImage}
                  alt={lot.title}
                  className="w-24 h-24 rounded-xl object-cover shrink-0"
                />
                <div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-mono font-bold text-slate-400">Lot #{lot.lotNumber}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">{lot.category}</span>
                    <span className={lot.isLive ? "text-red-600 font-bold uppercase text-[10px]" : "text-slate-400 text-[10px]"}>
                      {lot.isLive ? "🔴 Live" : "Ended"}
                    </span>
                  </div>
                  <Link href={`/auctions/${lot.id}`}>
                    <h3 className="font-bold text-slate-900 text-base hover:text-blue-600 transition mt-1">
                      {lot.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-1">{lot.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end space-x-6 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Bid</span>
                  <span className="text-xl font-black text-slate-950 font-mono">${lot.currentBid.toLocaleString()}</span>
                  <span className="text-xs text-slate-400 block">{lot.bidsCount} bids</span>
                </div>

                <Link
                  href={`/auctions/${lot.id}`}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition whitespace-nowrap"
                >
                  {lot.isLive ? "Enter Arena" : "View Details"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

