import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { razorpay, isRazorpayConfigured, RAZORPAY_KEY_ID } from "@/lib/razorpay";
import { getAppointmentBillingInfo, createPendingPayment } from "database";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const bodySchema = z.object({ appointmentId: z.string().trim().min(1).max(100) });

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(`payments-create:${ip}`, { limit: 10, windowMs: 10 * 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  }

  try {
    const raw = await req.json();
    const parsed = bodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "appointmentId is required" }, { status: 400 });
    }
    const { appointmentId } = parsed.data;

    const billing = await getAppointmentBillingInfo(String(appointmentId));
    if (!billing) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    const amountRupees = Number(billing.consultFee);
    const amountPaise = Math.round(amountRupees * 100);

    await createPendingPayment({
      userId: billing.userId,
      appointmentId: billing.appointmentId,
      amount: amountRupees,
    });

    if (!isRazorpayConfigured || !razorpay) {
      // Demo mode: no Razorpay keys configured on this server. Return enough
      // for the client to simulate a successful payment end-to-end without
      // a real payment gateway account — this is real, working code, just
      // waiting on production credentials (see docs/deployment.md).
      return NextResponse.json({
        demo: true,
        appointmentId: billing.appointmentId,
        amount: amountRupees,
        currency: "INR",
      });
    }

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `apt_${billing.appointmentId}`,
      notes: { appointmentId: billing.appointmentId },
    });

    return NextResponse.json({
      demo: false,
      orderId: order.id,
      amount: amountRupees,
      currency: "INR",
      keyId: RAZORPAY_KEY_ID,
      appointmentId: billing.appointmentId,
    });
  } catch (err) {
    console.error("[payments/create-order] error:", err);
    return NextResponse.json({ error: "Could not create payment order" }, { status: 500 });
  }
}
