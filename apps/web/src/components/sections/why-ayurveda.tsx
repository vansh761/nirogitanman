"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Leaf } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { WHY_AYURVEDA } from "@/lib/mock-data";

export function WhyAyurveda() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const y2 = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section id="why-ayurveda" ref={ref} className="relative px-4 py-24 overflow-hidden">
      {/* Parallax botanical background layer */}
      <motion.div style={{ y: y1 }} className="absolute -left-16 top-10 -z-10 opacity-[0.06] dark:opacity-[0.08]">
        <Leaf className="h-64 w-64 text-emerald" />
      </motion.div>
      <motion.div style={{ y: y2 }} className="absolute -right-10 bottom-0 -z-10 opacity-[0.05] dark:opacity-[0.07]">
        <Leaf className="h-48 w-48 text-sky rotate-45" />
      </motion.div>

      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Why Ayurveda"
          title="Medicine that treats the pattern, not just the day"
          description="Most complaints trace back to digestion, sleep and daily rhythm. Ayurveda works upstream of the symptom."
        />

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {WHY_AYURVEDA.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-forest/10 dark:border-mint/10 p-7 bg-white/40 dark:bg-white/5 transition-shadow hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-mint/60 text-forest">
                <Leaf className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-forest dark:text-mint">
                {item.title}
              </h3>
              <p className="mt-2 font-body text-sm text-forest/70 dark:text-mint/70">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
