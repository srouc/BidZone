import { Router } from "express";
import authRoutes from "./auth.routes.js";
import auctionRoutes from "./auction.routes.js";
import bidRoutes from "./bid.routes.js";
import escrowRoutes from "./escrow.routes.js";
import walletRoutes from "./wallet.routes.js";
import adminRoutes from "./admin.routes.js";

const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/auctions", auctionRoutes);
apiRouter.use("/bids", bidRoutes);
apiRouter.use("/escrow", escrowRoutes);
apiRouter.use("/wallet", walletRoutes);
apiRouter.use("/admin", adminRoutes);

export default apiRouter;

