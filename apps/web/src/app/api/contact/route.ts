import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createContactMessage } from "database";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/sanitize";

const bodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(1).max(3000),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(`contact:${ip}`, { limit: 5, windowMs: 10 * 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many messages sent. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    );
  }

  try {
    const raw = await req.json();
    const parsed = bodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }

    await createContactMessage({
      name: sanitizeText(parsed.data.name),
      email: parsed.data.email.toLowerCase(),
      message: sanitizeText(parsed.data.message),
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[contact] error:", err);
    return NextResponse.json({ error: "Could not send message" }, { status: 500 });
  }
}
