import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyRazorpaySignature, isRazorpayConfigured } from "@/lib/razorpay";
import { markPaymentSuccess, getPaymentForAppointment } from "database";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const bodySchema = z.object({
  appointmentId: z.string().trim().min(1).max(100),
  razorpay_order_id: z.string().optional(),
  razorpay_payment_id: z.string().optional(),
  razorpay_signature: z.string().optional(),
  demo: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(`payments-verify:${ip}`, { limit: 20, windowMs: 10 * 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  }

  try {
    const raw = await req.json();
    const parsed = bodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "appointmentId is required" }, { status: 400 });
    }
    const { appointmentId, razorpay_order_id, razorpay_payment_id, razorpay_signature, demo } = parsed.data;

    const payment = await getPaymentForAppointment(String(appointmentId));
    if (!payment) {
      return NextResponse.json({ error: "No payment found for this appointment" }, { status: 404 });
    }

    if (isRazorpayConfigured && !demo) {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json({ error: "Missing Razorpay verification fields" }, { status: 400 });
      }
      const valid = verifyRazorpaySignature({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      });
      if (!valid) {
        return NextResponse.json({ error: "Payment signature verification failed" }, { status: 400 });
      }
      await markPaymentSuccess({ appointmentId: String(appointmentId), providerRefId: razorpay_payment_id });
    } else {
      // Demo mode — no live gateway credentials configured on this server.
      await markPaymentSuccess({
        appointmentId: String(appointmentId),
        providerRefId: `demo_${Date.now()}`,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[payments/verify] error:", err);
    return NextResponse.json({ error: "Could not verify payment" }, { status: 500 });
  }
}
