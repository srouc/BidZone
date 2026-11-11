"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Layers, ShieldCheck } from "lucide-react";
import { useAuction } from "@/lib/auction-context";
import { AuctionCategory } from "@/types/auction";

export default function CategoriesPage() {
  const { auctions } = useAuction();

  const categoryList: {
    name: AuctionCategory;
    icon: string;
    description: string;
    image: string;
  }[] = [
    {
      name: "Vehicles",
      icon: "🏎️",
      description: "Rare classic muscle, Ferrari/Porsche sports cars, and low-mileage modern hypercars.",
      image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Fine Watches",
      icon: "⌚",
      description: "Haute horlogerie from Patek Philippe, Rolex Daytona grails, Audemars Piguet, and FP Journe.",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Tech & Artifacts",
      icon: "💾",
      description: "Historic computing relics, early Silicon Valley prototypes, NASA equipment, and cipher machines.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Art & Antiquities",
      icon: "🎨",
      description: "Authenticated Impressionist, Modern, and Contemporary masterworks with proven provenance.",
      image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Rare Jewelry",
      icon: "💎",
      description: "GIA certified fancy vivid colored diamonds, unheated Burmese rubies, and historic royal jewels.",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Real Estate",
      icon: "🏛️",
      description: "Prime beachfront estates, European historic châteaux, and private island parcels.",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-widest">
          <Layers className="w-4 h-4" />
          <span>Curated Disciplines</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950">
          Auction Lot Categories
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Each asset class on BidZone is vetted by accredited category specialists, certified appraisers, and legal provenance researchers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryList.map((cat) => {
          const matchingLots = auctions.filter((a) => a.category === cat.name);
          return (
            <Link
              key={cat.name}
              href={`/auctions?category=${encodeURIComponent(cat.name)}`}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-400 transition-all flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden bg-slate-900">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-900 flex items-center space-x-1.5 shadow-sm">
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </div>
                <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg text-white text-xs font-mono font-bold">
                  {matchingLots.length} Active Lots
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-black text-lg text-slate-900 group-hover:text-blue-600 transition flex items-center justify-between">
                    <span>{cat.name}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span>Browse {cat.name} catalog</span>
                  <span>Explore →</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

