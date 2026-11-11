# BidZone Backend API & Real-Time Bidding Server

High-performance real-time auction, anti-sniping bidding engine, and financial escrow settlement backend built with **Node.js**, **Express**, **TypeScript**, and **Socket.IO**.

---

## Features

- **Real-Time Live Bidding with WebSockets (Socket.IO)**:
  - Room-isolated bidding lobbies (`auction:<id>`)
  - Sub-millisecond live bid broadcasting (`bid_updated`)
  - Anti-sniping soft close engine: automatically extends auction timer by +120s if a bid arrives in the final 2 minutes (`auction_extended`)
  - Real-time outbid notifications delivered to outbid bidders (`outbid_alert`)
- **Automated Max Proxy Bidding**:
  - Automatically calculates minimal increments to defend a user's ceiling against incoming competitors
- **Escrow Vault Custody & Milestones**:
  - Full financial settlement lifecycle tracking (`PAYMENT_SECURED` → `DISPATCHED` → `DELIVERED_INSPECTION_WINDOW` → `FUNDS_DISBURSED`)
  - Inspection window countdown and dispute claims arbitration
- **Role-Based Access Control (RBAC)**:
  - Multi-persona architecture supporting `BUYER`, `SELLER`, `ESCROW_OFFICER`, and `ADMIN`
- **Zero-Config Database**:
  - Pre-seeded persistent JSON datastore located in `./data/db.json` with realistic collector lots, users, and transactions.

---

## Getting Started

### 1. Install Dependencies
```bash
cd d:\bidzone\backend
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

The API will start on **http://localhost:5000** with WebSockets on **ws://localhost:5000**.

### 3. Production Build
```bash
npm run build
npm start
```

---

## API Endpoints Reference

### Health & Root
- `GET /` — API service metadata & endpoint directory
- `GET /health` — Service health check & uptime

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new collector or consignor account
- `POST /api/auth/login` — Sign in with email and password
- `GET /api/auth/fast-pass/:role` — Instant 1-click token for demo roles (`buyer`, `seller`, `escrow_officer`, `admin`)
- `GET /api/auth/me` — Retrieve authenticated user profile (requires Bearer token)

### Auctions (`/api/auctions`)
- `GET /api/auctions` — List auctions with filters (`?category=`, `?status=live`, `?q=`, `?minPrice=`, `?maxPrice=`, `?sortBy=`)
- `GET /api/auctions/:id` — Get single auction details
- `POST /api/auctions` — Consign a new auction lot (requires `SELLER` or `ADMIN`)

### Bids (`/api/bids`)
- `POST /api/bids` — Submit a competitive live bid (validates increment, bidding power, and soft-close anti-sniping)
- `GET /api/bids/auction/:id` — Retrieve bid history stream for an auction
- `POST /api/bids/proxy` — Configure max proxy bidding ceiling
- `POST /api/bids/simulate` — Trigger an AI competitor counter-bid for testing

### Escrow Fiduciary (`/api/escrow`)
- `GET /api/escrow/orders` — List active escrow settlement contracts
- `GET /api/escrow/orders/:id` — Get single escrow order
- `POST /api/escrow/orders/:id/release` — Authorize wire release of escrow funds to consignor
- `POST /api/escrow/orders/:id/dispute` — Open inspection non-conformity dispute

### Wallet & Collateral (`/api/wallet`)
- `GET /api/wallet/balance` — View escrow cash balance and available bidding power
- `POST /api/wallet/deposit` — Credit cash collateral deposit (unlocks 3x bidding leverage)

### Super Admin Operations (`/api/admin`)
- `GET /api/admin/metrics` — Platform KPIs: Gross GMV, 5% fee revenue, live lot counts
- `POST /api/admin/auctions/:id/approve` — Approve consignment lot for live bidding
- `POST /api/admin/users/verify-kyc` — Approve/reject bidder KYC credentials
- `GET /api/admin/logs` — Audit log surveillance and anti-sniping events

---

## Socket.IO Events

### Client Emits:
- `join_auction(auctionId)` — Subscribe to live lot events
- `leave_auction(auctionId)` — Unsubscribe
- `place_bid({ auctionId, bidderId, amount })` — Place real-time bid
- `simulate_counter_bid({ auctionId })` — Simulate competitor counter-bid

### Server Broadcasts:
- `bid_updated` — Broadcasts new leading bid to all clients in `auction:<id>`
- `auction_extended` — Fired when anti-sniping soft close adds +120s
- `outbid_alert` — Sent when a bidder has been outbid

