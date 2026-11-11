import React from "react";
import Link from "next/link";
import { Gavel, ShieldCheck, Award, Users, Globe, Lock, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 w-full">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
          <Award className="w-3.5 h-3.5" />
          <span>The BidZone Heritage</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight">
          Pioneering the Next Era of Luxury & Collector Auctions
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Founded by vintage automotive curators, horology historians, and cryptographic security engineers, BidZone was built to replace opaque, fee-heavy traditional auction houses with a real-time, bank-secured digital marketplace.
        </p>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-1 shadow-sm">
          <div className="text-3xl font-black text-slate-950 font-mono">$18.4M+</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Hammer Volume</div>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-1 shadow-sm">
          <div className="text-3xl font-black text-blue-600 font-mono">100%</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Escrow Custody Backed</div>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-1 shadow-sm">
          <div className="text-3xl font-black text-emerald-600 font-mono">38+</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Countries Represented</div>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-1 shadow-sm">
          <div className="text-3xl font-black text-slate-950 font-mono">0%</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Shill Bidding Tolerance</div>
        </div>
      </div>

      {/* Leadership & Curator Vision */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Institutional Integrity</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">Why Collectors Choose BidZone</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Legacy auction houses take up to 25% buyer fees, delay disbursements for months, and provide minimal transparency into who is bidding against you. BidZone charges flat fees starting at 3.5%, guarantees independent financial escrow, and provides verifiable anti-sniping protection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <h4 className="font-bold text-slate-900 text-base">Provenance Authenticity</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every vehicle, watch, work of art, or tech artifact is verified with certificates of authenticity, registry lookups, and third-party inspection reports.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <Lock className="w-6 h-6 text-emerald-600" />
            <h4 className="font-bold text-slate-900 text-base">Zurich & US Escrow Vaults</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Payments are held in segregated client escrow vaults. Neither the buyer nor the seller takes settlement risk until physical inspection concludes.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <Globe className="w-6 h-6 text-purple-600" />
            <h4 className="font-bold text-slate-900 text-base">Global White-Glove Logistics</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Partnered with Ferrari-certified enclosed carriers, Malca-Amit armored couriers, and temperature-controlled fine art freight networks worldwide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

