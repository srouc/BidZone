export type EscrowMilestone = 
  | "PAYMENT_SECURED" 
  | "SELLER_DISPATCHED" 
  | "IN_TRANSIT" 
  | "DELIVERED_INSPECTION_WINDOW" 
  | "BUYER_APPROVED" 
  | "FUNDS_DISBURSED" 
  | "DISPUTED";

export interface EscrowTransaction {
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
  disputeNotes?: string;
  createdAt: string;
  updatedAt: string;
}

