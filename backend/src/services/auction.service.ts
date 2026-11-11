import { db } from "../db/store.js";
import { AuctionLot } from "../types/index.js";

export interface AuctionFilterParams {
  category?: string;
  status?: string;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "ending_soon" | "price_desc" | "price_asc" | "bids_desc" | "newest";
}

export class AuctionService {
  static async getAuctions(filters: AuctionFilterParams = {}): Promise<AuctionLot[]> {
    let lots = await db.getAuctions();

    if (filters.category) {
      lots = lots.filter((l) => l.category.toLowerCase() === filters.category?.toLowerCase());
    }

    if (filters.status) {
      if (filters.status === "live") {
        lots = lots.filter((l) => l.isLive && l.status === "live");
      } else if (filters.status === "ended") {
        lots = lots.filter((l) => l.status === "ended");
      }
    }

    if (filters.query) {
      const q = filters.query.toLowerCase();
      lots = lots.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.category.toLowerCase().includes(q)
      );
    }

    if (filters.minPrice) {
      lots = lots.filter((l) => l.currentBid >= (filters.minPrice || 0));
    }

    if (filters.maxPrice) {
      lots = lots.filter((l) => l.currentBid <= (filters.maxPrice || Infinity));
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "ending_soon":
          lots = lots.sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime());
          break;
        case "price_desc":
          lots = lots.sort((a, b) => b.currentBid - a.currentBid);
          break;
        case "price_asc":
          lots = lots.sort((a, b) => a.currentBid - b.currentBid);
          break;
        case "bids_desc":
          lots = lots.sort((a, b) => b.bidsCount - a.bidsCount);
          break;
        case "newest":
          lots = lots.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
      }
    }

    return lots;
  }

  static async getAuctionById(id: string): Promise<AuctionLot | undefined> {
    return db.getAuctionById(id);
  }

  static async createConsignment(lotData: Partial<AuctionLot>, sellerId: string): Promise<AuctionLot> {
    const seller = await db.getUserById(sellerId);
    const existing = await db.getAuctions();
    const lotNumber = 100 + existing.length + 1;

    const newLot: AuctionLot = {
      id: `auc-${Date.now()}`,
      lotNumber,
      title: lotData.title || "Untitled Consignment Lot",
      slug: (lotData.title || "lot").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category: lotData.category || "Vehicles",
      subcategory: lotData.subcategory || "Curated",
      description: lotData.description || "Consigned authenticated asset.",
      condition: lotData.condition || "Brand New / Mint",
      provenance: lotData.provenance || "Verified provenance records.",
      startingBid: lotData.startingBid || 10000,
      currentBid: lotData.startingBid || 10000,
      reservePrice: lotData.reservePrice || (lotData.startingBid ? lotData.startingBid * 1.2 : 12000),
      reserveMet: false,
      minIncrement: lotData.minIncrement || 1000,
      estimatedLow: lotData.estimatedLow || (lotData.startingBid || 10000),
      estimatedHigh: lotData.estimatedHigh || ((lotData.startingBid || 10000) * 1.5),
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "live",
      isLive: true,
      snipingExtendedMinutes: 0,
      bidsCount: 0,
      watchersCount: 1,
      viewsCount: 1,
      featuredImage: lotData.featuredImage || "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1200&q=80",
      images: lotData.images && lotData.images.length > 0 ? lotData.images : ["https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1200&q=80"],
      specifications: lotData.specifications || { "Inspection": "Verified by Specialist" },
      seller: {
        id: seller?.id || sellerId,
        name: seller?.name || "Consignor Partner",
        rating: seller?.sellerRating || 4.95,
        verified: true,
        salesCount: seller?.salesCount || 1,
        avatar: seller?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
      },
      escrowProtected: true,
      inspectionPeriodDays: lotData.inspectionPeriodDays || 5,
      shippingOrigin: lotData.shippingOrigin || "Scottsdale, AZ, USA",
      deliveryMethod: lotData.deliveryMethod || "Insured White-Glove Carrier",
      buyerPremiumPercent: 7.5,
      createdAt: new Date().toISOString()
    };

    return db.addAuction(newLot);
  }
}
