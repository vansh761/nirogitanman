"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const QUICK_PROMPTS = [
  "Suggest a diet for my Kapha dosha",
  "Simple morning yoga routine",
  "Ayurvedic tips for better sleep",
  "What foods aggravate Pitta?",
];

export function NiroAIWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Namaste 🙏 I'm **Niro AI**. Ask me about diet, yoga, daily routines, or general Ayurveda-based wellness guidance.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionId = useMemo(
    () => (typeof crypto !== "undefined" ? crypto.randomUUID() : `sess-${Date.now()}`),
    []
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, sessionId }),
      });

      if (!res.body) throw new Error("No stream body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "Sorry, I couldn't reach Niro AI just now. Please try again in a moment.",
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-emerald text-white shadow-2xl px-5 py-4 font-utility text-sm font-medium",
          open && "hidden"
        )}
      >
        <Sparkles className="h-5 w-5" />
        Ask Niro AI
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[380px] max-w-[92vw] flex-col overflow-hidden rounded-3xl border border-forest/10 bg-canvas dark:bg-canvas-dark dark:border-mint/10 shadow-2xl"
          >
            <div className="flex items-center justify-between bg-forest dark:bg-mint px-4 py-3">
              <div className="flex items-center gap-2 text-canvas dark:text-forest">
                <Sparkles className="h-4 w-4" />
                <span className="font-display font-semibold text-sm">Niro AI</span>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat">
                <X className="h-4 w-4 text-canvas dark:text-forest" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm font-body leading-relaxed [&_p]:my-1 [&_ul]:my-1 [&_ul]:pl-4 [&_ul]:list-disc [&_strong]:font-semibold",
                    m.role === "user"
                      ? "ml-auto bg-emerald text-white rounded-br-sm"
                      : "bg-forest/5 dark:bg-mint/10 text-forest dark:text-mint rounded-bl-sm"
                  )}
                >
                  {m.content ? (
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                </div>
              ))}

              {messages.length === 1 && (
                <div className="grid grid-cols-1 gap-2 pt-2">
                  {QUICK_PROMPTS.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="text-left rounded-xl border border-forest/10 dark:border-mint/15 px-3 py-2 text-xs font-utility text-forest/80 dark:text-mint/80 hover:bg-forest/5 dark:hover:bg-mint/10 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <p className="px-4 pb-1 font-utility text-[10px] text-forest/45 dark:text-mint/45">
              Educational only — not a substitute for medical advice.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-forest/10 dark:border-mint/10 p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about diet, yoga, routines..."
                className="flex-1 rounded-full bg-forest/5 dark:bg-mint/10 px-4 py-2.5 text-sm font-body text-forest dark:text-mint placeholder:text-forest/40 dark:placeholder:text-mint/40 outline-none focus-visible:ring-2 focus-visible:ring-emerald"
              />
              <button
                type="submit"
                disabled={loading}
                aria-label="Send"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald text-white disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
