import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { markNotificationRead, markAllNotificationsRead } from "database";

const bodySchema = z.object({ id: z.string().optional(), all: z.boolean().optional() });

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = await req.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    if (parsed.data.all) {
      await markAllNotificationsRead(session.user.id as string);
    } else if (parsed.data.id) {
      await markNotificationRead(parsed.data.id);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[notifications/read] error:", err);
    return NextResponse.json({ error: "Could not update notification" }, { status: 500 });
  }
}
