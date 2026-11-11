"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Filter } from "lucide-react";
import { useAuction } from "@/lib/auction-context";
import { AuctionCard } from "@/components/auction-card";

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = (params.slug as string) || "";
  const { auctions } = useAuction();

  // Normalize slug to match category names e.g. "fine-watches" -> "Fine Watches"
  const decodedCategory = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const matchingLots = auctions.filter((a) => {
    return (
      a.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug.toLowerCase() ||
      a.category.toLowerCase() === decodedCategory.toLowerCase()
    );
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <Link
            href="/categories"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Categories</span>
          </Link>
          <h1 className="text-3xl font-black text-slate-950 capitalize">
            {decodedCategory} Lots
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse authenticated {decodedCategory} lots currently open for competitive live bids.
          </p>
        </div>

        <Link
          href={`/auctions?category=${encodeURIComponent(decodedCategory)}`}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
        >
          Explore with Filters
        </Link>
      </div>

      {matchingLots.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <h3 className="font-bold text-slate-900 text-lg">No active lots in this category</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Consignments for {decodedCategory} are currently being appraised. Check back soon or consign your own lot.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/auctions" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs">
              View All Auctions
            </Link>
            <Link href="/seller/create" className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs">
              Consign a Lot
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {matchingLots.map((lot) => (
            <AuctionCard key={lot.id} lot={lot} />
          ))}
        </div>
      )}
    </div>
  );
}

