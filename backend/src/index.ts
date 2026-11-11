import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { config } from "./config/index.js";
import apiRouter from "./routes/index.js";
import { registerAuctionSocketHandlers } from "./sockets/auction.socket.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { testMySQLConnection } from "./db/mysql.js";

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

registerAuctionSocketHandlers(io);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", async (req, res) => {
  const dbOk = await testMySQLConnection();
  res.json({
    status: dbOk ? "healthy" : "degraded",
    database: dbOk ? `connected (${config.db.database})` : "disconnected",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: "BidZone Real-Time Auction & Escrow API"
  });
});

app.get("/", (req, res) => {
  res.json({
    name: "BidZone API Server",
    version: "2.4.0",
    database: `MySQL (${config.db.database})`,
    docs: "/api",
    status: "operational"
  });
});

app.use("/api", apiRouter);
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  server.listen(config.port, async () => {
    await testMySQLConnection();
    console.log(`====================================================`);
    console.log(`⚡ BidZone Auction & Escrow Backend API running`);
    console.log(`🚀 HTTP Server: http://localhost:${config.port}`);
    console.log(`🔌 WebSockets:  ws://localhost:${config.port}`);
    console.log(`🗄️  MySQL DB:    ${config.db.database} (${config.db.host}:${config.db.port})`);
    console.log(`====================================================`);
  });
}

export { app, server };
