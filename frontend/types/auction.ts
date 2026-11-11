export type AuctionCategory = 
  | "Vehicles" 
  | "Fine Watches" 
  | "Tech & Artifacts" 
  | "Art & Antiquities" 
  | "Rare Jewelry" 
  | "Real Estate" 
  | "Collectibles"
  | "Sports Memorabilia"
  | "Rare Wines & Spirits";

export type AuctionStatus = "draft" | "pending_approval" | "upcoming" | "live" | "ended" | "settled" | "cancelled";

export type ItemCondition = "Brand New / Mint" | "Pristine Grade 10" | "Excellent Vintage" | "Restored Collector" | "Used Good";

export interface BidHistoryItem {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  bidderAvatar?: string;
  bidderRating?: number;
  amount: number;
  timestamp: string;
  isProxy?: boolean;
  isWinning?: boolean;
}

export interface AuctionLot {
  id: string;
  title: string;
  slug: string;
  category: AuctionCategory;
  subcategory?: string;
  description: string;
  condition: ItemCondition;
  provenance?: string;
  lotNumber: number;
  
  // Pricing
  startingBid: number;
  currentBid: number;
  reservePrice: number;
  reserveMet: boolean;
  minIncrement: number;
  buyNowPrice?: number;
  estimatedLow: number;
  estimatedHigh: number;
  
  // Timing
  startTime: string;
  endTime: string;
  timeLeft?: string;
  status: AuctionStatus;
  isLive: boolean;
  snipingExtendedMinutes: number; // extended time due to anti-sniping
  
  // Stats & Media
  bidsCount: number;
  watchersCount: number;
  viewsCount: number;
  images: string[];
  featuredImage: string;
  specifications: Record<string, string>;
  
  // Seller & Verification
  seller: {
    id: string;
    name: string;
    company?: string;
    rating: number;
    verified: boolean;
    salesCount: number;
    avatar: string;
  };
  
  // Escrow & Terms
  escrowProtected: boolean;
  inspectionPeriodDays: number;
  shippingOrigin: string;
  deliveryMethod: string;
  buyerPremiumPercent: number; // e.g. 10%
  
  createdAt: string;
}

export interface WatchlistItem {
  id: string;
  auctionId: string;
  addedAt: string;
  lot: AuctionLot;
}
