export type UserRole = "BUYER" | "SELLER" | "ESCROW_OFFICER" | "ADMIN";

export type KYCStatus = "unverified" | "pending" | "verified" | "rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  country: string;
  kycStatus: KYCStatus;
  kycDocumentType?: string;
  verifiedAt?: string;
  walletBalance: number;
  heldInBids: number;
  availableBiddingPower: number;
  totalPurchased: number;
  totalSold: number;
  sellerRating?: number;
  salesCount?: number;
  joinedDate: string;
  twoFactorEnabled: boolean;
}

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

export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  bidderAvatar?: string;
  amount: number;
  timestamp: string;
  isProxy?: boolean;
  isWinning?: boolean;
}

export interface ProxyBid {
  id: string;
  auctionId: string;
  userId: string;
  maxAmount: number;
  createdAt: string;
  isActive: boolean;
}

export interface AuctionLot {
  id: string;
  lotNumber: number;
  title: string;
  slug: string;
  category: AuctionCategory;
  subcategory?: string;
  description: string;
  condition: ItemCondition;
  provenance?: string;
  startingBid: number;
  currentBid: number;
  reservePrice: number;
  reserveMet: boolean;
  minIncrement: number;
  buyNowPrice?: number;
  estimatedLow: number;
  estimatedHigh: number;
  startTime: string;
  endTime: string;
  status: AuctionStatus;
  isLive: boolean;
  snipingExtendedMinutes: number;
  bidsCount: number;
  watchersCount: number;
  viewsCount: number;
  featuredImage: string;
  images: string[];
  specifications: Record<string, string>;
  seller: {
    id: string;
    name: string;
    rating: number;
    verified: boolean;
    salesCount: number;
    avatar: string;
  };
  escrowProtected: boolean;
  inspectionPeriodDays: number;
  shippingOrigin: string;
  deliveryMethod: string;
  buyerPremiumPercent: number;
  createdAt: string;
  winningBidderId?: string;
}

export type EscrowMilestone = 
  | "PAYMENT_SECURED" 
  | "SELLER_DISPATCHED" 
  | "IN_TRANSIT" 
  | "DELIVERED_INSPECTION_WINDOW" 
  | "BUYER_APPROVED" 
  | "FUNDS_DISBURSED" 
  | "DISPUTED";

export interface EscrowOrder {
  id: string;
  orderNumber: string;
  auctionId: string;
  auctionTitle: string;
  auctionImage: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  hammerPrice: number;
  buyerPremium: number;
  totalHeld: number;
  platformFee: number;
  sellerPayout: number;
  milestone: EscrowMilestone;
  inspectionDeadline: string;
  trackingNumber?: string;
  carrier?: string;
  disputeReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  userId?: string;
  action: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
  severity: "info" | "warning" | "alert";
}

