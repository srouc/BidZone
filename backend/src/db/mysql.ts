import mysql from "mysql2/promise";
import { config } from "../config/index.js";

export const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  decimalNumbers: true
});

export async function testMySQLConnection(): Promise<boolean> {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log(`✅ Connected to MySQL database: ${config.db.database} (${config.db.host}:${config.db.port})`);
    return true;
  } catch (error) {
    console.error(`❌ MySQL connection failed:`, error);
    return false;
  }
}

