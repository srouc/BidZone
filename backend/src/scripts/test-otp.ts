import { OtpService } from "../services/otp.service.js";

async function runOtpTest() {
  console.log("====================================================");
  console.log("🧪 BIDZONE TEST SCRIPT: EMAIL OTP & 2FA VERIFICATION");
  console.log("====================================================\n");

  const testEmail = "collector.vip@bidzone.luxury";
  console.log(`1️⃣ Requesting OTP for: ${testEmail}...`);
  const reqResult = await OtpService.requestOtp(testEmail, "REGISTRATION");
  console.log("Response:", reqResult);

  if (!reqResult.success) {
    console.error("❌ Failed to request OTP");
    process.exit(1);
  }

  const generatedCode = reqResult.previewCode!;
  console.log(`\n2️⃣ Generated Passcode is: [ ${generatedCode} ]`);

  console.log("\n3️⃣ Testing Invalid OTP submission ('000000')...");
  const failCheck = await OtpService.verifyOtp(testEmail, "000000", "REGISTRATION");
  console.log("Result (expected fail):", failCheck);

  console.log(`\n4️⃣ Testing Valid OTP submission ('${generatedCode}')...`);
  const passCheck = await OtpService.verifyOtp(testEmail, generatedCode, "REGISTRATION");
  console.log("Result (expected success):", passCheck);

  if (passCheck.valid) {
    console.log("\n✅ [SUCCESS] Email OTP generation and verification flow works perfectly!\n");
  } else {
    console.error("\n❌ [FAIL] Valid OTP was rejected.\n");
  }
  process.exit(0);
}

runOtpTest().catch((err) => {
  console.error(err);
  process.exit(1);
});
