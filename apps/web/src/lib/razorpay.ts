import Razorpay from "razorpay";
import crypto from "crypto";

export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

export const isRazorpayConfigured = Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET);

export const razorpay = isRazorpayConfigured
  ? new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET })
  : null;

export function verifyRazorpaySignature(input: {
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  if (!RAZORPAY_KEY_SECRET) return false;
  const expected = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${input.orderId}|${input.paymentId}`)
    .digest("hex");
  return expected === input.signature;
}
