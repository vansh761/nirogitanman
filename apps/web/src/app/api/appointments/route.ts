import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAppointment } from "database";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/sanitize";

const DATE_OFFSETS: Record<string, number> = {
  Today: 0,
  Tomorrow: 1,
  "In 2 days": 2,
};

const bodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  doctorId: z.string().trim().min(1).max(100),
  date: z.string().trim().max(20),
  slot: z.string().trim().min(1).max(20),
  symptoms: z.string().trim().min(1).max(2000),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(`appointments:${ip}`, { limit: 10, windowMs: 10 * 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many booking attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    );
  }

  try {
    const raw = await req.json();
    const parsed = bodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    const { name, email, doctorId, date, slot, symptoms } = parsed.data;

    const offsetDays = DATE_OFFSETS[date] ?? 0;
    const appointmentDate = new Date();
    appointmentDate.setDate(appointmentDate.getDate() + offsetDays);

    const result = await createAppointment({
      name: sanitizeText(name),
      email: email.toLowerCase(),
      doctorId,
      date: appointmentDate.toISOString(),
      slot,
      symptoms: sanitizeText(symptoms),
    });

    return NextResponse.json({ id: result.id }, { status: 201 });
  } catch (err) {
    console.error("[appointments] error:", err);
    return NextResponse.json({ error: "Could not create appointment" }, { status: 500 });
  }
}
