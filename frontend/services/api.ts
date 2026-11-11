const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

class ApiClient {
  private getHeaders(demoUserId?: string): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("bidzone_jwt_token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    if (demoUserId) {
      headers["x-demo-user-id"] = demoUserId;
    }

    return headers;
  }

  async request<T>(endpoint: string, options: RequestInit = {}, demoUserId?: string): Promise<T | null> {
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(demoUserId),
          ...(options.headers || {}),
        },
      });
      if (!res.ok) return null;
      return (await res.json()) as T;
    } catch {
      // Backend offline fallback
      return null;
    }
  }

  // Auctions
  async getAuctions(params?: Record<string, string>) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return this.request<{ success: boolean; auctions: any[] }>(`/auctions${query}`);
  }

  async getAuctionById(id: string) {
    return this.request<{ success: boolean; auction: any }>(`/auctions/${id}`);
  }

  async createAuction(data: any, demoUserId?: string) {
    return this.request<{ success: boolean; auction: any }>(
      "/auctions",
      { method: "POST", body: JSON.stringify(data) },
      demoUserId
    );
  }

  // Bids
  async placeBid(auctionId: string, amount: number, demoUserId?: string) {
    return this.request<{ success: boolean; message: string; bid?: any; auction?: any }>(
      "/bids",
      { method: "POST", body: JSON.stringify({ auctionId, amount }) },
      demoUserId
    );
  }

  async getAuctionBids(auctionId: string) {
    return this.request<{ success: boolean; bids: any[] }>(`/bids/auction/${auctionId}`);
  }

  async simulateCompetitorBid(auctionId: string) {
    return this.request<{ success: boolean; bid?: any; auction?: any }>(
      "/bids/simulate",
      { method: "POST", body: JSON.stringify({ auctionId }) }
    );
  }

  // Escrow
  async getEscrowOrders(demoUserId?: string) {
    return this.request<{ success: boolean; orders: any[] }>("/escrow/orders", {}, demoUserId);
  }

  async releaseEscrowFunds(orderId: string, demoUserId?: string) {
    return this.request<{ success: boolean; order: any }>(
      `/escrow/orders/${orderId}/release`,
      { method: "POST" },
      demoUserId
    );
  }

  // Wallet
  async depositFunds(amount: number, method: string, demoUserId?: string) {
    return this.request<{ success: boolean; wallet: any }>(
      "/wallet/deposit",
      { method: "POST", body: JSON.stringify({ amount, method }) },
      demoUserId
    );
  }

  // Auth Fast Pass
  async fastPassLogin(role: string) {
    return this.request<{ success: boolean; token: string; user: any }>(`/auth/fast-pass/${role}`);
  }
}

export const api = new ApiClient();

