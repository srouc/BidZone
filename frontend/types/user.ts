export type UserRole = "BUYER" | "SELLER" | "ESCROW_OFFICER" | "ADMIN";

export type KYCStatus = "unverified" | "pending" | "verified" | "rejected";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  country: string;
  kycStatus: KYCStatus;
  kycDocumentType?: string;
  verifiedAt?: string;
  
  // Financial & Bidding Limits
  walletBalance: number; // deposited cash in platform escrow
  heldInBids: number; // temporarily locked deposits for active bids
  availableBiddingPower: number; // max bidding allowance without extra deposit
  totalPurchased: number;
  totalSold: number;
  
  // Consignor details if seller
  sellerRating?: number;
  salesCount?: number;
  joinedDate: string;
  twoFactorEnabled: boolean;
}

