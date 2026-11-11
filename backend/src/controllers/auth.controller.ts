import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "../config/index.js";
import { db } from "../db/store.js";
import { User, UserRole } from "../types/index.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    const { name, email, password, role, country } = req.body;

    if (!name || !email) {
      res.status(400).json({ success: false, error: "Name and email are required" });
      return;
    }

    const existing = await db.getUserByEmail(email);
    if (existing) {
      res.status(400).json({ success: false, error: "Email is already registered" });
      return;
    }

    const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;
    const assignedRole: UserRole = ["BUYER", "SELLER", "ESCROW_OFFICER", "ADMIN"].includes(role) ? role : "BUYER";

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      passwordHash,
      role: assignedRole,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      country: country || "United States",
      kycStatus: "pending",
      walletBalance: 100000,
      heldInBids: 0,
      availableBiddingPower: 300000,
      totalPurchased: 0,
      totalSold: 0,
      joinedDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      twoFactorEnabled: false
    };

    await db.addUser(newUser);

    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, config.jwtSecret, {
      expiresIn: "7d"
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        walletBalance: newUser.walletBalance,
        availableBiddingPower: newUser.availableBiddingPower
      }
    });
  }

  static async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const user = await db.getUserByEmail(email);

    if (!user) {
      res.status(401).json({ success: false, error: "Invalid email or password credentials" });
      return;
    }

    if (user.passwordHash && password) {
      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) {
        res.status(401).json({ success: false, error: "Invalid password credentials" });
        return;
      }
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, config.jwtSecret, {
      expiresIn: "7d"
    });

    res.json({
      success: true,
      token,
      user
    });
  }

  static async fastPass(req: Request, res: Response): Promise<void> {
    const { role } = req.params;
    const users = await db.getUsers();
    const targetUser = users.find((u) => u.role.toLowerCase() === role.toLowerCase());

    if (!targetUser) {
      res.status(404).json({ success: false, error: `Persona with role ${role} not found` });
      return;
    }

    const token = jwt.sign({ userId: targetUser.id, role: targetUser.role }, config.jwtSecret, {
      expiresIn: "7d"
    });

    res.json({
      success: true,
      token,
      user: targetUser
    });
  }

  static getMe(req: AuthenticatedRequest, res: Response): void {
    res.json({ success: true, user: req.user });
  }
}
