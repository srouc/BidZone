"use client";

import React, { useState, useEffect } from "react";
import { Clock, AlertTriangle } from "lucide-react";

interface CountdownTimerProps {
  endTime: string;
  isLive?: boolean;
  snipingExtensionMinutes?: number;
  compact?: boolean;
  onEnd?: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endTime,
  isLive = true,
  snipingExtensionMinutes = 0,
  compact = false,
  onEnd,
}) => {
  const calculateTimeLeft = () => {
    const totalMs = new Date(endTime).getTime() - new Date().getTime();
    if (totalMs <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true };
    }
    const seconds = Math.floor((totalMs / 1000) % 60);
    const minutes = Math.floor((totalMs / 1000 / 60) % 60);
    const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
    const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
    return { days, hours, minutes, seconds, isEnded: false };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining.isEnded && onEnd) {
        onEnd();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  if (timeLeft.isEnded || !isLive) {
    return (
      <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
        <span>Bidding Closed</span>
      </div>
    );
  }

  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 2;

  if (compact) {
    return (
      <div className={`inline-flex items-center space-x-1 text-xs font-mono font-bold px-2.5 py-1 rounded-md ${
        isUrgent 
          ? "bg-red-500/15 text-red-600 border border-red-500/20 animate-pulse" 
          : "bg-slate-900/80 text-white"
      }`}>
        <Clock className="w-3.5 h-3.5" />
        <span>
          {timeLeft.days > 0 && `${timeLeft.days}d `}
          {String(timeLeft.hours).padStart(2, "0")}h {String(timeLeft.minutes).padStart(2, "0")}m {String(timeLeft.seconds).padStart(2, "0")}s
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center space-x-2">
        <Clock className={`w-4 h-4 ${isUrgent ? "text-red-500 animate-spin" : "text-blue-600"}`} />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Time Remaining on Block
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-slate-900 text-white rounded-xl p-2.5 shadow-sm">
          <div className="text-2xl font-black font-mono leading-none">{timeLeft.days}</div>
          <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Days</div>
        </div>
        <div className="bg-slate-900 text-white rounded-xl p-2.5 shadow-sm">
          <div className="text-2xl font-black font-mono leading-none">
            {String(timeLeft.hours).padStart(2, "0")}
          </div>
          <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Hours</div>
        </div>
        <div className="bg-slate-900 text-white rounded-xl p-2.5 shadow-sm">
          <div className={`text-2xl font-black font-mono leading-none ${isUrgent ? "text-amber-400" : "text-white"}`}>
            {String(timeLeft.minutes).padStart(2, "0")}
          </div>
          <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Minutes</div>
        </div>
        <div className="bg-slate-900 text-white rounded-xl p-2.5 shadow-sm">
          <div className={`text-2xl font-black font-mono leading-none ${isUrgent ? "text-red-400 animate-pulse" : "text-white"}`}>
            {String(timeLeft.seconds).padStart(2, "0")}
          </div>
          <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Seconds</div>
        </div>
      </div>

      {snipingExtensionMinutes > 0 && (
        <div className="flex items-center space-x-1.5 text-xs text-amber-600 font-semibold bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Anti-sniping protocol active: Extended by +{snipingExtensionMinutes} mins</span>
        </div>
      )}
    </div>
  );
};

