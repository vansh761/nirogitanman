import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { subscribeToNewsletter } from "database";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const bodySchema = z.object({ email: z.string().trim().email().max(200) });

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(`newsletter:${ip}`, { limit: 5, windowMs: 10 * 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  }

  try {
    const raw = await req.json();
    const parsed = bodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }

    await subscribeToNewsletter(parsed.data.email.toLowerCase());
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[newsletter] error:", err);
    return NextResponse.json({ error: "Could not subscribe" }, { status: 500 });
  }
}
