"use client";

import { motion } from "framer-motion";
import {
  Stethoscope,
  Sparkles,
  Salad,
  PersonStanding,
  FlaskConical,
  LineChart,
} from "lucide-react";
import { SectionHeading } from "./section-heading";
import { SERVICES } from "@/lib/mock-data";

const ICONS = [Stethoscope, Sparkles, Salad, PersonStanding, FlaskConical, LineChart];

export function Services() {
  return (
    <section id="services" className="px-4 py-24 bg-forest/[0.03] dark:bg-mint/[0.03]">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Our services"
          title="Everything from a first consult to daily routine"
        />

        <div className="mt-14 grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {SERVICES.map((service, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display font-semibold text-forest dark:text-mint">
                  {service.title}
                </h3>
                <p className="mt-1.5 font-body text-sm text-forest/65 dark:text-mint/65">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
