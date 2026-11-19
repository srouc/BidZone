import { pool } from "./mysql.js";
import { User, AuctionLot, Bid, ProxyBid, EscrowOrder, ActivityLog, OtpRecord, OtpPurpose, PaymentTransaction } from "../types/index.js";
import { RowDataPacket } from "mysql2";

function mapUserRow(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash || undefined,
    role: row.role,
    avatar: row.avatar || "",
    phone: row.phone || undefined,
    country: row.country,
    kycStatus: row.kyc_status,
    kycDocumentType: row.kyc_document_type || undefined,
    verifiedAt: row.verified_at ? new Date(row.verified_at).toISOString() : undefined,
    walletBalance: Number(row.wallet_balance),
    heldInBids: Number(row.held_in_bids),
    availableBiddingPower: Number(row.available_bidding_power),
    totalPurchased: Number(row.total_purchased),
    totalSold: Number(row.total_sold),
    sellerRating: row.seller_rating ? Number(row.seller_rating) : undefined,
    salesCount: row.sales_count ? Number(row.sales_count) : undefined,
    joinedDate: row.joined_date || "2026",
    twoFactorEnabled: Boolean(row.two_factor_enabled),
  };
}

function mapAuctionRow(row: any): AuctionLot {
  let images: string[] = [];
  let specifications: Record<string, string> = {};
  try {
    images = row.images_json ? JSON.parse(row.images_json) : [row.featured_image];
  } catch {
    images = [row.featured_image];
  }
  try {
    specifications = row.specifications_json ? JSON.parse(row.specifications_json) : {};
  } catch {
    specifications = {};
  }

  return {
    id: row.id,
    lotNumber: Number(row.lot_number),
    title: row.title,
    slug: row.slug,
    category: row.category,
    subcategory: row.subcategory || undefined,
    description: row.description,
    condition: row.item_condition,
    provenance: row.provenance || undefined,
    startingBid: Number(row.starting_bid),
    currentBid: Number(row.current_bid),
    reservePrice: Number(row.reserve_price),
    reserveMet: Boolean(row.reserve_met),
    minIncrement: Number(row.min_increment),
    buyNowPrice: row.buy_now_price ? Number(row.buy_now_price) : undefined,
    estimatedLow: Number(row.estimated_low),
    estimatedHigh: Number(row.estimated_high),
    startTime: new Date(row.start_time).toISOString(),
    endTime: new Date(row.end_time).toISOString(),
    status: row.status,
    isLive: Boolean(row.is_live),
    snipingExtendedMinutes: Number(row.sniping_extended_minutes),
    bidsCount: Number(row.bids_count),
    watchersCount: Number(row.watchers_count),
    viewsCount: Number(row.views_count),
    featuredImage: row.featured_image,
    images,
    specifications,
    seller: {
      id: row.seller_id,
      name: row.seller_name || "Verified Consignor",
      rating: row.seller_rating ? Number(row.seller_rating) : 4.98,
      verified: true,
      salesCount: row.seller_sales_count ? Number(row.seller_sales_count) : 10,
      avatar: row.seller_avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    },
    escrowProtected: Boolean(row.escrow_protected),
    inspectionPeriodDays: Number(row.inspection_period_days),
    shippingOrigin: row.shipping_origin || "United States",
    deliveryMethod: row.delivery_method || "Insured White-Glove Carrier",
    buyerPremiumPercent: Number(row.buyer_premium_percent),
    createdAt: new Date(row.created_at).toISOString(),
    winningBidderId: row.winning_bidder_id || undefined,
  };
}

function mapBidRow(row: any): Bid {
  return {
    id: row.id,
    auctionId: row.auction_id,
    bidderId: row.bidder_id,
    bidderName: row.bidder_name,
    bidderAvatar: row.bidder_avatar || undefined,
    amount: Number(row.amount),
    timestamp: new Date(row.created_at).toISOString(),
    isProxy: Boolean(row.is_proxy),
    isWinning: Boolean(row.is_winning),
  };
}

