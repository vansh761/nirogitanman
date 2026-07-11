"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { STATS } from "@/lib/mock-data";

export function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="px-4 py-16">
      <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-2xl border border-forest/10 dark:border-mint/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm p-6 text-center"
          >
            <p className="font-display text-3xl md:text-4xl font-semibold text-emerald">{stat.value}</p>
            <p className="mt-1 font-utility text-xs md:text-sm text-forest/70 dark:text-mint/70">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
