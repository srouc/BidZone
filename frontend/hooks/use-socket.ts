"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export const useSocket = (auctionId?: string) => {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 3,
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      if (auctionId) {
        socket.emit("join_auction", auctionId);
      }
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    return () => {
      if (auctionId && socket.connected) {
        socket.emit("leave_auction", auctionId);
      }
      socket.disconnect();
    };
  }, [auctionId]);

  const emitPlaceBid = (targetAuctionId: string, bidderId: string, amount: number) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("place_bid", { auctionId: targetAuctionId, bidderId, amount });
    }
  };

  const emitSimulateCounter = (targetAuctionId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("simulate_counter_bid", { auctionId: targetAuctionId });
    }
  };

  return {
    socket: socketRef.current,
    connected,
    emitPlaceBid,
    emitSimulateCounter,
  };
};

