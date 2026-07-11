"use client";

import { motion } from "framer-motion";
import { Sparkles, MessageCircle, Salad, PersonStanding } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Button } from "@/components/ui/button";

const CAPABILITIES = [
  { icon: MessageCircle, label: "General health guidance" },
  { icon: Salad, label: "Diet suggestions" },
  { icon: PersonStanding, label: "Yoga & lifestyle routines" },
  { icon: Sparkles, label: "Basic precautions" },
];

export function AIAssistantShowcase() {
  return (
    <section id="ai-assistant" className="px-4 py-24 bg-forest/[0.03] dark:bg-mint/[0.03]">
      <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-12 items-center">
        <div>
          <SectionHeading
            eyebrow="Niro AI"
            title="A calm, knowledgeable first stop"
            align="left"
            description="Ask anything about diet, yoga, or daily routine. Niro AI answers in plain language, grounded in classical Ayurveda — and tells you when it's time to see a real doctor."
            className="mx-0"
          />

          <div className="mt-8 grid grid-cols-2 gap-3">
            {CAPABILITIES.map((cap) => (
              <div key={cap.label} className="flex items-center gap-2 rounded-xl border border-forest/10 dark:border-mint/10 px-3 py-2.5">
                <cap.icon className="h-4 w-4 text-emerald shrink-0" />
                <span className="font-utility text-xs text-forest/80 dark:text-mint/80">{cap.label}</span>
              </div>
            ))}
          </div>

          <p className="mt-6 font-utility text-xs text-forest/50 dark:text-mint/50">
            Educational purposes only — Niro AI does not replace medical professionals.
          </p>

          <div className="mt-4">
            <a href="#top">
              <Button variant="primary" size="lg">Try Niro AI — bottom right</Button>
            </a>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark p-6 shadow-xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-emerald" />
            <span className="font-display font-semibold text-sm text-forest dark:text-mint">Niro AI</span>
          </div>
          <div className="space-y-3">
            <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-forest/5 dark:bg-mint/10 px-4 py-2.5 text-sm text-forest dark:text-mint">
              What should I eat for better digestion?
            </div>
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-emerald text-white px-4 py-2.5 text-sm">
              Favor warm, cooked meals with ginger and cumin. Avoid cold drinks with food, and try to eat your largest meal at midday.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
