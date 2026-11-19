import dotenv from "dotenv";
import path from "path";

dotenv.config();

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET || "bidzone_default_jwt_secret_key_2026",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  dataDir: path.resolve(process.env.DATA_DIR || "./data"),
  db: {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "bidzone_db"
  },
  antiSniping: {
    windowSeconds: process.env.ANTI_SNIPING_WINDOW_SECONDS ? parseInt(process.env.ANTI_SNIPING_WINDOW_SECONDS, 10) : 120,
    extensionSeconds: process.env.ANTI_SNIPING_EXTENSION_SECONDS ? parseInt(process.env.ANTI_SNIPING_EXTENSION_SECONDS, 10) : 120,
  },
  escrowVaultAddress: process.env.ESCROW_VAULT_ADDRESS || "0x91bF24c13634C2867F0022B8E2741fFa56E74519",
  email: {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.SMTP_FROM || "BidZone Security Desk <security@bidzone.luxury>",
    secure: process.env.SMTP_SECURE === "true"
  },
  aba: {
    merchantId: process.env.ABA_PAYWAY_MERCHANT_ID || "ec438912",
    apiKey: process.env.ABA_PAYWAY_API_KEY || "bidzone_aba_demo_api_key_2026",
    apiEndpoint: process.env.ABA_PAYWAY_API_URL || "https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase",
    merchantName: process.env.ABA_MERCHANT_NAME || "BIDZONE ESCROW FIDUCIARY",
    merchantCity: process.env.ABA_MERCHANT_CITY || "Phnom Penh",
    currency: "USD"
  },
  stripe: {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "pk_test_51MockBidZonePublishableKey99182371",
    secretKey: process.env.STRIPE_SECRET_KEY || "sk_test_51MockBidZoneSecretKey99182371",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "whsec_mock_bidzone_stripe_secret"
  }
};
