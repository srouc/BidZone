import React from "react";
import Link from "next/link";
import { Gavel, ShieldCheck, Lock, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-12 text-sm text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-slate-100">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Gavel className="w-4 h-4" />
              </div>
              <span className="text-xl font-black text-slate-950 font-display">
                Bid<span className="text-blue-600">Zone</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              BidZone is the enterprise online auction marketplace engineered for rare luxury automobiles, haute horlogerie, historical technology, and fine art. Protected by bank-grade escrow custody and real-time anti-sniping bidding engines.
            </p>
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <span className="inline-flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit Escrow Vault</span>
              </span>
              <span>•</span>
              <span className="inline-flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Verified Provenance</span>
              </span>
            </div>
          </div>

          {/* Column 1: Marketplace */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Marketplace</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/auctions" className="hover:text-blue-600 transition">All Lots</Link></li>
              <li><Link href="/auctions?status=live" className="text-red-600 font-semibold hover:underline">🔴 Live Now</Link></li>
              <li><Link href="/categories" className="hover:text-blue-600 transition">Categories</Link></li>
              <li><Link href="/how-it-works" className="hover:text-blue-600 transition">How to Bid</Link></li>
              <li><Link href="/how-it-works#anti-sniping" className="hover:text-blue-600 transition">Anti-Sniping Rules</Link></li>
            </ul>
          </div>

          {/* Column 2: Dashboards */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Dashboards</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/buyer/dashboard" className="hover:text-blue-600 transition">Buyer Portal</Link></li>
              <li><Link href="/seller/dashboard" className="hover:text-blue-600 transition">Seller Studio</Link></li>
              <li><Link href="/seller/create" className="hover:text-blue-600 transition">Consign Lot</Link></li>
              <li><Link href="/escrow/dashboard" className="hover:text-blue-600 transition">Escrow Vault</Link></li>
              <li><Link href="/admin/dashboard" className="hover:text-blue-600 transition">Admin Console</Link></li>
            </ul>
          </div>

          {/* Column 3: Trust & Company */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Trust & Security</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about" className="hover:text-blue-600 transition">About BidZone</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 transition">Support & Concierge</Link></li>
              <li><Link href="/how-it-works#escrow" className="hover:text-blue-600 transition">Escrow Custody FAQ</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600 transition">Auction Rules</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-600 transition">Privacy & KYC Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            © 2026 BidZone Auction Marketplace Inc. All international rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>All Systems Operational</span>
            </span>
            <span>•</span>
            <span>Escrow API v2.4</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