function mapEscrowRow(row: any): EscrowOrder {
  return {
    id: row.id,
    orderNumber: row.order_number,
    auctionId: row.auction_id,
    auctionTitle: row.auction_title,
    auctionImage: row.auction_image || "",
    buyerId: row.buyer_id,
    buyerName: row.buyer_name,
    sellerId: row.seller_id,
    sellerName: row.seller_name,
    hammerPrice: Number(row.hammer_price),
    buyerPremium: Number(row.buyer_premium),
    totalHeld: Number(row.total_held),
    platformFee: Number(row.platform_fee),
    sellerPayout: Number(row.seller_payout),
    milestone: row.milestone,
    inspectionDeadline: new Date(row.inspection_deadline).toISOString(),
    trackingNumber: row.tracking_number || undefined,
    carrier: row.carrier || undefined,
    disputeReason: row.dispute_reason || undefined,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

function mapOtpRow(row: any): OtpRecord {
  return {
    id: row.id,
    email: row.email,
    code: row.code,
    purpose: row.purpose,
    expiresAt: new Date(row.expires_at).toISOString(),
    attempts: Number(row.attempts),
    isUsed: Boolean(row.is_used),
    createdAt: new Date(row.created_at).toISOString(),
  };
}

function mapPaymentRow(row: any): PaymentTransaction {
  let metadata = {};
  try {
    metadata = row.metadata_json ? JSON.parse(row.metadata_json) : {};
  } catch {
    metadata = {};
  }
  return {
    id: row.id,
    userId: row.user_id,
    amount: Number(row.amount),
    currency: row.currency,
    method: row.method,
    status: row.status,
    reference: row.reference,
    qrString: row.qr_string || undefined,
    qrImage: row.qr_image || undefined,
    checkoutUrl: row.checkout_url || undefined,
    clientSecret: row.client_secret || undefined,
    metadata,
    createdAt: new Date(row.created_at).toISOString(),
    completedAt: row.completed_at ? new Date(row.completed_at).toISOString() : undefined,
  };
}

class MySQLDatabaseStore {
  // --- Users ---
  private memoryUsers = new Map<string, User>([
    [
      "usr-buyer-1",
      {
        id: "usr-buyer-1",
        name: "Julian Vance",
        email: "julian.vance@geneva-cap.ch",
        role: "BUYER",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        country: "Switzerland",
        kycStatus: "verified",
        walletBalance: 2450000,
        heldInBids: 1250000,
        availableBiddingPower: 6100000,
        totalPurchased: 4,
        totalSold: 0,
        joinedDate: "October 2023",
        twoFactorEnabled: true,
      },
    ],
    [
      "usr-seller-1",
      {
        id: "usr-seller-1",
        name: "Helena Rostova",
        email: "consignments@rostova-heritage.mc",
        role: "SELLER",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
        country: "Monaco",
        kycStatus: "verified",
        walletBalance: 820000,
        heldInBids: 0,
        availableBiddingPower: 0,
        totalPurchased: 1,
        totalSold: 19,
        sellerRating: 4.98,
        salesCount: 19,
        joinedDate: "January 2022",
        twoFactorEnabled: true,
      },
    ],
    [
      "usr-escrow-1",
      {
        id: "usr-escrow-1",
        name: "Marcus Sterling",
        email: "custody.officer@bidzone.luxury",
        role: "ESCROW_OFFICER",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        country: "United Kingdom",
        kycStatus: "verified",
        walletBalance: 0,
        heldInBids: 0,
        availableBiddingPower: 0,
        totalPurchased: 0,
        totalSold: 0,
        joinedDate: "June 2021",
        twoFactorEnabled: true,
      },
    ],
    [
      "usr-admin-1",
      {
        id: "usr-admin-1",
        name: "Alex Thorne",
        email: "superadmin@bidzone.luxury",
        role: "ADMIN",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        country: "United States",
        kycStatus: "verified",
        walletBalance: 500000,
        heldInBids: 0,
        availableBiddingPower: 1500000,
        totalPurchased: 0,
        totalSold: 0,
        joinedDate: "January 2021",
        twoFactorEnabled: true,
      },
    ],
  ]);

  async getUsers(): Promise<User[]> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM users ORDER BY created_at DESC");
      return rows.map(mapUserRow);
    } catch {
      return Array.from(this.memoryUsers.values());
    }
  }

  async getUserById(id: string): Promise<User | undefined> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM users WHERE id = ?", [id]);
      if (rows[0]) return mapUserRow(rows[0]);
    } catch {
      // Fallback
    }
    return this.memoryUsers.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM users WHERE LOWER(email) = LOWER(?)", [email]);
      if (rows[0]) return mapUserRow(rows[0]);
    } catch {
      // Fallback
    }
    const cleanEmail = email.trim().toLowerCase();
    return Array.from(this.memoryUsers.values()).find((u) => u.email.toLowerCase() === cleanEmail);
  }

  async addUser(user: User): Promise<User> {
    this.memoryUsers.set(user.id, { ...user });
    try {
      await pool.query(
        `INSERT INTO users (id, name, email, password_hash, role, avatar, phone, country, kyc_status, wallet_balance, held_in_bids, available_bidding_power, joined_date, two_factor_enabled)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user.id,
          user.name,
          user.email,
          user.passwordHash || null,
          user.role,
          user.avatar,
          user.phone || null,
          user.country,
          user.kycStatus,
          user.walletBalance,
          user.heldInBids,
          user.availableBiddingPower,
          user.joinedDate,
          user.twoFactorEnabled ? 1 : 0,
        ]
      );
    } catch {
      // Memory store updated
    }
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const existing = await this.getUserById(id);
    if (!existing) return undefined;

    const merged: User = { ...existing, ...updates };
    this.memoryUsers.set(id, merged);

    try {
      const fields: string[] = [];
      const values: any[] = [];

      if (updates.walletBalance !== undefined) { fields.push("wallet_balance = ?"); values.push(updates.walletBalance); }
      if (updates.heldInBids !== undefined) { fields.push("held_in_bids = ?"); values.push(updates.heldInBids); }
      if (updates.availableBiddingPower !== undefined) { fields.push("available_bidding_power = ?"); values.push(updates.availableBiddingPower); }
      if (updates.totalSold !== undefined) { fields.push("total_sold = ?"); values.push(updates.totalSold); }
      if (updates.kycStatus !== undefined) { fields.push("kyc_status = ?"); values.push(updates.kycStatus); }
      if (updates.verifiedAt !== undefined) { fields.push("verified_at = ?"); values.push(new Date(updates.verifiedAt)); }
      if (updates.twoFactorEnabled !== undefined) { fields.push("two_factor_enabled = ?"); values.push(updates.twoFactorEnabled ? 1 : 0); }

      if (fields.length > 0) {
        values.push(id);
        await pool.query(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`, values);
      }
    } catch {
      // Memory store updated
    }
    return merged;
  }

  // --- Auctions ---
  async getAuctions(): Promise<AuctionLot[]> {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT a.*, u.name AS seller_name, u.avatar AS seller_avatar, u.seller_rating, u.sales_count AS seller_sales_count
      FROM auctions a
      LEFT JOIN users u ON a.seller_id = u.id
      ORDER BY a.created_at DESC
    `);
    return rows.map(mapAuctionRow);
  }

  async getAuctionById(id: string): Promise<AuctionLot | undefined> {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT a.*, u.name AS seller_name, u.avatar AS seller_avatar, u.seller_rating, u.sales_count AS seller_sales_count
      FROM auctions a
      LEFT JOIN users u ON a.seller_id = u.id
      WHERE a.id = ?
    `, [id]);
    return rows[0] ? mapAuctionRow(rows[0]) : undefined;
  }

  async addAuction(auction: AuctionLot): Promise<AuctionLot> {
    await pool.query(
      `INSERT INTO auctions (id, lot_number, title, slug, category, subcategory, description, item_condition, provenance, starting_bid, current_bid, reserve_price, reserve_met, min_increment, estimated_low, estimated_high, start_time, end_time, status, is_live, sniping_extended_minutes, bids_count, watchers_count, views_count, featured_image, images_json, specifications_json, seller_id, escrow_protected, inspection_period_days, shipping_origin, delivery_method, buyer_premium_percent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        auction.id,
        auction.lotNumber,
        auction.title,
        auction.slug,
        auction.category,
        auction.subcategory || null,
        auction.description,
        auction.condition,
        auction.provenance || null,
        auction.startingBid,
        auction.currentBid,
        auction.reservePrice,
        auction.reserveMet ? 1 : 0,
        auction.minIncrement,
        auction.estimatedLow,
        auction.estimatedHigh,
        new Date(auction.startTime),
        new Date(auction.endTime),
        auction.status,
        auction.isLive ? 1 : 0,
        auction.snipingExtendedMinutes,
        auction.bidsCount,
        auction.watchersCount,
        auction.viewsCount,
        auction.featuredImage,
        JSON.stringify(auction.images),
        JSON.stringify(auction.specifications),
        auction.seller.id,
        auction.escrowProtected ? 1 : 0,
        auction.inspectionPeriodDays,
        auction.shippingOrigin,
        auction.deliveryMethod,
        auction.buyerPremiumPercent,
      ]
    );
    return (await this.getAuctionById(auction.id)) || auction;
  }

  async updateAuction(id: string, updates: Partial<AuctionLot>): Promise<AuctionLot | undefined> {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.currentBid !== undefined) { fields.push("current_bid = ?"); values.push(updates.currentBid); }
    if (updates.bidsCount !== undefined) { fields.push("bids_count = ?"); values.push(updates.bidsCount); }
    if (updates.reserveMet !== undefined) { fields.push("reserve_met = ?"); values.push(updates.reserveMet ? 1 : 0); }
    if (updates.winningBidderId !== undefined) { fields.push("winning_bidder_id = ?"); values.push(updates.winningBidderId); }
    if (updates.startTime !== undefined) { fields.push("start_time = ?"); values.push(new Date(updates.startTime)); }
    if (updates.endTime !== undefined) { fields.push("end_time = ?"); values.push(new Date(updates.endTime)); }
    if (updates.snipingExtendedMinutes !== undefined) { fields.push("sniping_extended_minutes = ?"); values.push(updates.snipingExtendedMinutes); }
    if (updates.status !== undefined) { fields.push("status = ?"); values.push(updates.status); }
    if (updates.isLive !== undefined) { fields.push("is_live = ?"); values.push(updates.isLive ? 1 : 0); }

    if (fields.length === 0) return this.getAuctionById(id);

    values.push(id);
    await pool.query(`UPDATE auctions SET ${fields.join(", ")} WHERE id = ?`, values);
    return this.getAuctionById(id);
  }

  // --- Bids ---
  async getBidsByAuction(auctionId: string): Promise<Bid[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM bids WHERE auction_id = ? ORDER BY amount DESC, created_at DESC",
      [auctionId]
    );
    return rows.map(mapBidRow);
  }

  async addBid(bid: Bid): Promise<Bid> {
    // Mark previous bids on this auction as not winning
    await pool.query("UPDATE bids SET is_winning = 0 WHERE auction_id = ?", [bid.auctionId]);
    await pool.query(
      `INSERT INTO bids (id, auction_id, bidder_id, bidder_name, bidder_avatar, amount, is_proxy, is_winning)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bid.id,
        bid.auctionId,
        bid.bidderId,
        bid.bidderName,
        bid.bidderAvatar || null,
        bid.amount,
        bid.isProxy ? 1 : 0,
        bid.isWinning ? 1 : 0,
      ]
    );
    return bid;
  }

  // --- Proxy Bids ---
  async getProxyBids(auctionId: string): Promise<ProxyBid[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM proxy_bids WHERE auction_id = ? AND is_active = 1",
      [auctionId]
    );
    return rows.map((r) => ({
      id: r.id,
      auctionId: r.auction_id,
      userId: r.user_id,
      maxAmount: Number(r.max_amount),
      createdAt: new Date(r.created_at).toISOString(),
      isActive: Boolean(r.is_active),
    }));
  }

  async setProxyBid(proxy: ProxyBid): Promise<ProxyBid> {
    await pool.query(
      "UPDATE proxy_bids SET is_active = 0 WHERE auction_id = ? AND user_id = ?",
      [proxy.auctionId, proxy.userId]
    );
    await pool.query(
      "INSERT INTO proxy_bids (id, auction_id, user_id, max_amount, is_active) VALUES (?, ?, ?, ?, ?)",
      [proxy.id, proxy.auctionId, proxy.userId, proxy.maxAmount, 1]
    );
    return proxy;
  }

  // --- Escrow Orders ---
  async getEscrowOrders(): Promise<EscrowOrder[]> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM escrow_orders ORDER BY created_at DESC");
    return rows.map(mapEscrowRow);
  }

  async getEscrowOrderById(id: string): Promise<EscrowOrder | undefined> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM escrow_orders WHERE id = ?", [id]);
    return rows[0] ? mapEscrowRow(rows[0]) : undefined;
  }

  async updateEscrowOrder(id: string, updates: Partial<EscrowOrder>): Promise<EscrowOrder | undefined> {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.milestone !== undefined) { fields.push("milestone = ?"); values.push(updates.milestone); }
    if (updates.disputeReason !== undefined) { fields.push("dispute_reason = ?"); values.push(updates.disputeReason); }

    if (fields.length === 0) return this.getEscrowOrderById(id);

    values.push(id);
    await pool.query(`UPDATE escrow_orders SET ${fields.join(", ")} WHERE id = ?`, values);
    return this.getEscrowOrderById(id);
  }

  // --- Activity Logs ---
  async addLog(log: Omit<ActivityLog, "id" | "timestamp">): Promise<ActivityLog> {
    const id = `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const fullLog: ActivityLog = {
      id,
      ...log,
      timestamp: new Date().toISOString(),
    };
    this.memoryLogs.unshift(fullLog);
    try {
      await pool.query(
        "INSERT INTO activity_logs (id, user_id, action, details, severity) VALUES (?, ?, ?, ?, ?)",
        [id, log.userId || null, log.action, log.details, log.severity]
      );
    } catch {
      // Memory store updated
    }
    return fullLog;
  }

  async getLogs(limit = 50): Promise<ActivityLog[]> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT ?",
        [limit]
      );
      return rows.map((r) => ({
        id: r.id,
        userId: r.user_id || undefined,
        action: r.action,
        details: r.details,
        severity: r.severity,
        timestamp: new Date(r.created_at).toISOString(),
      }));
    } catch {
      return this.memoryLogs.slice(0, limit);
    }
  }

  // --- OTPs (Email & 2FA) ---
  private memoryOtps = new Map<string, OtpRecord>();

  async saveOtp(otp: OtpRecord): Promise<OtpRecord> {
    this.memoryOtps.set(otp.id, { ...otp });
    try {
      await pool.query(
        `INSERT INTO otps (id, email, code, purpose, expires_at, attempts, is_used, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          otp.id,
          otp.email,
          otp.code,
          otp.purpose,
          new Date(otp.expiresAt),
          otp.attempts,
          otp.isUsed ? 1 : 0,
          new Date(otp.createdAt),
        ]
      );
    } catch (err: any) {
      console.warn("ℹ️ Saved OTP to in-memory store (MySQL:", err.message, ")");
    }
    return otp;
  }

  async getLatestOtp(email: string, purpose?: OtpPurpose): Promise<OtpRecord | undefined> {
    const cleanEmail = email.trim().toLowerCase();
    try {
      let query = "SELECT * FROM otps WHERE LOWER(email) = ? ";
      const params: any[] = [cleanEmail];
      if (purpose) {
        query += "AND purpose = ? ";
        params.push(purpose);
      }
      query += "ORDER BY created_at DESC LIMIT 1";

      const [rows] = await pool.query<RowDataPacket[]>(query, params);
      if (rows && rows[0]) {
        return mapOtpRow(rows[0]);
      }
    } catch {
      // Fallback to memory
    }

    const matches = Array.from(this.memoryOtps.values())
      .filter((o) => o.email.toLowerCase() === cleanEmail && (!purpose || o.purpose === purpose))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return matches[0];
  }

  async markOtpUsed(id: string): Promise<void> {
    const mem = this.memoryOtps.get(id);
    if (mem) {
      mem.isUsed = true;
    }
    try {
      await pool.query("UPDATE otps SET is_used = 1 WHERE id = ?", [id]);
    } catch {
      // Memory updated
    }
  }

  async incrementOtpAttempts(id: string): Promise<void> {
    const mem = this.memoryOtps.get(id);
    if (mem) {
      mem.attempts += 1;
    }
    try {
      await pool.query("UPDATE otps SET attempts = attempts + 1 WHERE id = ?", [id]);
    } catch {
      // Memory updated
    }
  }

  // --- Payments (ABA Pay / KHQR & Stripe) ---
  private memoryPayments = new Map<string, PaymentTransaction>();
  private memoryLogs: ActivityLog[] = [];

  async createPayment(payment: PaymentTransaction): Promise<PaymentTransaction> {
    this.memoryPayments.set(payment.id, { ...payment });
    try {
      await pool.query(
        `INSERT INTO payments (id, user_id, amount, currency, method, status, reference, qr_string, qr_image, checkout_url, client_secret, metadata_json, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          payment.id,
          payment.userId,
          payment.amount,
          payment.currency,
          payment.method,
          payment.status,
          payment.reference,
          payment.qrString || null,
          payment.qrImage || null,
          payment.checkoutUrl || null,
          payment.clientSecret || null,
          payment.metadata ? JSON.stringify(payment.metadata) : null,
          new Date(payment.createdAt),
        ]
      );
    } catch (err: any) {
      console.warn("ℹ️ Saved payment transaction to in-memory store (MySQL:", err.message, ")");
    }
    return payment;
  }

  async getPaymentById(id: string): Promise<PaymentTransaction | undefined> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM payments WHERE id = ?", [id]);
      if (rows && rows[0]) return mapPaymentRow(rows[0]);
    } catch {
      // Fallback
    }
    return this.memoryPayments.get(id);
  }

  async getPaymentByReference(reference: string): Promise<PaymentTransaction | undefined> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM payments WHERE reference = ?", [reference]);
      if (rows && rows[0]) return mapPaymentRow(rows[0]);
    } catch {
      // Fallback
    }
    return Array.from(this.memoryPayments.values()).find((p) => p.reference === reference);
  }

  async updatePayment(id: string, updates: Partial<PaymentTransaction>): Promise<PaymentTransaction | undefined> {
    const existing = await this.getPaymentById(id);
    if (!existing) return undefined;

    const merged: PaymentTransaction = {
      ...existing,
      ...updates,
      metadata: {
        ...(existing.metadata || {}),
        ...(updates.metadata || {}),
      },
    };
    this.memoryPayments.set(id, merged);

    try {
      const fields: string[] = [];
      const values: any[] = [];
      if (updates.status !== undefined) { fields.push("status = ?"); values.push(updates.status); }
      if (updates.completedAt !== undefined) { fields.push("completed_at = ?"); values.push(new Date(updates.completedAt)); }
      if (updates.metadata !== undefined) { fields.push("metadata_json = ?"); values.push(JSON.stringify(merged.metadata)); }

      if (fields.length > 0) {
        values.push(id);
        await pool.query(`UPDATE payments SET ${fields.join(", ")} WHERE id = ?`, values);
      }
    } catch {
      // Memory updated
    }
    return merged;
  }

  async getPaymentsByUser(userId: string): Promise<PaymentTransaction[]> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC",
        [userId]
      );
      if (rows && rows.length > 0) {
        return rows.map(mapPaymentRow);
      }
    } catch {
      // Fallback
    }
    return Array.from(this.memoryPayments.values())
      .filter((p) => p.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export const db = new MySQLDatabaseStore();
