import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, FileText, Lock } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <Link href="/" className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:underline mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950">
          Auction Marketplace Rules & Escrow Terms
        </h1>
        <p className="text-xs text-slate-500">
          Last revised: January 2026 • Governing Protocol: BidZone Enterprise Settlement Standard v2.4
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h3 className="font-black text-slate-900 text-base">1. Binding Nature of Bids</h3>
          <p>
            Every bid submitted on BidZone constitutes an irrevocable, legally binding offer to purchase the consigned lot at the specified amount plus the applicable Buyer's Premium. Retraction of bids is strictly prohibited once logged into the bidding ledger.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-black text-slate-900 text-base">2. Anti-Sniping (Soft Close) Protocol</h3>
          <p>
            To maintain equal opportunity and prevent algorithmic sniping, any bid received within 120 seconds of the scheduled auction termination will automatically extend the lot timer by an additional 120 seconds. The auction will conclude only after 120 seconds pass without any further bids.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-black text-slate-900 text-base">3. Escrow Custody & Inspection Periods</h3>
          <p>
            All winning hammer funds are held in segregated client escrow vaults (Zurich FreePort / FINMA accredited partner fiduciary accounts). Funds are not released to the consignor until the buyer's specified inspection window (3 to 30 days depending on the asset class) has expired without dispute.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-black text-slate-900 text-base">4. Anti-Shill & Bidder Integrity Guarantee</h3>
          <p>
            Consignors, their family members, employees, or affiliated corporate entities are strictly barred from bidding on their own lots. Automated cross-referencing of IP addresses, KYC records, and device fingerprints is continuously executed. Violations result in immediate asset forfeiture and permanent bans.
          </p>
        </section>
      </div>
    </div>
  );
}

