export interface ProxyBidConfig {
  id: string;
  auctionId: string;
  userId: string;
  maxAmount: number;
  currentBidAmount: number;
  isActive: boolean;
  autoOutbidNotifications: boolean;
  createdAt: string;
}

export interface BidSubmission {
  auctionId: string;
  amount: number;
  isProxy?: boolean;
  maxProxyAmount?: number;
}

export interface LiveBidEvent {
  type: "BID_PLACED" | "OUTBID" | "AUCTION_EXTENDED" | "RESERVE_MET" | "AUCTION_ENDED";
  auctionId: string;
  bid: {
    bidderName: string;
    amount: number;
    timestamp: string;
  };
  newEndTime?: string;
  message: string;
}

