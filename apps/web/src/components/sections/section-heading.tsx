"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      <span className="inline-flex items-center rounded-full bg-emerald/10 text-emerald px-3 py-1 font-utility text-xs font-medium uppercase tracking-wide">
        {eyebrow}
      </span>
      <h2 className="mt-4 font-display text-3xl md:text-4xl font-semibold text-forest dark:text-mint">
        {title}
      </h2>
      {description && (
        <p className="mt-3 font-body text-forest/70 dark:text-mint/70">{description}</p>
      )}
    </motion.div>
  );
}
