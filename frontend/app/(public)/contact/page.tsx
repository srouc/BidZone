"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, Clock } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 w-full">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950">
          Client Concierge & Escrow Desk
        </h1>
        <p className="text-sm text-slate-600">
          Need assistance with lot consignments, institutional KYC, wire transfers, or escrow inspection disputes? Our dedicated private specialists are available 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          {submitted ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Message Received</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you for contacting BidZone Concierge. A senior auction officer will review your dossier and respond within 2 business hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Full Name</label>
                  <input
                    required
                    type="text"
                    defaultValue="Alexander Vance"
                    placeholder="e.g. Lord Sterling"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Address</label>
                  <input
                    required
                    type="email"
                    defaultValue="alexander.vance@investments.com"
                    placeholder="name@domain.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Inquiry Department</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500 bg-white">
                  <option>Private Consignment Appraisal (Selling)</option>
                  <option>Live Bidding Limit & Institutional KYC</option>
                  <option>Escrow Vault & Wire Transfer Custody</option>
                  <option>Inspection & White-Glove Logistics</option>
                  <option>Press & Media Inquiries</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Lot Number or Reference (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Lot #101 – 1967 Shelby GT500"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Your Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detail your request, consignment details, or escrow inquiry..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit to Concierge Desk</span>
              </button>
            </form>
          )}
        </div>

        {/* Global Hubs & Direct Lines (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-4 shadow-xl">
            <h3 className="font-black text-lg text-white">Private Client Desks</h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Zurich FreePort Vault (EU/CH)</strong>
                  <span>Route du Grand-Lancy 6, 1227 Les Acacias, Geneva, Switzerland</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">New York Gallery & Auction Floor (US)</strong>
                  <span>450 Park Avenue, 18th Floor, New York, NY 10022</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">London Mayfair Office (UK)</strong>
                  <span>34 Old Bond Street, Mayfair, London W1S 2AA</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className="font-mono font-bold">+1 (800) 592-2439 (Toll Free 24/7)</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="font-mono">concierge@bidzone.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

