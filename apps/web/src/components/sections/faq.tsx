"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { FAQS as MOCK_FAQS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type FaqItem = { question: string; answer: string };

export function FAQ({ faqs }: { faqs?: FaqItem[] }) {
  const list = faqs && faqs.length > 0 ? faqs : MOCK_FAQS;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="px-4 py-24">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Answers before you ask" />

        <div className="mt-10 space-y-3">
          {list.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.question} className="rounded-2xl border border-forest/10 dark:border-mint/10 overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-display font-medium text-forest dark:text-mint">{faq.question}</span>
                  <Plus className={cn("h-4 w-4 text-emerald transition-transform", isOpen && "rotate-45")} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 font-body text-sm text-forest/70 dark:text-mint/70">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
