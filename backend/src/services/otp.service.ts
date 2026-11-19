import crypto from "crypto";
import { db } from "../db/store.js";
import { OtpPurpose, OtpRecord } from "../types/index.js";
import { EmailService } from "./email.service.js";

export class OtpService {
  /**
   * Generates a 6-digit random code and dispatches via email
   */
  static async requestOtp(email: string, purpose: OtpPurpose = "REGISTRATION"): Promise<{
    success: boolean;
    message: string;
    expiresAt: string;
    previewCode?: string;
    mode: "live_smtp" | "simulated";
  }> {
    const cleanEmail = email.trim().toLowerCase();

    // Check if there is an active OTP sent within 60 seconds (rate limiting)
    const existing = await db.getLatestOtp(cleanEmail, purpose);
    if (existing && !existing.isUsed) {
      const createdAt = new Date(existing.createdAt).getTime();
      const timeSince = Date.now() - createdAt;
      if (timeSince < 60 * 1000) {
        const waitSec = Math.ceil((60 * 1000 - timeSince) / 1000);
        return {
          success: false,
          message: `Please wait ${waitSec} seconds before requesting a new verification code.`,
          expiresAt: existing.expiresAt,
          previewCode: existing.code,
          mode: "simulated"
        };
      }
    }

    // Generate secure 6-digit code
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    const otpRecord: OtpRecord = {
      id: `otp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      email: cleanEmail,
      code,
      purpose,
      expiresAt,
      attempts: 0,
      isUsed: false,
      createdAt: new Date().toISOString()
    };

    await db.saveOtp(otpRecord);

    // Send email dispatch
    const emailResult = await EmailService.sendOtpEmail(cleanEmail, code, purpose);

    return {
      success: true,
      message: `Verification code sent to ${cleanEmail}`,
      expiresAt,
      previewCode: emailResult.previewCode,
      mode: emailResult.mode
    };
  }

  /**
   * Validates submitted OTP
   */
  static async verifyOtp(email: string, code: string, purpose: OtpPurpose = "REGISTRATION"): Promise<{
    valid: boolean;
    error?: string;
  }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    const record = await db.getLatestOtp(cleanEmail, purpose);
    if (!record) {
      return { valid: false, error: "No pending verification code found for this email. Please request a new code." };
    }

    if (record.isUsed) {
      return { valid: false, error: "This verification code has already been used. Please request a new code." };
    }

    if (new Date(record.expiresAt).getTime() < Date.now()) {
      return { valid: false, error: "Verification code has expired. Please request a new code." };
    }

    if (record.attempts >= 5) {
      return { valid: false, error: "Too many incorrect attempts. Please request a new verification code." };
    }

    if (record.code !== cleanCode) {
      await db.incrementOtpAttempts(record.id);
      return { valid: false, error: `Invalid verification code. Remaining attempts: ${4 - record.attempts}` };
    }

    // Valid code: mark as used
    await db.markOtpUsed(record.id);

    return { valid: true };
  }
}
