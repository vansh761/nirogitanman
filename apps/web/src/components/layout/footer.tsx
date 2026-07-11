"use client";

import { ArrowUp, Sparkles } from "lucide-react";

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3001";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Services", href: "#services" },
      { label: "Niro AI", href: "#ai-assistant" },
      { label: "Doctors", href: "#doctors" },
      { label: "Blog", href: "#blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Why Ayurveda", href: "#why-ayurveda" },
      { label: "FAQ", href: "#faq" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", href: `${DASHBOARD_URL}/login` },
      { label: "Dashboard", href: `${DASHBOARD_URL}/dashboard` },
      { label: "Editor tools", href: `${DASHBOARD_URL}/dashboard/editor` },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-forest/10 dark:border-mint/10 px-4 py-16 relative">
      <div className="mx-auto max-w-6xl grid sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 font-display font-semibold text-forest dark:text-mint">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            Niro Ayurveda
          </div>
          <p className="mt-3 font-body text-sm text-forest/60 dark:text-mint/60">
            Ancient wisdom, modern care. Educational AI guidance plus real, verified doctors.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="font-utility text-xs font-semibold uppercase tracking-wide text-forest/50 dark:text-mint/50">
              {col.title}
            </p>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="font-body text-sm text-forest/70 dark:text-mint/70 hover:text-emerald transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-6xl mt-12 pt-6 border-t border-forest/10 dark:border-mint/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-utility text-xs text-forest/50 dark:text-mint/50">
          © {new Date().getFullYear()} Niro Ayurveda. Educational content only — not a substitute for professional medical advice.
        </p>
        <a
          href="#top"
          className="flex items-center gap-1.5 font-utility text-xs text-forest/60 dark:text-mint/60 hover:text-emerald transition-colors"
        >
          Back to top <ArrowUp className="h-3.5 w-3.5" />
        </a>
      </div>
    </footer>
  );
}
