import React from "react";
import Link from "next/link";
import { 
  Gavel, 
  ShieldCheck, 
  Clock, 
  Lock, 
  CheckCircle2, 
  Zap, 
  HelpCircle,
  ArrowRight,
  TrendingUp,
  FileText
} from "lucide-react";

export default function HowItWorksPage() {
  const faqs = [
    {
      q: "How does Anti-Sniping (Soft Close) work?",
      a: "If any bid is received within the final 2 minutes (120 seconds) of an auction lot, the countdown clock automatically resets back to 2 minutes. This anti-sniping window continues extending until 2 full minutes pass without any further bids, ensuring automated sniping bots cannot steal lots from human bidders at the last second."
    },
    {
      q: "What is Max Proxy Bidding?",
      a: "Max Proxy Bidding allows you to submit the maximum amount you are willing to pay for a lot. The system automatically places the lowest necessary increment on your behalf to maintain your lead against competing bids, never exceeding your ceiling. If someone outbids your maximum, you receive an immediate alert."
    },
    {
      q: "How does Escrow Custody protect the buyer?",
      a: "When an auction closes, your payment is placed into an independent, licensed financial escrow custody account (such as Zurich FreePort or US Escrow partners). Funds are never transferred to the seller until you receive the item, complete the allocated inspection window (typically 3–14 days), and verify authenticity."
    },
    {
      q: "What is the Buyer's Premium?",
      a: "The buyer's premium is an administrative fee calculated as a percentage of the final hammer price (typically between 3.5% and 8% depending on the asset class). It is clearly stated on each lot detail page and funds insurance, authentication, and secure escrow custody."
    },
    {
      q: "Can I consign an item for auction as a seller?",
      a: "Yes. Consignors can submit luxury lots via the Seller Studio. Every item undergoes physical inspection, provenance certification, and serial number validation by BidZone curators before going live."
    }
  ];

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 w-full">
      {/* 1. Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>The Institutional Auction Standard</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight">
          How Bidding on BidZone Works
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Designed from the ground up for high-value collectors and institutions. Built around fairness, real-time technology, and total escrow security.
        </p>
      </div>

      {/* 2. Three Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-900">1. Instant Proxy Bidding</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Set your top dollar and let our high-frequency bidding engine automatically defend your position. The engine bids only what is necessary to beat competing bidders by one increment.
          </p>
          <ul className="space-y-2 text-xs text-slate-600 pt-2 font-medium">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Automated minimal increment advancement</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Instant mobile & browser outbid alerts</span>
            </li>
          </ul>
        </div>

        <div id="anti-sniping" className="bg-white rounded-3xl p-8 border-2 border-red-200 shadow-sm space-y-4 relative">
          <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">
            Fair Play Rule
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-900">2. Anti-Sniping (+120s)</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            BidZone eliminates last-second script bot sniping. If any bid lands with under 2 minutes remaining on the clock, the lot timer automatically extends by an additional 120 seconds.
          </p>
          <ul className="space-y-2 text-xs text-slate-600 pt-2 font-medium">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Ensures human collectors always have time to respond</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Protects sellers from below-market snipe steals</span>
            </li>
          </ul>
        </div>

        <div id="escrow" className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-900">3. Escrow Custody Vault</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Payment never touches the seller until you hold the item in your hands, conduct an independent physical inspection, and grant final disbursement approval.
          </p>
          <ul className="space-y-2 text-xs text-slate-600 pt-2 font-medium">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>3 to 30 day physical inspection windows</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>White-glove insured armoring & logistics</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. Step-by-Step Interactive Workflow */}
      <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white space-y-8">
        <div className="max-w-xl space-y-2">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Complete Journey</span>
          <h2 className="text-3xl font-black">From Registration to Delivery</h2>
          <p className="text-xs text-slate-400">Everything you need to know about participating in a BidZone auction event.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
            <div className="text-blue-400 font-mono font-black text-xl">STEP 01</div>
            <h4 className="font-bold text-base">KYC Verification</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verify your passport or corporate entity documents in under 2 minutes to unlock verified bidding rights.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
            <div className="text-blue-400 font-mono font-black text-xl">STEP 02</div>
            <h4 className="font-bold text-base">Collateral Deposit</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fund your refundable Escrow Collateral balance. Enjoy up to 3x leveraged bidding power across active live lots.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
            <div className="text-blue-400 font-mono font-black text-xl">STEP 03</div>
            <h4 className="font-bold text-base">Live Arena Bidding</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compete directly in the live arena using 1-click increment buttons or let automatic proxy bidding defend your lead.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
            <div className="text-blue-400 font-mono font-black text-xl">STEP 04</div>
            <h4 className="font-bold text-base">Escrow Handover</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inspect your acquired asset. Once verified, release escrow funds with one tap or request full arbitration.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Frequently Asked Questions */}
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500">Key auction procedures, legal obligations, and escrow guidelines.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2 shadow-sm">
              <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

