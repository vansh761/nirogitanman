"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";

export function Sidebar({
  items,
  userName,
  role,
}: {
  items: { label: string; href: string }[];
  userName: string;
  role: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark p-4 flex flex-col">
      <a href={WEB_URL} className="flex items-center gap-2 px-2 py-2 font-display font-semibold text-forest dark:text-mint hover:text-emerald transition-colors">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald text-white">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        Niro Ayurveda
      </a>

      <nav className="mt-4 flex-1 space-y-0.5 overflow-y-auto">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-xl px-3 py-2.5 font-utility text-sm transition-colors",
                active
                  ? "bg-emerald/10 text-emerald font-medium"
                  : "text-forest/70 dark:text-mint/70 hover:bg-forest/5 dark:hover:bg-mint/10"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <a
        href={WEB_URL}
        className="flex items-center gap-1.5 rounded-xl px-3 py-2 font-utility text-xs text-forest/50 dark:text-mint/50 hover:text-emerald transition-colors"
      >
        <ExternalLink className="h-3 w-3" /> Back to website
      </a>

      <div className="mt-2 rounded-xl bg-forest/5 dark:bg-mint/10 px-3 py-2.5">
        <p className="font-utility text-sm font-medium text-forest dark:text-mint truncate">{userName}</p>
        <p className="font-utility text-[11px] text-forest/50 dark:text-mint/50">{role}</p>
      </div>
    </aside>
  );
}
