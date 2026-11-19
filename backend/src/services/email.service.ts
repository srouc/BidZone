import nodemailer, { Transporter } from "nodemailer";
import { config } from "../config/index.js";

export class EmailService {
  private static transporter: Transporter | null = null;

  private static getTransporter(): Transporter | null {
    if (this.transporter) return this.transporter;

    if (config.email.user && config.email.pass) {
      this.transporter = nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: config.email.secure,
        auth: {
          user: config.email.user,
          pass: config.email.pass,
        },
      });
      return this.transporter;
    }

    return null;
  }

  static async sendOtpEmail(toEmail: string, otpCode: string, purpose: string = "Account Verification"): Promise<{ sent: boolean; mode: "live_smtp" | "simulated"; previewCode: string }> {
    const subject = `[BidZone Security] Your Verification Passcode: ${otpCode}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; margin: 0; padding: 24px; color: #ffffff; }
          .container { max-width: 540px; margin: 0 auto; background: #111827; border: 1px solid #1f2937; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
          .header { background: linear-gradient(135deg, #1e3a8a 0%, #172554 100%); padding: 32px 24px; text-align: center; border-bottom: 1px solid #1e293b; }
          .logo { font-size: 26px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff; margin: 0; }
          .logo span { color: #3b82f6; }
          .subtitle { font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; margin-top: 6px; font-weight: 700; }
          .body { padding: 32px 28px; background: #0f172a; }
          .greeting { font-size: 16px; font-weight: 600; color: #f8fafc; margin-bottom: 12px; }
          .text { font-size: 14px; line-height: 1.6; color: #94a3b8; margin-bottom: 24px; }
          .otp-box { background: #1e293b; border: 2px dashed #3b82f6; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px; }
          .otp-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #60a5fa; font-weight: 700; margin-bottom: 8px; }
          .otp-code { font-family: 'SF Mono', Consolas, Monaco, monospace; font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #ffffff; text-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
          .expiry-note { font-size: 12px; color: #e2e8f0; margin-top: 8px; }
          .security-card { background: #182234; border: 1px solid #334155; border-radius: 10px; padding: 14px 18px; margin-bottom: 24px; font-size: 12px; color: #cbd5e1; }
          .footer { padding: 20px 28px; background: #090d16; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">Bid<span>Zone</span></h1>
            <div class="subtitle">Escrow Fiduciary & Live Auction Desk</div>
          </div>
          <div class="body">
            <div class="greeting">Security Verification Request</div>
            <p class="text">You have initiated a request for <strong>${purpose}</strong> on your BidZone authenticated account. Please enter the verification passcode below to complete your action.</p>
            
            <div class="otp-box">
              <div class="otp-label">One-Time Passcode (OTP)</div>
              <div class="otp-code">${otpCode}</div>
              <div class="expiry-note">⏱️ Expires in <strong>10 minutes</strong></div>
            </div>

            <div class="security-card">
              🛡️ <strong>Security Notice:</strong> BidZone Security Desk will never ask for your one-time passcode over telephone, chat, or third-party links. Never share this code with anyone.
            </div>
            
            <p class="text" style="font-size: 12px; margin-bottom: 0;">If you did not initiate this request, please contact our 24/7 Escrow Security desk immediately at security@bidzone.luxury.</p>
          </div>
          <div class="footer">
            &copy; 2026 BidZone Global Fiduciary Escrow Ltd. Zurich &middot; New York &middot; Singapore &middot; Phnom Penh.
          </div>
        </div>
      </body>
      </html>
    `;

    const transporter = this.getTransporter();
    if (transporter) {
      try {
        await transporter.sendMail({
          from: config.email.from,
          to: toEmail,
          subject,
          html,
          text: `Your BidZone verification code is: ${otpCode}. Valid for 10 minutes. Do not share this code.`
        });
        console.log(`✉️ [EmailService] Real SMTP OTP email sent to ${toEmail}`);
        return { sent: true, mode: "live_smtp", previewCode: otpCode };
      } catch (err: any) {
        console.warn(`⚠️ [EmailService] SMTP delivery failed: ${err.message}. Falling back to simulated log mode.`);
      }
    }

    // Development & Simulated Delivery Mode
    console.log(`\n==================================================`);
    console.log(`📨 [SIMULATED EMAIL DISPATCH - BIDZONE SECURITY]`);
    console.log(`To: ${toEmail}`);
    console.log(`Purpose: ${purpose}`);
    console.log(`🔑 ONE-TIME PASSCODE (OTP): ${otpCode}`);
    console.log(`Valid: 10 minutes (expires at: ${new Date(Date.now() + 10 * 60 * 1000).toLocaleTimeString()})`);
    console.log(`==================================================\n`);

    return { sent: true, mode: "simulated", previewCode: otpCode };
  }
}
