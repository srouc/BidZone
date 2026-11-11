import { db } from "../db/store.js";
import { testMySQLConnection, pool } from "../db/mysql.js";

async function runSeedCheck() {
  console.log("Checking BidZone MySQL database...");
  await testMySQLConnection();
  const auctions = await db.getAuctions();
  const users = await db.getUsers();
  console.log(`Loaded ${users.length} authenticated personas from MySQL`);
  console.log(`Loaded ${auctions.length} curated luxury auction lots from MySQL`);
  await pool.end();
}

runSeedCheck().catch(console.error);
