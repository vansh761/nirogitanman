import { NextRequest } from "next/server";
import { groq, NIRO_AI_SYSTEM_PROMPT, GROQ_MODEL } from "@/lib/groq";
import { logAiChatMessage } from "database";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(`ai-chat:${ip}`, { limit: 20, windowMs: 10 * 60_000 });
  if (!rl.allowed) {
    return new Response(
      JSON.stringify({ error: "You're sending messages too quickly. Please wait a moment and try again." }),
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    );
  }

  try {
    const body = await req.json();
    const messages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages : [];
    const sessionId: string = typeof body?.sessionId === "string" ? body.sessionId : "unknown-session";

    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages is required" }), { status: 400 });
    }

    // Basic guardrails: cap history length + message size to control cost/abuse.
    const trimmed = messages.slice(-20).map((m) => ({
      role: m.role,
      content: String(m.content).slice(0, 4000),
    }));

    const lastUserMessage = trimmed[trimmed.length - 1];
    if (lastUserMessage?.role === "user") {
      logAiChatMessage({ sessionId, role: "user", content: lastUserMessage.content }).catch(() => {});
    }

    if (!process.env.GROQ_API_KEY) {
      return new Response(
        JSON.stringify({
          error:
            "AI assistant is not configured on this server. Add GROQ_API_KEY to your environment.",
        }),
        { status: 503 }
      );
    }

    const stream = await groq.chat.completions.create({
      model: GROQ_MODEL,
      stream: true,
      temperature: 0.6,
      max_tokens: 800,
      messages: [{ role: "system", content: NIRO_AI_SYSTEM_PROMPT }, ...trimmed],
    });

    const encoder = new TextEncoder();
    let full = "";
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content || "";
            if (delta) {
              full += delta;
              controller.enqueue(encoder.encode(delta));
            }
          }
        } catch {
          controller.enqueue(encoder.encode("\n\n[Niro AI hit an error. Please try again.]"));
        } finally {
          controller.close();
          if (full) {
            logAiChatMessage({ sessionId, role: "assistant", content: full }).catch(() => {});
          }
        }
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("[niro-ai] chat route error:", err);
    return new Response(JSON.stringify({ error: "Something went wrong." }), { status: 500 });
  }
}
