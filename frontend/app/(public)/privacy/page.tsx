import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Lock } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <Link href="/" className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:underline mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950">
          Privacy & Institutional KYC Policy
        </h1>
        <p className="text-xs text-slate-500">
          Compliant with Swiss Federal Data Protection Act (FADP) and GDPR Standards.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h3 className="font-black text-slate-900 text-base">1. KYC Data Encapsulation</h3>
          <p>
            Passports, national ID cards, and corporate beneficial ownership documents uploaded during verification are encrypted at rest with AES-256 and stored exclusively on secure HSMs (Hardware Security Modules) physically located within Swiss data centers.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-black text-slate-900 text-base">2. Bidder Pseudonymity in Public Arenas</h3>
          <p>
            To protect high-net-worth individual privacy, bids displayed in the public live arena ledger are pseudonymous (e.g. Collector_TX_99 or GenevaWatchClub). Your true identity is disclosed solely to the escrow fiduciary executing physical delivery.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-black text-slate-900 text-base">3. Financial Escrow Confidentiality</h3>
          <p>
            Bank routing numbers, SWIFT transmissions, and escrow balances are never sold, shared, or indexed by third-party search engines or analytics networks.
          </p>
        </section>
      </div>
    </div>
  );
}

