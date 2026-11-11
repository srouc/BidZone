"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  PlusCircle, 
  ArrowLeft, 
  ShieldCheck, 
  DollarSign, 
  Image as ImageIcon, 
  FileText, 
  Truck, 
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { useAuction } from "@/lib/auction-context";
import { AuctionCategory, ItemCondition } from "@/types/auction";

export default function CreateAuctionPage() {
  const router = useRouter();
  const { createAuction } = useAuction();

  // Form State
  const [step, setStep] = useState<number>(1);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<AuctionCategory>("Vehicles");
  const [subcategory, setSubcategory] = useState("Collector Sport");
  const [condition, setCondition] = useState<ItemCondition>("Brand New / Mint");
  const [description, setDescription] = useState("");
  const [provenance, setProvenance] = useState("");

  const [startingBid, setStartingBid] = useState<string>("50000");
  const [reservePrice, setReservePrice] = useState<string>("75000");
  const [minIncrement, setMinIncrement] = useState<string>("2500");
  const [estimatedLow, setEstimatedLow] = useState<string>("70000");
  const [estimatedHigh, setEstimatedHigh] = useState<string>("95000");

  const [featuredImage, setFeaturedImage] = useState(
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
  );
  const [shippingOrigin, setShippingOrigin] = useState("Scottsdale, Arizona, USA");
  const [inspectionDays, setInspectionDays] = useState<number>(5);
  const [deliveryMethod, setDeliveryMethod] = useState("Insured White-Glove Escrow Carrier");

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const createdLot = createAuction({
      title: title || "Rare Collector Lot",
      category,
      subcategory,
      condition,
      description: description || "Consigned authenticated asset with complete inspection records.",
      provenance: provenance || "Direct from private estate with original paperwork.",
      startingBid: Number(startingBid),
      currentBid: Number(startingBid),
      reservePrice: Number(reservePrice),
      minIncrement: Number(minIncrement),
      estimatedLow: Number(estimatedLow),
      estimatedHigh: Number(estimatedHigh),
      featuredImage: featuredImage || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      images: [featuredImage || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"],
      shippingOrigin,
      inspectionPeriodDays: inspectionDays,
      deliveryMethod,
    });

    router.push(`/auctions/${createdLot.id}`);
  };

  return (
    <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
            <PlusCircle className="w-4 h-4" />
            <span>Consignor Lot Wizard</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950">
            Consign an Auction Lot
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            List high-value collector assets with institutional escrow custody and live anti-sniping protection.
          </p>
        </div>

        <Link
          href="/seller/dashboard"
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Seller Studio</span>
        </Link>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between max-w-xl mx-auto text-xs font-bold text-slate-500">
        <button
          onClick={() => setStep(1)}
          className={`flex items-center space-x-1.5 ${step === 1 ? "text-blue-600" : ""}`}
        >
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
            step === 1 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"
          }`}>
            1
          </span>
          <span>Asset Details</span>
        </button>

        <div className="h-0.5 w-12 bg-slate-200"></div>

        <button
          onClick={() => setStep(2)}
          className={`flex items-center space-x-1.5 ${step === 2 ? "text-blue-600" : ""}`}
        >
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
            step === 2 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"
          }`}>
            2
          </span>
          <span>Valuation & Reserve</span>
        </button>

        <div className="h-0.5 w-12 bg-slate-200"></div>

        <button
          onClick={() => setStep(3)}
          className={`flex items-center space-x-1.5 ${step === 3 ? "text-blue-600" : ""}`}
        >
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
            step === 3 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"
          }`}>
            3
          </span>
          <span>Escrow & Launch</span>
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <form onSubmit={handlePublish} className="space-y-6">
          {/* STEP 1: ASSET DETAILS */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="font-black text-lg text-slate-900">Step 1: Item & Provenance</h3>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Lot Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 1973 Porsche 911 Carrera RS 2.7 Lightweight"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Discipline Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AuctionCategory)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500 bg-white"
                  >
                    <option>Vehicles</option>
                    <option>Fine Watches</option>
                    <option>Tech & Artifacts</option>
                    <option>Art & Antiquities</option>
                    <option>Rare Jewelry</option>
                    <option>Real Estate</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Item Condition Grade</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as ItemCondition)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500 bg-white"
                  >
                    <option>Brand New / Mint</option>
                    <option>Pristine Grade 10</option>
                    <option>Excellent Vintage</option>
                    <option>Restored Collector</option>
                    <option>Used Good</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Detailed Description</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide history, matching serials, certificates, restorations, and mechanical health..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Documented Provenance / Registry</label>
                <input
                  type="text"
                  value={provenance}
                  onChange={(e) => setProvenance(e.target.value)}
                  placeholder="e.g. Registered in factory registry #1084, 1 private owner for past 30 years"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
                >
                  Continue to Valuation →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: VALUATION */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="font-black text-lg text-slate-900">Step 2: Pricing, Reserve & Bidding Increments</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Starting Bid (USD)</label>
                  <input
                    type="number"
                    required
                    value={startingBid}
                    onChange={(e) => setStartingBid(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold font-mono outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Secret Reserve Price (USD)</label>
                  <input
                    type="number"
                    required
                    value={reservePrice}
                    onChange={(e) => setReservePrice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold font-mono outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400">Lot will not sell below this confidential threshold.</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Minimum Bid Increment (USD)</label>
                  <input
                    type="number"
                    required
                    value={minIncrement}
                    onChange={(e) => setMinIncrement(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold font-mono outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Auction House Estimate Range</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Low"
                      value={estimatedLow}
                      onChange={(e) => setEstimatedLow(e.target.value)}
                      className="w-1/2 px-4 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                    />
                    <span>–</span>
                    <input
                      type="number"
                      placeholder="High"
                      value={estimatedHigh}
                      onChange={(e) => setEstimatedHigh(e.target.value)}
                      className="w-1/2 px-4 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
                >
                  Continue to Escrow & Launch →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: MEDIA, ESCROW & LAUNCH */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="font-black text-lg text-slate-900">Step 3: Imagery, Escrow & Launch</h3>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Featured Image URL</label>
                <input
                  type="url"
                  required
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500"
                />
              </div>

              {featuredImage && (
                <div className="h-44 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img src={featuredImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Shipping Origin Location</label>
                  <input
                    type="text"
                    required
                    value={shippingOrigin}
                    onChange={(e) => setShippingOrigin(e.target.value)}
                    placeholder="City, State / Country"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Buyer Inspection Window</label>
                  <select
                    value={inspectionDays}
                    onChange={(e) => setInspectionDays(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500 bg-white"
                  >
                    <option value={3}>3 Business Days (Standard Collectibles)</option>
                    <option value={5}>5 Business Days (Vehicles & Watches)</option>
                    <option value={7}>7 Business Days (Fine Art & Antiquities)</option>
                    <option value={14}>14 Business Days (Complex Machinery / Real Estate)</option>
                  </select>
                </div>
              </div>

              {/* Escrow guarantee disclaimer */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block">Guaranteed Settlement Guarantee</strong>
                  <span>
                    When the hammer falls above your reserve price, buyer funds are secured immediately in Zurich FreePort Escrow. Payouts disburse directly to your wire account upon inspection completion.
                  </span>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
                >
                  ← Back
                </button>

                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-xl shadow-blue-500/20 transition flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch Live Auction Lot Now</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

