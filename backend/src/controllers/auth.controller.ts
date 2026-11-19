import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "../config/index.js";
import { db } from "../db/store.js";
import { User, UserRole, OtpPurpose } from "../types/index.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { OtpService } from "../services/otp.service.js";

export class AuthController {
  /**
   * Request an Email OTP
   * POST /api/auth/send-otp
   * Body: { email, purpose?: "REGISTRATION" | "LOGIN_2FA" | "WALLET_DEPOSIT" }
   */
  static async sendOtp(req: Request, res: Response): Promise<void> {
    const { email, purpose = "REGISTRATION" } = req.body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      res.status(400).json({ success: false, error: "Valid email address is required" });
      return;
    }

    try {
      const result = await OtpService.requestOtp(email, purpose as OtpPurpose);
      res.status(result.success ? 200 : 429).json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || "Failed to dispatch OTP" });
    }
  }

  /**
   * Verify an Email OTP
   * POST /api/auth/verify-otp
   * Body: { email, code, purpose?: "REGISTRATION" | "LOGIN_2FA" }
   */
  static async verifyOtp(req: Request, res: Response): Promise<void> {
    const { email, code, purpose = "REGISTRATION" } = req.body;

    if (!email || !code) {
      res.status(400).json({ success: false, error: "Email and 6-digit verification code are required" });
      return;
    }

    try {
      const verification = await OtpService.verifyOtp(email, code, purpose as OtpPurpose);
      if (!verification.valid) {
        res.status(400).json({ success: false, error: verification.error || "Invalid verification code" });
        return;
      }

      res.json({
        success: true,
        verified: true,
        message: "Email verification successful."
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || "Verification failed" });
    }
  }

  /**
   * User Registration with Optional or Required OTP
   * POST /api/auth/register
   */
  static async register(req: Request, res: Response): Promise<void> {
    const { name, email, password, role, country, otp } = req.body;

    if (!name || !email) {
      res.status(400).json({ success: false, error: "Name and email are required" });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await db.getUserByEmail(cleanEmail);
    if (existing) {
      res.status(400).json({ success: false, error: "Email is already registered" });
      return;
    }

    // If OTP was provided, verify it
    if (otp) {
      const otpCheck = await OtpService.verifyOtp(cleanEmail, otp, "REGISTRATION");
      if (!otpCheck.valid) {
        res.status(400).json({ success: false, error: otpCheck.error || "Invalid OTP code provided" });
        return;
      }
    }

    const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;
    const assignedRole: UserRole = ["BUYER", "SELLER", "ESCROW_OFFICER", "ADMIN"].includes(role) ? role : "BUYER";

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email: cleanEmail,
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
        availableBiddingPower: newUser.availableBiddingPower,
        twoFactorEnabled: newUser.twoFactorEnabled
      }
    });
  }

  /**
   * User Login with 2FA Support
   * POST /api/auth/login
   */
  static async login(req: Request, res: Response): Promise<void> {
    const { email, password, otp } = req.body;
    if (!email) {
      res.status(400).json({ success: false, error: "Email is required" });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await db.getUserByEmail(cleanEmail);

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

    // Check if user has Two-Factor Authentication enabled
    if (user.twoFactorEnabled) {
      if (!otp) {
        // Trigger 2FA email
        const otpResult = await OtpService.requestOtp(user.email, "LOGIN_2FA");
        res.json({
          success: true,
          require2FA: true,
          email: user.email,
          message: "Two-factor authentication code sent to your email.",
          previewCode: otpResult.previewCode
        });
        return;
      }

      // Verify submitted 2FA code
      const check = await OtpService.verifyOtp(user.email, otp, "LOGIN_2FA");
      if (!check.valid) {
        res.status(400).json({ success: false, error: check.error || "Invalid 2FA passcode" });
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

  /**
   * Toggle Two-Factor Authentication on/off for current user
   * POST /api/auth/2fa/toggle
   */
  static async toggle2FA(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    const user = await db.getUserById(userId);
    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    const newStatus = !user.twoFactorEnabled;
    const updated = await db.updateUser(userId, { twoFactorEnabled: newStatus });

    await db.addLog({
      userId,
      action: "2FA_STATUS_CHANGE",
      details: `Two-factor authentication ${newStatus ? "ENABLED" : "DISABLED"} by user.`,
      severity: "info"
    });

    res.json({
      success: true,
      twoFactorEnabled: updated?.twoFactorEnabled,
      message: `Two-factor authentication is now ${newStatus ? "enabled" : "disabled"}.`
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
