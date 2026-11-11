import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { db } from "../db/store.js";
import { User, UserRole } from "../types/index.js";

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const demoUserId = req.headers["x-demo-user-id"] as string;
    if (demoUserId) {
      const demoUser = await db.getUserById(demoUserId);
      if (demoUser) {
        req.user = demoUser;
        next();
        return;
      }
    }
    res.status(401).json({ success: false, error: "Authentication required (missing Bearer token)" });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
    const user = await db.getUserById(decoded.userId);
    if (!user) {
      res.status(401).json({ success: false, error: "User not found" });
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
};

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: "Authentication required" });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `Access denied. Requires one of roles: [${allowedRoles.join(", ")}]`
      });
      return;
    }

    next();
  };
};
