"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Gavel, 
  Search, 
  Bell, 
  Bookmark, 
  Wallet, 
  User, 
  ShieldCheck, 
  PlusCircle, 
  Menu, 
  X, 
  ChevronDown,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { useAuction } from "@/lib/auction-context";
import { UserRole } from "@/types/user";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { 
    currentUser, 
    currentRole, 
    switchRole, 
    watchlist, 
    notifications, 
    unreadNotificationsCount, 
    markNotificationRead,
    clearAllNotifications,
    backendConnected
  } = useAuction();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const rolesList: { role: UserRole; label: string; badge: string }[] = [
    { role: "BUYER", label: "Buyer", badge: "Active Bidder" },
    { role: "SELLER", label: "Seller", badge: "Consignor Studio" },
    { role: "ESCROW_OFFICER", label: "Escrow Officer", badge: "Vault Custody" },
    { role: "ADMIN", label: "Super Admin", badge: "Chief Curator" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      {/* 1. Global Role Switcher & Live Ticker Banner */}
      <div className="bg-slate-900 text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2 text-slate-300">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-200">
            BidZone Protocol 2.4 {backendConnected ? "• MySQL Live Connected" : "• Demo Mode"}
          </span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline text-slate-400">Institutional Escrow Custody by Zurich FreePort Vaults</span>
        </div>

        {/* Interactive Demo Role Switcher */}
        <div className="flex items-center space-x-2 mt-1 sm:mt-0">
          <span className="text-[11px] text-slate-400 font-semibold">Simulate Role:</span>
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            {rolesList.map(({ role, label }) => (
              <button
                key={role}
                onClick={() => switchRole(role)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                  currentRole === role
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-950 font-display">
                Bid<span className="text-blue-600">Zone</span>
              </span>
              <span className="text-[10px] block font-semibold text-slate-400 uppercase tracking-widest leading-none">
                Auction Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-semibold text-slate-600">
            <Link 
              href="/auctions" 
              className={`hover:text-blue-600 transition ${pathname === "/auctions" ? "text-blue-600" : ""}`}
            >
              Marketplace
            </Link>
            <Link 
              href="/auctions?status=live" 
              className="flex items-center space-x-1.5 text-red-600 hover:text-red-700 transition"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span>Live Bidding</span>
            </Link>
            <Link 
              href="/categories" 
              className={`hover:text-blue-600 transition ${pathname.startsWith("/categories") ? "text-blue-600" : ""}`}
            >
              Categories
            </Link>
            <Link 
              href="/how-it-works" 
              className={`hover:text-blue-600 transition ${pathname === "/how-it-works" ? "text-blue-600" : ""}`}
            >
              How It Works
            </Link>
            <Link 
              href="/about" 
              className={`hover:text-blue-600 transition ${pathname === "/about" ? "text-blue-600" : ""}`}
            >
              About
            </Link>
          </nav>
        </div>

        {/* Right Tools: Role Hub Shortcuts, Watchlist, Notifications, Profile */}
        <div className="flex items-center space-x-3">
          {/* Dashboard Direct Link tailored to role */}
          {currentRole === "BUYER" && (
            <Link
              href="/buyer/dashboard"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold border border-blue-200 transition"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Bidding Power: ${currentUser.walletBalance.toLocaleString()}</span>
            </Link>
          )}

          {currentRole === "SELLER" && (
            <Link
              href="/seller/create"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Consign New Lot</span>
            </Link>
          )}

          {currentRole === "ESCROW_OFFICER" && (
            <Link
              href="/escrow/dashboard"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold border border-purple-200 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Escrow Hub ($14.2M Vault)</span>
            </Link>
          )}

          {currentRole === "ADMIN" && (
            <Link
              href="/admin/dashboard"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-bold border border-amber-200 transition"
            >
              <span>Admin Console</span>
            </Link>
          )}

          {/* Watchlist Quick Button */}
          <Link
            href="/buyer/watchlist"
            title="My Watchlist"
            className="relative p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition"
          >
            <Bookmark className="w-5 h-5" />
            {watchlist.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                {watchlist.length}
              </span>
            )}
          </Link>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-sm text-slate-900">Notifications</span>
                  <button 
                    onClick={clearAllNotifications}
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">No notifications</div>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-3 rounded-xl transition ${notif.read ? "bg-white" : "bg-blue-50/50"} hover:bg-slate-50 cursor-pointer`}
                      >
                        <div className="flex items-start justify-between">
                          <h5 className="font-bold text-xs text-slate-900">{notif.title}</h5>
                          <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{notif.message}</p>
                        {notif.link && (
                          <Link 
                            href={notif.link}
                            onClick={() => setNotifDropdownOpen(false)}
                            className="inline-flex items-center space-x-1 text-[11px] font-bold text-blue-600 mt-1 hover:underline"
                          >
                            <span>View details</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile & Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</div>
                <div className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">{currentRole}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50">
                <div className="pb-3 border-b border-slate-100">
                  <div className="font-bold text-sm text-slate-900">{currentUser.name}</div>
                  <div className="text-xs text-slate-500">{currentUser.email}</div>
                  <div className="mt-2 inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>KYC Verified ({currentUser.country})</span>
                  </div>
                </div>

                <div className="py-2 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">Portals</div>
                  <Link
                    href="/buyer/dashboard"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                  >
                    <span>Buyer Portal</span>
                    <span className="text-[10px] text-blue-600">Active</span>
                  </Link>
                  <Link
                    href="/seller/dashboard"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                  >
                    <span>Seller Studio</span>
                    <span className="text-[10px] text-slate-400">Listings</span>
                  </Link>
                  <Link
                    href="/escrow/dashboard"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                  >
                    <span>Escrow Vault Hub</span>
                    <span className="text-[10px] text-purple-600">Protected</span>
                  </Link>
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                  >
                    <span>Super Admin Console</span>
                    <span className="text-[10px] text-amber-600">Curator</span>
                  </Link>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href="/login"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="text-xs font-bold text-slate-500 hover:text-red-600"
                  >
                    Sign Out / Switch User
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-4">
          <nav className="flex flex-col space-y-3 font-semibold text-sm text-slate-700">
            <Link 
              href="/auctions" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-blue-600"
            >
              Marketplace
            </Link>
            <Link 
              href="/auctions?status=live" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-red-600 font-bold flex items-center space-x-1.5"
            >
              <span>🔴 Live Bidding</span>
            </Link>
            <Link 
              href="/categories" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-blue-600"
            >
              Categories
            </Link>
            <Link 
              href="/how-it-works" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-blue-600"
            >
              How It Works
            </Link>
            <Link 
              href="/about" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-blue-600"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-blue-600"
            >
              Contact Support
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 text-center text-xs font-bold">
            <Link 
              href="/buyer/dashboard" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-blue-50 text-blue-700"
            >
              Buyer Portal
            </Link>
            <Link 
              href="/seller/dashboard" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-800"
            >
              Seller Studio
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

