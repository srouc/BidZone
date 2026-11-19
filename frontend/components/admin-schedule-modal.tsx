"use client";

import React, { useState } from "react";
import { Clock, X, CheckCircle2, Calendar, StopCircle, Plus } from "lucide-react";
import { AuctionLot } from "@/types/auction";

interface AdminScheduleModalProps {
  lot: AuctionLot;
  onClose: () => void;
  onSave: (
    auctionId: string,
    schedule: { startTime?: string; endTime?: string; status?: AuctionLot["status"]; isLive?: boolean }
  ) => void;
}

function toLocalDateTimeInput(isoStr: string): string {
  const date = new Date(isoStr);
  if (isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export const AdminScheduleModal: React.FC<AdminScheduleModalProps> = ({ lot, onClose, onSave }) => {
  const [startInput, setStartInput] = useState(toLocalDateTimeInput(lot.startTime));
  const [endInput, setEndInput] = useState(toLocalDateTimeInput(lot.endTime));
  const [status, setStatus] = useState<AuctionLot["status"]>(lot.status);

  const extendByHours = (hours: number) => {
    const base = new Date(endInput).getTime() > Date.now() ? new Date(endInput).getTime() : Date.now();
    const nextEnd = new Date(base + hours * 60 * 60 * 1000);
    setEndInput(toLocalDateTimeInput(nextEnd.toISOString()));
    setStatus("live");
  };

  const handleCloseNow = () => {
    const nowIso = new Date().toISOString();
    onSave(lot.id, {
      endTime: nowIso,
      status: "ended",
      isLive: false,
    });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(lot.id, {
      startTime: new Date(startInput).toISOString(),
      endTime: new Date(endInput).toISOString(),
      status,
      isLive: status === "live",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Super Admin Timer Control</span>
            </div>
            <h3 className="font-black text-lg text-slate-950 mt-1">
              Lot #{lot.lotNumber}: {lot.title}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Extend Buttons */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Quick Extend Bidding Window
          </span>
          <div className="grid grid-cols-4 gap-2 text-xs">
            {[
              { label: "+1 Hour", hours: 1 },
              { label: "+6 Hours", hours: 6 },
              { label: "+24 Hours", hours: 24 },
              { label: "+3 Days", hours: 72 },
            ].map((btn) => (
              <button
                key={btn.label}
                type="button"
                onClick={() => extendByHours(btn.hours)}
                className="py-2 px-2 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold border border-blue-200 transition flex items-center justify-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>{btn.label}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Start Date & Time</span>
              </label>
              <input
                type="datetime-local"
                value={startInput}
                onChange={(e) => setStartInput(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>End Date & Time</span>
              </label>
              <input
                type="datetime-local"
                value={endInput}
                onChange={(e) => setEndInput(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Auction Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as AuctionLot["status"])}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white outline-none focus:border-blue-500"
            >
              <option value="live">LIVE (Accepting Bids)</option>
              <option value="upcoming">UPCOMING (Scheduled)</option>
              <option value="ended">ENDED (Bidding Closed)</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleCloseNow}
              className="px-3.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 font-bold text-xs transition flex items-center space-x-1.5"
            >
              <StopCircle className="w-4 h-4" />
              <span>End Auction Now</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Schedule</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

