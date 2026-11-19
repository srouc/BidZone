# BidZone — Enterprise Online Auction & Escrow Marketplace

Full-stack real-time auction, anti-sniping bidding engine, and financial escrow settlement platform.

## Project Structure

```
bidzone/
├── backend/    # Node.js + Express + TypeScript + Socket.IO + MySQL API
└── frontend/   # Next.js 16 (App Router) + React 19 + Tailwind CSS
```

---

## Database Setup (MySQL / phpMyAdmin)

1. Start **MySQL** (e.g., via XAMPP).
2. Import [`backend/database/schema.sql`](backend/database/schema.sql) into MySQL / phpMyAdmin to create `bidzone_db` and seed initial luxury auction lots, users, and escrow orders.

---

## Running Locally

### 1. Start the Backend Server
```bash
cd backend
npm install
npm run dev
```
Runs HTTP API on `http://localhost:5000` and WebSockets on `ws://localhost:5000`.

### 2. Start the Frontend App
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000`.

---

## Features
- **Email OTP & 2FA Security Desk**: 6-digit one-time passcode verification via SMTP or development fallback during registration, login, and wallet transfers.
- **Multi-Rail Payment & Escrow Deposits**:
  - **ABA Pay / Bakong KHQR**: Authentic Dynamic EMVCo QR code generator (Cambodia & International Bakong network) with instant scanning and webhook callback simulation.
  - **Stripe Card Processing**: Encrypted credit/debit card intent creation and settlement.
  - **Fedwire & SWIFT Private Banking**: Swiss and US institutional custody wire routing.
- **Live Bidding Arena** with real-time WebSocket updates and **+120s Anti-Sniping** protection
- **1-Click Persona Switcher**: Test **Buyer**, **Seller**, **Escrow Officer**, and **Super Admin** portals
- **Escrow Custody Lifecycle**: Payment Secured → In Transit → Inspection Window → Funds Disbursed
- **Consignment Creation Wizard**: Launch new auction lots directly to the marketplace

---

## Testing & Automation Scripts

Run automated verification scripts directly in the backend:

```bash
cd backend

# Test Email OTP dispatch & 6-digit verification
npm run test:otp

# Test ABA Bakong KHQR generation & Stripe deposit settlements
npm run test:payment
```


