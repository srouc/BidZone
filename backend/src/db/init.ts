import { pool } from "./mysql.js";

export async function initDatabaseTables(): Promise<void> {
  try {
    const conn = await pool.getConnection();
    
    // Create otps table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS otps (
        id VARCHAR(64) PRIMARY KEY,
        email VARCHAR(191) NOT NULL,
        code VARCHAR(16) NOT NULL,
        purpose VARCHAR(32) NOT NULL DEFAULT 'REGISTRATION',
        expires_at DATETIME NOT NULL,
        attempts INT NOT NULL DEFAULT 0,
        is_used TINYINT(1) NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_otps_email (email),
        INDEX idx_otps_code (code)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create payments table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        currency VARCHAR(8) NOT NULL DEFAULT 'USD',
        method VARCHAR(32) NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
        reference VARCHAR(128) NOT NULL,
        qr_string TEXT NULL,
        qr_image MEDIUMTEXT NULL,
        checkout_url TEXT NULL,
        client_secret TEXT NULL,
        metadata_json TEXT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME NULL,
        INDEX idx_payments_user (user_id),
        INDEX idx_payments_ref (reference)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    conn.release();
    console.log("✅ Verified and initialized MySQL 'otps' and 'payments' tables.");
  } catch (error: any) {
    console.warn(`ℹ️ Database tables check: ${error.message} (Using resilient memory fallback if offline)`);
  }
}
