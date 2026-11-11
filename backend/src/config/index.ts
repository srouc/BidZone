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
  escrowVaultAddress: process.env.ESCROW_VAULT_ADDRESS || "0x91bF24c13634C2867F0022B8E2741fFa56E74519"
};
