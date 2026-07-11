"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Check } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Button } from "@/components/ui/button";

export function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Something went wrong");
      setStatus("done");
      setForm({ name: "", email: "", message: "" });
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Something went wrong");
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="px-4 py-24">
      <div className="mx-auto max-w-xl">
        <SectionHeading eyebrow="Contact" title="Questions before you start?" />

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="mt-10 space-y-4 rounded-3xl border border-forest/10 dark:border-mint/10 bg-white/50 dark:bg-white/5 p-7"
        >
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
            className="w-full rounded-xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark px-4 py-3 text-sm font-body outline-none focus-visible:ring-2 focus-visible:ring-emerald"
          />
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@email.com"
            className="w-full rounded-xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark px-4 py-3 text-sm font-body outline-none focus-visible:ring-2 focus-visible:ring-emerald"
          />
          <textarea
            required
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="How can we help?"
            className="w-full rounded-xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark px-4 py-3 text-sm font-body outline-none focus-visible:ring-2 focus-visible:ring-emerald"
          />

          <Button type="submit" variant="primary" size="md" disabled={status === "loading"} className="w-full">
            {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : status === "done" ? <Check className="h-4 w-4" /> : "Send message"}
          </Button>

          {status === "done" && (
            <p className="text-center font-utility text-xs text-emerald">Sent — we&apos;ll reply within a day.</p>
          )}
          {status === "error" && (
            <p className="text-center font-utility text-xs text-red-500">{errorMsg || "Something went wrong. Please try again."}</p>
          )}
        </motion.form>
      </div>
    </section>
  );
}
