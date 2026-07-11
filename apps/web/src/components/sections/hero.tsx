"use client";

import { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Stethoscope, Sparkles, Leaf, ShieldCheck, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/magnetic-button";

function AuroraBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div
        className="aurora-blob-1 absolute -top-32 -left-20 h-[420px] w-[420px] rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(circle, #A9E8C8 0%, transparent 70%)" }}
      />
      <div
        className="aurora-blob-2 absolute top-10 right-[-100px] h-[480px] w-[480px] rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(circle, #4E8FBF 0%, transparent 70%)" }}
      />
      <div
        className="aurora-blob-1 absolute bottom-[-160px] left-1/3 h-[360px] w-[360px] rounded-full blur-3xl opacity-25"
        style={{ background: "radial-gradient(circle, #E8823C 0%, transparent 70%)", animationDelay: "3s" }}
      />
    </div>
  );
}

const LEAF_PARTICLES = [
  { left: "8%", duration: 9, delay: 0 },
  { left: "22%", duration: 12, delay: 2 },
  { left: "68%", duration: 10, delay: 1 },
  { left: "82%", duration: 13, delay: 3.5 },
  { left: "45%", duration: 11, delay: 4.5 },
];

function FloatingLeaves() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {LEAF_PARTICLES.map((leaf, i) => (
        <Leaf
          key={i}
          className="leaf-particle absolute h-4 w-4 text-emerald/40 dark:text-mint/30 bottom-0"
          style={{ left: leaf.left, animationDuration: `${leaf.duration}s`, animationDelay: `${leaf.delay}s` }}
        />
      ))}
    </div>
  );
}

function BreathRing() {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800 }}
      className="relative flex items-center justify-center h-[420px] w-[420px] mx-auto"
    >
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="ringGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A9E8C8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#128A5D" stopOpacity="0.1" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="170" fill="url(#ringGrad)" className="breathe-ring" />
        <circle cx="200" cy="200" r="130" fill="none" stroke="#128A5D" strokeOpacity="0.35" strokeWidth="1.5" className="breathe-ring breathe-ring-delay-1" />
        <circle cx="200" cy="200" r="95" fill="none" stroke="#4E8FBF" strokeOpacity="0.4" strokeWidth="1.5" className="breathe-ring breathe-ring-delay-2" />
      </svg>

      <div className="relative z-10 flex h-32 w-32 items-center justify-center rounded-full bg-forest/90 dark:bg-mint/90 text-canvas dark:text-forest shadow-2xl">
        <Leaf className="h-12 w-12" />
      </div>

      {/* Floating glass cards — stats, AI preview, consultation preview */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        style={{ transform: "translateZ(40px)" }}
        className="absolute -left-6 top-6 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl px-4 py-3"
      >
        <p className="font-display text-2xl font-semibold text-forest dark:text-mint">120+</p>
        <p className="font-utility text-xs text-forest/70 dark:text-mint/70">Verified Vaidyas</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        style={{ transform: "translateZ(60px)" }}
        className="absolute -right-8 bottom-10 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl px-4 py-3 flex items-center gap-2"
      >
        <Sparkles className="h-4 w-4 text-saffron" />
        <div>
          <p className="font-display text-sm font-semibold text-forest dark:text-mint">Niro AI</p>
          <p className="font-utility text-[11px] text-forest/70 dark:text-mint/70">Always on call</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        style={{ transform: "translateZ(50px)" }}
        className="absolute right-2 top-16 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl px-4 py-3 flex items-center gap-2"
      >
        <Stethoscope className="h-4 w-4 text-sky" />
        <p className="font-utility text-xs text-forest/80 dark:text-mint/80">Slot in 14 min</p>
      </motion.div>
    </motion.div>
  );
}

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "BAMS-verified doctors" },
  { icon: Star, label: "4.8 average rating" },
  { icon: Sparkles, label: "AI guidance, always free to try" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-40 pb-20 px-4">
      <AuroraBackground />
      <FloatingLeaves />

      <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-emerald/10 text-emerald px-4 py-1.5 font-utility text-xs font-medium tracking-wide uppercase"
          >
            Ayurveda, on your schedule
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 font-display text-5xl md:text-6xl font-semibold leading-[1.05] text-forest dark:text-mint"
          >
            Ancient wisdom,
            <br />
            <span className="text-emerald">measured in minutes.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-md font-body text-lg text-forest/70 dark:text-mint/70"
          >
            Talk to a verified Ayurvedic doctor, or ask Niro AI for a personalised
            diet, yoga and lifestyle plan — grounded in classical Ayurveda,
            explained in plain language.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <MagneticButton>
              <a href="#consultation">
                <Button size="lg" variant="primary" className="group">
                  Book a consultation
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </a>
            </MagneticButton>
            <MagneticButton>
              <a href="#ai-assistant">
                <Button size="lg" variant="outline">Ask Niro AI</Button>
              </a>
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-7 flex flex-wrap gap-x-5 gap-y-2"
          >
            {TRUST_BADGES.map((badge) => (
              <div key={badge.label} className="flex items-center gap-1.5">
                <badge.icon className="h-3.5 w-3.5 text-emerald" />
                <span className="font-utility text-xs text-forest/60 dark:text-mint/60">{badge.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-4 font-utility text-xs text-forest/50 dark:text-mint/50"
          >
            Niro AI is for educational purposes only and does not replace medical professionals.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <BreathRing />
        </motion.div>
      </div>

      <motion.a
        href="#why-ayurveda"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="scroll-indicator absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-forest/40 dark:text-mint/40"
        aria-label="Scroll to next section"
      >
        <span className="font-utility text-[10px] uppercase tracking-wide">Scroll</span>
        <ChevronDown className="h-4 w-4" />
      </motion.a>
    </section>
  );
}
