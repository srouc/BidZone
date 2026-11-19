"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Gavel, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  UserCheck, 
  Building, 
  Mail, 
  KeyRound, 
  ArrowLeft, 
  RefreshCw,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { useAuction } from "@/lib/auction-context";

export default function RegisterPage() {
  const router = useRouter();
  const { switchRole } = useAuction();
  
  // Step state: 1 = Form Details, 2 = Email OTP Verification, 3 = Success
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [accountType, setAccountType] = useState<"BUYER" | "SELLER">("BUYER");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("United States");
  const [agreed, setAgreed] = useState(false);
  
  // OTP state
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [previewOtp, setPreviewOtp] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(600); // 10 minutes
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (step !== 2) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Step 1: Submit Details & Request OTP
  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert("Please agree to the Auction Marketplace Rules and Escrow Terms.");
      return;
    }

    setOtpLoading(true);
    setOtpError(null);

    try {
      // Attempt backend API call
      const res = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "REGISTRATION" }),
      });
      const data = await res.json();
      if (data.previewCode) {
        setPreviewOtp(data.previewCode);
      }
    } catch {
      // Simulated Fallback for standalone demo mode
      const fallbackCode = Math.floor(100000 + Math.random() * 900000).toString();
      setPreviewOtp(fallbackCode);
    } finally {
      setOtpLoading(false);
      setStep(2);
      setTimerSeconds(600);
      setResendCooldown(60);
      setTimeout(() => otpInputsRef.current[0]?.focus(), 150);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || otpLoading) return;
    setOtpLoading(true);
    setOtpError(null);

    try {
      const res = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "REGISTRATION" }),
      });
      const data = await res.json();
      if (data.previewCode) {
        setPreviewOtp(data.previewCode);
      }
    } catch {
      const fallbackCode = Math.floor(100000 + Math.random() * 900000).toString();
      setPreviewOtp(fallbackCode);
    } finally {
      setOtpLoading(false);
      setTimerSeconds(600);
      setResendCooldown(60);
      setOtp(["", "", "", "", "", ""]);
      otpInputsRef.current[0]?.focus();
    }
  };

  // Handle individual OTP digit change
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    // Handle paste of 6 digits
    if (value.length > 1) {
      const pasted = value.slice(0, 6).split("");
      pasted.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(pasted.length, 5);
      otpInputsRef.current[nextIndex]?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Step 2: Verify OTP & Activate Account
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otp.join("");
    if (enteredCode.length !== 6) {
      setOtpError("Please enter all 6 digits of your verification passcode.");
      return;
    }

    setOtpLoading(true);
    setOtpError(null);

    try {
      // Call backend API
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: enteredCode, purpose: "REGISTRATION" }),
      });
      const data = await res.json();

      if (!res.ok && !data.success) {
        // Check if demo fallback code matched
        if (previewOtp && enteredCode === previewOtp) {
          // Success via preview fallback
        } else {
          setOtpError(data.error || "Invalid verification code. Please try again.");
          setOtpLoading(false);
          return;
        }
      }
    } catch {
      // Offline fallback: check against previewOtp
      if (previewOtp && enteredCode !== previewOtp) {
        setOtpError(`Incorrect passcode. Expected code for test: ${previewOtp}`);
        setOtpLoading(false);
        return;
      }
    }

    setOtpLoading(false);
    setStep(3);
    switchRole(accountType);

    // Transition to dashboard after brief celebration
    setTimeout(() => {
      if (accountType === "BUYER") {
        router.push("/buyer/dashboard");
      } else {
        router.push("/seller/dashboard");
      }
    }, 1800);
  };

  return (
    <div className="py-12 max-w-lg mx-auto px-4 sm:px-6 w-full space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
            <Gavel className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-slate-950 font-display">
            Bid<span className="text-blue-600">Zone</span>
          </span>
        </Link>
        <h1 className="text-2xl font-black text-slate-900">
          {step === 1 && "Create Verified Account"}
          {step === 2 && "Two-Factor Email Verification"}
          {step === 3 && "Account Activated!"}
        </h1>
        <p className="text-xs text-slate-500">
          {step === 1 && "Join the premier authenticated luxury auction and fiduciary escrow network."}
          {step === 2 && `We sent a 6-digit one-time passcode to ${email}`}
          {step === 3 && "Your credentials have been authenticated. Redirecting to your console..."}
        </p>
      </div>

      {/* Progress Pill Bar */}
      <div className="flex items-center justify-center space-x-2">
        <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 1 ? "w-16 bg-blue-600" : "w-8 bg-slate-200"}`} />
        <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 2 ? "w-16 bg-blue-600" : "w-8 bg-slate-200"}`} />
        <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 3 ? "w-16 bg-emerald-500" : "w-8 bg-slate-200"}`} />
      </div>

      {/* STEP 1: Registration Form */}
      {step === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Account Role Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">I am joining primarily as:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAccountType("BUYER")}
                className={`p-4 rounded-2xl border text-left transition space-y-1.5 ${
                  accountType === "BUYER"
                    ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                  {accountType === "BUYER" && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <div className="font-bold text-sm text-slate-900">Collector / Buyer</div>
                <div className="text-[11px] text-slate-500">Compete in live and timed auctions with escrow custody.</div>
              </button>

              <button
                type="button"
                onClick={() => setAccountType("SELLER")}
                className={`p-4 rounded-2xl border text-left transition space-y-1.5 ${
                  accountType === "SELLER"
                    ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Building className="w-5 h-5 text-blue-600" />
                  {accountType === "SELLER" && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <div className="font-bold text-sm text-slate-900">Consignor / Seller</div>
                <div className="text-[11px] text-slate-500">List curated lots with bank-guaranteed payouts.</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleDetailsSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Full Legal Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Julian Hayes"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Email Address (for OTP Verification)</label>
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Country of Tax Residence</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500 bg-white"
              >
                <option>United States</option>
                <option>Cambodia</option>
                <option>Switzerland</option>
                <option>Singapore</option>
                <option>United Kingdom</option>
                <option>Monaco</option>
                <option>United Arab Emirates</option>
                <option>Canada</option>
                <option>Germany</option>
                <option>France</option>
                <option>Japan</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <input
                type="password"
                required
                placeholder="Min 8 characters with numbers & symbols"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500"
              />
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start space-x-2.5 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="terms" className="text-xs text-slate-600 leading-normal">
                I certify that I am at least 18 years of age and agree to the{" "}
                <Link href="/terms" className="text-blue-600 font-bold hover:underline">
                  BidZone Marketplace Rules
                </Link>
                ,{" "}
                <Link href="/how-it-works#anti-sniping" className="text-blue-600 font-bold hover:underline">
                  Anti-Sniping Protocol
                </Link>
                , and{" "}
                <Link href="/how-it-works#escrow" className="text-blue-600 font-bold hover:underline">
                  Escrow Custody Agreement
                </Link>
                .
              </label>
            </div>

            <button
              type="submit"
              disabled={otpLoading}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{otpLoading ? "Sending Verification Code..." : "Continue to Email Verification"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Already registered?{" "}
            <Link href="/login" className="font-bold text-blue-600 hover:underline">
              Sign In here
            </Link>
          </div>
        </div>
      )}

      {/* STEP 2: Email OTP Passcode Screen */}
      {step === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Edit Email</span>
            </button>
            <div className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              ⏱️ Expires in {formatTimer(timerSeconds)}
            </div>
          </div>

          <div className="text-center space-y-2 pt-2">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-black text-slate-900">Enter One-Time Passcode</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We sent a 6-digit security code to <strong className="text-slate-800">{email}</strong>. Enter the passcode below to verify your identity.
            </p>
          </div>

          {/* Dev Mode Demo Helper Badge */}
          {previewOtp && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Demo Passcode: <strong className="font-mono text-sm tracking-widest">{previewOtp}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const digits = previewOtp.split("");
                  setOtp(digits);
                }}
                className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px] hover:bg-emerald-700 transition"
              >
                Auto-Fill
              </button>
            </div>
          )}

          {otpError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-2xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{otpError}</span>
            </div>
          )}

          <form onSubmit={handleVerifyOtp} className="space-y-6">
            {/* 6 Digit Input Boxes */}
            <div className="flex justify-center items-center gap-2.5 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    otpInputsRef.current[index] = el;
                  }}
                  type="text"
                  maxLength={6}
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black font-mono rounded-2xl border-2 transition outline-none ${
                    digit 
                      ? "border-blue-600 bg-blue-50/40 text-blue-900 shadow-sm" 
                      : "border-slate-200 bg-slate-50 text-slate-800 focus:border-blue-500 focus:bg-white"
                  }`}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={otpLoading || otp.join("").length !== 6}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{otpLoading ? "Verifying Passcode..." : "Verify & Activate Account"}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>

          {/* Resend Action */}
          <div className="text-center pt-2">
            <button
              type="button"
              disabled={resendCooldown > 0 || otpLoading}
              onClick={handleResendOtp}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 disabled:text-slate-400 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${otpLoading ? "animate-spin" : ""}`} />
              <span>
                {resendCooldown > 0 ? `Resend Passcode in ${resendCooldown}s` : "Didn't receive email? Resend Code"}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Success Animation Screen */}
      {step === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Email Verified Successfully!</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Your authenticated persona has been granted access with segregated escrow vault privileges. Launching your console...
          </p>
        </div>
      )}
    </div>
  );
}
