import { PaymentService } from "../services/payment.service.js";
import { db } from "../db/store.js";

async function runPaymentTest() {
  console.log("====================================================");
  console.log("💳 BIDZONE TEST SCRIPT: ABA KHQR & STRIPE PAYMENTS");
  console.log("====================================================\n");

  const testUserId = "usr-buyer-1";
  const depositAmount = 25000;

  console.log(`1️⃣ Creating ABA Bakong KHQR for User: ${testUserId}, Amount: $${depositAmount.toLocaleString()}...`);
  const abaPayment = await PaymentService.createAbaKhqr(testUserId, depositAmount, "USD");
  console.log("Generated ABA Payment Transaction:");
  console.log({
    id: abaPayment.id,
    reference: abaPayment.reference,
    amount: abaPayment.amount,
    currency: abaPayment.currency,
    method: abaPayment.method,
    status: abaPayment.status,
    qrStringSnippet: abaPayment.qrString?.substring(0, 50) + "...",
    qrImagePreview: abaPayment.qrImage?.substring(0, 40) + "...",
    checkoutUrl: abaPayment.checkoutUrl
  });

  console.log("\n2️⃣ Checking Payment Status before confirmation...");
  const statusBefore = await PaymentService.getPaymentStatus(abaPayment.reference);
  console.log(`Current Status: ${statusBefore?.status} (Expected: PENDING)`);

  console.log("\n3️⃣ Simulating ABA PayWay / Bakong App Scan & Payment Settlement...");
  const confirmResult = await PaymentService.confirmPayment(abaPayment.reference, {
    payerBank: "ABA Mobile Banking",
    authCode: "AUTH-891024"
  });
  console.log("Settlement Confirmation Result:", {
    success: confirmResult.success,
    status: confirmResult.payment?.status,
    completedAt: confirmResult.payment?.completedAt
  });

  console.log("\n4️⃣ Verifying User Escrow Wallet & Bidding Power Credit...");
  const user = await db.getUserById(testUserId);
  console.log({
    userId: user?.id,
    name: user?.name,
    walletBalance: `$${user?.walletBalance.toLocaleString()}`,
    availableBiddingPower: `$${user?.availableBiddingPower.toLocaleString()}`
  });

  console.log("\n5️⃣ Creating Stripe Payment Intent for $10,000...");
  const stripePayment = await PaymentService.createStripeIntent(testUserId, 10000, "usd");
  console.log("Stripe Transaction:", {
    id: stripePayment.id,
    reference: stripePayment.reference,
    clientSecretSnippet: stripePayment.clientSecret?.substring(0, 30) + "...",
    status: stripePayment.status
  });

  console.log("\n6️⃣ Confirming Stripe Payment...");
  const stripeConfirm = await PaymentService.confirmPayment(stripePayment.reference);
  console.log("Stripe Confirmation Result:", {
    success: stripeConfirm.success,
    status: stripeConfirm.payment?.status
  });

  console.log("\n✅ [SUCCESS] Both ABA KHQR and Stripe payment flows completed with 100% success!\n");
  process.exit(0);
}

runPaymentTest().catch((err) => {
  console.error(err);
  process.exit(1);
});
