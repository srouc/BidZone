"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Gavel, Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="py-16 max-w-md mx-auto px-4 sm:px-6 w-full space-y-8">
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
            <Gavel className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-slate-950 font-display">
            Bid<span className="text-blue-600">Zone</span>
          </span>
        </Link>
        <h1 className="text-2xl font-black text-slate-900">Reset your password</h1>
        <p className="text-xs text-slate-500">Enter your email address to receive password recovery instructions.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        {sent ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Check your inbox</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We have dispatched an authenticated recovery key to <strong className="text-slate-900">{email}</strong>.
            </p>
            <Link
              href="/login"
              className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Account Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-1.5"
            >
              <span>Send Recovery Link</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-500 mt-6">
          Remembered your credentials?{" "}
          <Link href="/login" className="font-bold text-blue-600 hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

