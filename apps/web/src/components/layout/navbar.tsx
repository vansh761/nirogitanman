"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Moon, Sun, Menu, X, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Why Ayurveda", href: "#why-ayurveda" },
  { label: "Services", href: "#services" },
  { label: "Niro AI", href: "#ai-assistant" },
  { label: "Doctors", href: "#doctors" },
  { label: "Blog", href: "#blog" },
];

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3001";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={cn(
          "flex w-full max-w-6xl items-center justify-between rounded-2xl px-5 py-3 transition-all duration-300",
          scrolled
            ? "bg-canvas/70 dark:bg-canvas-dark/70 backdrop-blur-xl border border-forest/10 dark:border-mint/10 shadow-[0_8px_30px_-12px_rgba(11,59,46,0.25)]"
            : "bg-transparent border border-transparent"
        )}
      >
        <Link href="#top" className="flex items-center gap-2 font-display font-semibold text-lg text-forest dark:text-mint">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          Niro Ayurveda
        </Link>

        <div className="hidden md:flex items-center gap-1 font-utility text-sm">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-forest/80 hover:text-forest hover:bg-forest/5 dark:text-mint/80 dark:hover:text-mint dark:hover:bg-mint/10 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button
            aria-label="Toggle dark mode"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-10 w-10 items-center justify-center rounded-full text-forest hover:bg-forest/5 dark:text-mint dark:hover:bg-mint/10 transition-colors"
          >
            {mounted && theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <a
            href={`${DASHBOARD_URL}/login`}
            className="inline-flex items-center rounded-full px-4 py-2 text-sm font-utility font-medium text-forest hover:bg-forest/5 dark:text-mint dark:hover:bg-mint/10 transition-colors"
          >
            Log in
          </a>
          <a href="#consultation">
            <Button variant="primary" size="sm">Book consultation</Button>
          </a>
        </div>

        <button
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-full text-forest dark:text-mint"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden absolute top-20 inset-x-4 rounded-2xl bg-canvas dark:bg-canvas-dark border border-forest/10 dark:border-mint/10 shadow-xl p-4 flex flex-col gap-1 font-utility text-sm">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-forest dark:text-mint hover:bg-forest/5 dark:hover:bg-mint/10">
              {link.label}
            </a>
          ))}
          <a href="#consultation" onClick={() => setOpen(false)}>
            <Button variant="primary" size="md" className="mt-2 w-full">Book consultation</Button>
          </a>
          <a
            href={`${DASHBOARD_URL}/login`}
            className="rounded-xl px-4 py-3 text-center font-utility text-sm text-forest/70 dark:text-mint/70 hover:bg-forest/5 dark:hover:bg-mint/10"
          >
            Log in
          </a>
        </div>
      )}
    </motion.header>
  );
}
