"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { TESTIMONIALS as MOCK_TESTIMONIALS } from "@/lib/mock-data";

type TestimonialItem = { name: string; role: string | null; message: string; rating: number };

export function Testimonials({ testimonials }: { testimonials?: TestimonialItem[] }) {
  const list = testimonials && testimonials.length > 0 ? testimonials : MOCK_TESTIMONIALS;

  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Testimonials" title="What members say after their first week" />

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {list.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="rounded-3xl border border-forest/10 dark:border-mint/10 bg-white/50 dark:bg-white/5 p-7"
            >
              <Quote className="h-6 w-6 text-emerald/40" />
              <p className="mt-3 font-body text-sm text-forest/80 dark:text-mint/80">{t.message}</p>
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="font-display text-sm font-semibold text-forest dark:text-mint">{t.name}</p>
                  <p className="font-utility text-xs text-forest/50 dark:text-mint/50">{t.role}</p>
                </div>
                <div className="flex text-saffron">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
