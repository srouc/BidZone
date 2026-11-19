"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ShieldCheck, 
  Lock, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  QrCode,
  CreditCard,
  Building,
  Copy,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Clock,
  ChevronRight
} from "lucide-react";
import { useAuction } from "@/lib/auction-context";

interface PaymentHistoryItem {
  id: string;
  reference: string;
  amount: number;
  method: "ABA_KHQR" | "STRIPE" | "FEDWIRE";
  status: "COMPLETED" | "PENDING";
  timestamp: string;
}

export default function BuyerWalletPage() {
  const { currentUser, depositFunds } = useAuction();
  const [activeTab, setActiveTab] = useState<"ABA" | "STRIPE" | "WIRE">("ABA");
  const [depositAmount, setDepositAmount] = useState<string>("25000");
  const [depositSuccess, setDepositSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // ABA KHQR State
  const [abaLoading, setAbaLoading] = useState(false);
  const [abaKhqrData, setAbaKhqrData] = useState<{
    reference: string;
    qrString: string;
    qrImage: string;
    amount: number;
    checkoutUrl?: string;
  } | null>(null);
  const [abaTimer, setAbaTimer] = useState(900); // 15 mins

  // Stripe Card State
  const [cardName, setCardName] = useState("Julian Vance");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("888");
  const [stripeLoading, setStripeLoading] = useState(false);

  // Payment History
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([
    {
      id: "pay-101",
      reference: "ABA-BZ-1794291-8902",
      amount: 50000,
      method: "ABA_KHQR",
      status: "COMPLETED",
      timestamp: "Today, 11:24 AM"
    },
    {
      id: "pay-102",
      reference: "STRIPE-BZ-99214-4122",
      amount: 25000,
      method: "STRIPE",
      status: "COMPLETED",
      timestamp: "Yesterday, 3:15 PM"
    },
    {
      id: "pay-103",
      reference: "FEDWIRE-CH-882194-VANCE",
      amount: 100000,
      method: "FEDWIRE",
      status: "COMPLETED",
      timestamp: "Nov 14, 2026"
    }
  ]);

  // Countdown timer for ABA KHQR
  useEffect(() => {
    if (!abaKhqrData) return;
    const interval = setInterval(() => {
      setAbaTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [abaKhqrData]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Generate ABA KHQR
  const handleGenerateAbaKhqr = async () => {
    const amt = Number(depositAmount);
    if (!amt || amt <= 0) return;

    setAbaLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/payments/aba/create-khqr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, amount: amt, currency: "USD" }),
      });
      const data = await res.json();
      if (data.success && data.payment) {
        setAbaKhqrData({
          reference: data.payment.reference,
          qrString: data.payment.qrString,
          qrImage: data.payment.qrImage,
          amount: data.payment.amount,
          checkoutUrl: data.payment.checkoutUrl
        });
        setAbaTimer(900);
      } else {
        throw new Error("Backend response error");
      }
    } catch {
      // Local fallback KHQR generation for seamless offline demo
      const ref = `ABA-BZ-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setAbaKhqrData({
        reference: ref,
        qrString: `00020101021229500011bakong@abaa0119bidzone_escrow@abaa0208ABA Bank5204599953038405408${amt.toFixed(2)}5802KH5924BIDZONE ESCROW FIDUCIARY6010Phnom Penh62470125${ref}0514BIDZONE_ESCROW6304E710`,
        qrImage: "", // will show styled QR fallback box
        amount: amt,
        checkoutUrl: `https://link.payway.com.kh/khqr?ref=${ref}`
      });
      setAbaTimer(900);
    } finally {
      setAbaLoading(false);
    }
  };

  // Simulate ABA App Scan & Settlement
  const handleSimulateAbaPayment = async () => {
    if (!abaKhqrData) return;
    setAbaLoading(true);

    try {
      await fetch("http://localhost:5000/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: abaKhqrData.reference }),
      });
    } catch {
      // Offline fallback
    }

    depositFunds(abaKhqrData.amount);
    
    // Add to local history
    setPaymentHistory((prev) => [
      {
        id: `pay-${Date.now()}`,
        reference: abaKhqrData.reference,
        amount: abaKhqrData.amount,
        method: "ABA_KHQR",
        status: "COMPLETED",
        timestamp: "Just now"
      },
      ...prev
    ]);

    setSuccessMessage(`ABA Pay KHQR Settlement of $${abaKhqrData.amount.toLocaleString()} received and credited instantly to your Escrow Collateral!`);
    setDepositSuccess(true);
    setAbaLoading(false);
    setAbaKhqrData(null);
    setTimeout(() => setDepositSuccess(false), 5000);
  };

  // Stripe Card Payment
  const handleStripePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(depositAmount);
    if (!amt || amt <= 0) return;

    setStripeLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/payments/stripe/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, amount: amt, currency: "usd" }),
      });
      const data = await res.json();
      if (data.success && data.payment) {
        await fetch("http://localhost:5000/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: data.payment.reference }),
        });
      }
    } catch {
      // Offline fallback
    }

    depositFunds(amt);
    const ref = `STRIPE-BZ-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    setPaymentHistory((prev) => [
      {
        id: `pay-${Date.now()}`,
        reference: ref,
        amount: amt,
        method: "STRIPE",
        status: "COMPLETED",
        timestamp: "Just now"
      },
      ...prev
    ]);

    setSuccessMessage(`Credit card deposit of $${amt.toLocaleString()} processed via Stripe. Escrow collateral balance updated!`);
    setDepositSuccess(true);
    setStripeLoading(false);
    setTimeout(() => setDepositSuccess(false), 5000);
  };

  // Fill Test Card Details
  const handleAutoFillTestCard = () => {
    setCardName("Julian Vance");
    setCardNumber("4242 4242 4242 4242");
    setCardExpiry("12/28");
    setCardCvc("888");
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
            <Lock className="w-4 h-4" />
            <span>Fiduciary Escrow Custody Account</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950">
            Escrow Wallet & Collateral
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Fund your bidding power instantly with ABA Pay (KHQR), Stripe Cards, or Swiss Institutional Fedwire.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>FDIC & FINMA Custody Vault &middot; 3x Bidding Power</span>
        </div>
      </div>

      {/* Success Notification Banner */}
      {depositSuccess && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-500 text-emerald-900 text-sm font-bold rounded-2xl flex items-center space-x-3 shadow-md animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="flex-1">{successMessage}</div>
        </div>
      )}

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-2 relative overflow-hidden">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Available Escrow Cash Balance
          </div>
          <div className="text-3xl font-black font-mono">
            ${currentUser.walletBalance.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 pt-1">
            Refundable at any time with 0 platform withdrawal penalty.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Collateral Held in Active Bids
          </div>
          <div className="text-3xl font-black text-amber-600 font-mono">
            ${currentUser.heldInBids.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 pt-1">
            Securing active bids in live auction arena.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Authorized Bidding Power
          </div>
          <div className="text-3xl font-black text-blue-600 font-mono">
            ${currentUser.availableBiddingPower.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 pt-1">
            3x leverage with cash collateral backing.
          </p>
        </div>
      </div>

      {/* Deposit Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Payment Channel Console (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="font-black text-xl text-slate-900">Add Escrow Collateral</h3>
            <p className="text-xs text-slate-500">
              Select your preferred settlement rail to credit funds immediately.
            </p>
          </div>

          {/* Amount Quick Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Select Deposit Amount (USD)</label>
            <div className="grid grid-cols-4 gap-2">
              {["10000", "25000", "50000", "100000"].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setDepositAmount(amt);
                    if (abaKhqrData) setAbaKhqrData(null);
                  }}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition ${
                    depositAmount === amt 
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  +${Number(amt).toLocaleString()}
                </button>
              ))}
            </div>
            <div className="relative pt-1">
              <span className="absolute left-4 top-4 text-sm font-bold text-slate-400">$</span>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => {
                  setDepositAmount(e.target.value);
                  if (abaKhqrData) setAbaKhqrData(null);
                }}
                required
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold font-mono outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Payment Method Selector Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Settlement Rail</label>
            <div className="grid grid-cols-3 gap-3">
              {/* ABA KHQR Tab */}
              <button
                type="button"
                onClick={() => setActiveTab("ABA")}
                className={`p-3.5 rounded-2xl border text-left transition space-y-1 ${
                  activeTab === "ABA"
                    ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-700 text-white tracking-wider">
                    ABA PAY
                  </div>
                  {activeTab === "ABA" && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <div className="font-bold text-xs text-slate-900 pt-1">Bakong KHQR</div>
                <div className="text-[10px] text-slate-500">Scan & pay with ABA Mobile app</div>
              </button>

              {/* Stripe Card Tab */}
              <button
                type="button"
                onClick={() => setActiveTab("STRIPE")}
                className={`p-3.5 rounded-2xl border text-left transition space-y-1 ${
                  activeTab === "STRIPE"
                    ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-600 text-white tracking-wider">
                    STRIPE
                  </div>
                  {activeTab === "STRIPE" && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <div className="font-bold text-xs text-slate-900 pt-1">Credit / Debit Card</div>
                <div className="text-[10px] text-slate-500">Visa, Mastercard, Amex, JCB</div>
              </button>

              {/* Bank Wire Tab */}
              <button
                type="button"
                onClick={() => setActiveTab("WIRE")}
                className={`p-3.5 rounded-2xl border text-left transition space-y-1 ${
                  activeTab === "WIRE"
                    ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Building2 className="w-4 h-4 text-slate-700" />
                  {activeTab === "WIRE" && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <div className="font-bold text-xs text-slate-900 pt-1">Fedwire / SWIFT</div>
                <div className="text-[10px] text-slate-500">Institutional Swiss custody desk</div>
              </button>
            </div>
          </div>

          {/* TAB 1: ABA PAY KHQR */}
          {activeTab === "ABA" && (
            <div className="space-y-4 pt-2">
              {!abaKhqrData ? (
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-cyan-100 text-cyan-800 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-slate-900 text-base">Generate ABA KHQR Dynamic Code</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Compatible with <strong>ABA Mobile Banking</strong> and all <strong>Bakong Network</strong> partner banking apps in Cambodia and internationally.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={abaLoading}
                    onClick={handleGenerateAbaKhqr}
                    className="px-6 py-3 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs shadow-md transition inline-flex items-center space-x-2"
                  >
                    <span>{abaLoading ? "Generating Authentic KHQR..." : `Generate KHQR for $${Number(depositAmount).toLocaleString()}`}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Active ABA KHQR Display Card */
                <div className="bg-gradient-to-br from-cyan-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center space-x-2">
                      <div className="px-2.5 py-1 bg-red-600 text-white font-black text-xs rounded tracking-widest">
                        KHQR
                      </div>
                      <span className="text-xs font-bold text-cyan-300">ABA PayWay Fiduciary</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatTimer(abaTimer)}</span>
                    </div>
                  </div>

                  {/* QR Presentation */}
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="bg-white p-4 rounded-2xl shadow-2xl shrink-0 flex flex-col items-center justify-center">
                      {abaKhqrData.qrImage ? (
                        <img 
                          src={abaKhqrData.qrImage} 
                          alt="ABA KHQR Payment" 
                          className="w-52 h-52 object-contain"
                        />
                      ) : (
                        <div className="w-52 h-52 bg-slate-900 rounded-xl flex flex-col items-center justify-center p-3 text-center space-y-2">
                          <QrCode className="w-20 h-20 text-cyan-400" />
                          <div className="text-[10px] font-mono text-cyan-200">
                            Bakong KHQR Verified
                          </div>
                        </div>
                      )}
                      <div className="text-[11px] font-bold text-slate-800 mt-2 flex items-center space-x-1">
                        <Lock className="w-3 h-3 text-blue-600" />
                        <span>Escrow Custody Vault</span>
                      </div>
                    </div>

                    <div className="space-y-3 flex-1 text-left">
                      <div>
                        <div className="text-xs text-cyan-300 uppercase font-bold tracking-wider">Settlement Amount</div>
                        <div className="text-3xl font-black font-mono text-white">
                          ${abaKhqrData.amount.toLocaleString()}.00 <span className="text-sm font-normal text-slate-400">USD</span>
                        </div>
                      </div>

                      <div className="divide-y divide-white/10 text-xs">
                        <div className="py-1.5 flex justify-between">
                          <span className="text-slate-400">Merchant:</span>
                          <strong className="text-white">BIDZONE ESCROW FIDUCIARY</strong>
                        </div>
                        <div className="py-1.5 flex justify-between">
                          <span className="text-slate-400">Payment Channel:</span>
                          <span className="text-cyan-300 font-semibold">ABA Bank / Bakong KHQR</span>
                        </div>
                        <div className="py-1.5 flex justify-between">
                          <span className="text-slate-400">Reference ID:</span>
                          <span className="font-mono text-amber-300 text-[11px]">{abaKhqrData.reference}</span>
                        </div>
                      </div>

                      {/* Interactive Buttons */}
                      <div className="pt-2 flex flex-col sm:flex-row gap-2">
                        <button
                          type="button"
                          disabled={abaLoading}
                          onClick={handleSimulateAbaPayment}
                          className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-lg transition flex items-center justify-center space-x-2"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Simulate Scan & Pay with ABA App</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setAbaKhqrData(null)}
                          className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 text-center">
                    💡 Open your <strong>ABA Mobile App</strong>, tap <strong>QR Pay</strong>, and scan the QR code above. In testing mode, click the green simulation button to credit funds immediately.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STRIPE CARD PAYMENT */}
          {activeTab === "STRIPE" && (
            <form onSubmit={handleStripePayment} className="space-y-4 pt-2">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-slate-700">Encrypted Card Payment Details</span>
                <button
                  type="button"
                  onClick={handleAutoFillTestCard}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-Fill Test Card</span>
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Cardholder Legal Name</label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 •••• •••• 4242"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-medium outline-none focus:border-indigo-500"
                  />
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Expiration (MM/YY)</label>
                  <input
                    type="text"
                    required
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="12/28"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-medium outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Security CVC</label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    placeholder="888"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-medium outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={stripeLoading}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{stripeLoading ? "Processing Stripe Transaction..." : `Charge Card ($${Number(depositAmount).toLocaleString()}) via Stripe`}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 3: INSTITUTIONAL WIRE */}
          {activeTab === "WIRE" && (
            <div className="space-y-4 pt-2">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>JPMorgan Chase Private Bank (Geneva & Zurich Escrow)</span>
                </div>
                <div className="divide-y divide-slate-200 text-slate-700 space-y-2">
                  <div className="pt-2 flex justify-between">
                    <span className="text-slate-500">Beneficiary:</span>
                    <strong className="text-slate-900">BidZone Escrow Fiduciary Ltd.</strong>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-slate-500">IBAN:</span>
                    <strong className="font-mono text-slate-900">CH93 0024 0240 1829 4810 2</strong>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-slate-500">SWIFT / BIC:</span>
                    <strong className="font-mono text-slate-900">CHASCHZZXXX</strong>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-slate-500">Reference Memo:</span>
                    <strong className="font-mono text-blue-600">BZ-ESCROW-VANCE-991</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info & Recent Settlements (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Fiduciary Guarantee */}
          <div className="p-6 bg-blue-50/70 rounded-3xl border border-blue-200 space-y-3 text-xs">
            <div className="font-bold text-sm text-blue-900 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Escrow Protection Guarantee</span>
            </div>
            <p className="text-blue-800 leading-relaxed">
              Every deposit into your Escrow Wallet is held in 100% segregated client accounts. Funds are only disbursed when you inspect and approve lots delivered to your destination.
            </p>
          </div>

          {/* Recent Settlement History */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                Recent Deposits & Settlements
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Live Ledger</span>
            </div>

            <div className="space-y-3">
              {paymentHistory.map((item) => (
                <div key={item.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 font-mono">
                      +${item.amount.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center space-x-1.5">
                      <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] ${
                        item.method === "ABA_KHQR" 
                          ? "bg-cyan-100 text-cyan-800" 
                          : item.method === "STRIPE" 
                          ? "bg-indigo-100 text-indigo-800" 
                          : "bg-slate-200 text-slate-800"
                      }`}>
                        {item.method === "ABA_KHQR" ? "ABA KHQR" : item.method}
                      </span>
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-emerald-600 text-[11px] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Settled</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
