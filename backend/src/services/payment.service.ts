import QRCode from "qrcode";
import { config } from "../config/index.js";
import { db } from "../db/store.js";
import { PaymentMethod, PaymentStatus, PaymentTransaction } from "../types/index.js";

/**
 * Calculates standard EMVCo / Bakong KHQR CRC16-CCITT (0x1021, init 0xFFFF)
 */
export function calculateKHQRCrc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function formatTlv(tag: string, value: string): string {
  const len = value.length.toString().padStart(2, "0");
  return `${tag}${len}${value}`;
}

export class PaymentService {
  /**
   * Generates authentic Bakong / ABA PayWay Dynamic KHQR string and QR Code Image
   */
  static async createAbaKhqr(userId: string, amount: number, currency: "USD" | "KHR" = "USD"): Promise<PaymentTransaction> {
    const reference = `ABA-BZ-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const formattedAmount = amount.toFixed(2);
    const currencyCode = currency === "USD" ? "840" : "116";

    // Build Subtag for Bakong Merchant Info (Tag 29)
    const bakongId = "bidzone_escrow@abaa";
    const sub00 = formatTlv("00", "bakong@abaa");
    const sub01 = formatTlv("01", bakongId);
    const sub02 = formatTlv("02", "ABA Bank");
    const tag29Value = `${sub00}${sub01}${sub02}`;

    // Build Additional Data (Tag 62)
    const refSub01 = formatTlv("01", reference);
    const refSub05 = formatTlv("05", "BIDZONE_ESCROW");
    const tag62Value = `${refSub01}${refSub05}`;

    // Assemble EMVCo TLV string without CRC
    let rawPayload = "";
    rawPayload += formatTlv("00", "01"); // Payload Format Indicator
    rawPayload += formatTlv("01", "12"); // Point of Initiation: Dynamic
    rawPayload += formatTlv("29", tag29Value); // Merchant Account Information
    rawPayload += formatTlv("52", "5999"); // Merchant Category Code
    rawPayload += formatTlv("53", currencyCode); // Currency
    rawPayload += formatTlv("54", formattedAmount); // Amount
    rawPayload += formatTlv("58", "KH"); // Country
    rawPayload += formatTlv("59", config.aba.merchantName); // Merchant Name
    rawPayload += formatTlv("60", config.aba.merchantCity); // City
    rawPayload += formatTlv("62", tag62Value); // Additional Data

    // Append CRC Tag and Length "6304" before calculation
    const payloadForCrc = `${rawPayload}6304`;
    const checksum = calculateKHQRCrc16(payloadForCrc);
    const fullKhqrString = `${payloadForCrc}${checksum}`;

    // Generate high-resolution QR image data URL
    const qrDataUrl = await QRCode.toDataURL(fullKhqrString, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 380,
      color: {
        dark: "#0b192c",
        light: "#ffffff",
      },
    });

    const payment: PaymentTransaction = {
      id: `pay-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      amount,
      currency,
      method: "ABA_KHQR",
      status: "PENDING",
      reference,
      qrString: fullKhqrString,
      qrImage: qrDataUrl,
      checkoutUrl: `https://link.payway.com.kh/khqr?qr=${encodeURIComponent(fullKhqrString)}`,
      metadata: {
        bank: "ABA Bank",
        network: "Bakong KHQR",
        merchantAccount: bakongId,
        merchantName: config.aba.merchantName,
        expiresInSeconds: 900, // 15 mins
      },
      createdAt: new Date().toISOString(),
    };

    await db.createPayment(payment);
    return payment;
  }

  /**
   * Creates a Stripe Payment Intent / Checkout Record
   */
  static async createStripeIntent(userId: string, amount: number, currency: string = "usd"): Promise<PaymentTransaction> {
    const reference = `STRIPE-BZ-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const clientSecret = `pi_${Date.now()}_secret_${Math.random().toString(36).substring(2, 12)}`;

    const payment: PaymentTransaction = {
      id: `pay-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      amount,
      currency: currency.toUpperCase(),
      method: "STRIPE",
      status: "PENDING",
      reference,
      clientSecret,
      checkoutUrl: `https://checkout.stripe.com/pay/${reference}`,
      metadata: {
        provider: "Stripe Escrow Payments",
        cardAccepted: ["Visa", "Mastercard", "Amex", "UnionPay"],
      },
      createdAt: new Date().toISOString(),
    };

    await db.createPayment(payment);
    return payment;
  }

  /**
   * Finalizes / confirms payment (can be called via API, Webhook, or Test Script)
   * Automatically credits wallet balance & available bidding power
   */
  static async confirmPayment(referenceOrId: string, metadataUpdates?: Record<string, any>): Promise<{
    success: boolean;
    payment?: PaymentTransaction;
    error?: string;
  }> {
    let payment = await db.getPaymentByReference(referenceOrId);
    if (!payment) {
      payment = await db.getPaymentById(referenceOrId);
    }

    if (!payment) {
      return { success: false, error: `Payment record with reference/id ${referenceOrId} not found.` };
    }

    if (payment.status === "COMPLETED") {
      return { success: true, payment };
    }

    const completedAt = new Date().toISOString();
    const updatedPayment = await db.updatePayment(payment.id, {
      status: "COMPLETED",
      completedAt,
      metadata: {
        ...(payment.metadata || {}),
        ...(metadataUpdates || {}),
      },
    });

    // Credit user's wallet
    const user = await db.getUserById(payment.userId);
    if (user) {
      const newBalance = user.walletBalance + payment.amount;
      const newPower = user.availableBiddingPower + payment.amount * 3;

      await db.updateUser(user.id, {
        walletBalance: newBalance,
        availableBiddingPower: newPower,
      });

      await db.addLog({
        userId: user.id,
        action: "PAYMENT_SETTLED",
        details: `Deposit of $${payment.amount.toLocaleString()} settled via ${payment.method} (Ref: ${payment.reference}). Wallet credited.`,
        severity: "info",
      });
    }

    return { success: true, payment: updatedPayment };
  }

  /**
   * Check status of a payment by reference or ID
   */
  static async getPaymentStatus(referenceOrId: string): Promise<PaymentTransaction | undefined> {
    const payment = await db.getPaymentByReference(referenceOrId);
    if (payment) return payment;
    return await db.getPaymentById(referenceOrId);
  }
}
