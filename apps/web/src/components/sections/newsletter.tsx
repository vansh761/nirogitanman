"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl rounded-3xl bg-forest dark:bg-mint px-8 py-12 text-center"
      >
        <h3 className="font-display text-2xl md:text-3xl font-semibold text-canvas dark:text-forest">
          Weekly Ayurveda tips, no spam
        </h3>
        <p className="mt-2 font-body text-canvas/70 dark:text-forest/70">
          One short email a week — a routine tip, a seasonal note, nothing else.
        </p>

        {done ? (
          <p className="mt-6 inline-flex items-center gap-2 font-utility text-sm text-canvas dark:text-forest">
            <Check className="h-4 w-4" /> You&apos;re on the list.
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
              })
                .then((res) => {
                  if (res.ok) setDone(true);
                })
                .catch(() => {});
            }}
            className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="flex-1 rounded-full px-5 py-3 text-sm font-body bg-canvas/10 dark:bg-forest/10 text-canvas dark:text-forest placeholder:text-canvas/50 dark:placeholder:text-forest/50 outline-none focus-visible:ring-2 focus-visible:ring-saffron"
            />
            <Button type="submit" variant="primary" size="md">
              <Send className="h-4 w-4" /> Subscribe
            </Button>
          </form>
        )}
      </motion.div>
    </section>
  );
}
