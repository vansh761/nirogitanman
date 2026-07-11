"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import { Search, Bell, Moon, Sun, ChevronDown, LogOut, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { label: string; href: string };
type NotificationItem = { id: string; title: string; body: string; isRead: boolean; createdAt: string };

export function Topbar({
  navItems,
  userName,
  userEmail,
  role,
  initialNotifications,
}: {
  navItems: NavItem[];
  userName: string;
  userEmail: string;
  role: string;
  initialNotifications: NotificationItem[];
}) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const filteredNav = query
    ? navItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
    : navItems;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  async function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    await fetch("/api/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => {});
  }

  async function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await fetch("/api/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    }).catch(() => {});
  }

  return (
    <header className="flex items-center justify-between gap-4 border-b border-forest/10 dark:border-mint/10 px-6 py-3">
      {/* Quick nav search */}
      <div ref={searchRef} className="relative flex-1 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-forest/40 dark:text-mint/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setSearchOpen(true)}
          placeholder="Search pages…"
          className="w-full rounded-full bg-forest/5 dark:bg-mint/10 pl-9 pr-3 py-2 text-sm font-body text-forest dark:text-mint placeholder:text-forest/40 dark:placeholder:text-mint/40 outline-none focus-visible:ring-2 focus-visible:ring-emerald"
        />
        {searchOpen && query && (
          <div className="absolute top-full mt-2 w-full rounded-xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark shadow-lg overflow-hidden z-50">
            {filteredNav.length === 0 && (
              <p className="px-4 py-3 font-utility text-xs text-forest/40 dark:text-mint/40">No pages match &quot;{query}&quot;</p>
            )}
            {filteredNav.map((item) => (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href);
                  setQuery("");
                  setSearchOpen(false);
                }}
                className="block w-full text-left px-4 py-2.5 text-sm font-body text-forest dark:text-mint hover:bg-forest/5 dark:hover:bg-mint/10"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <button
          aria-label="Toggle dark mode"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex h-9 w-9 items-center justify-center rounded-full text-forest hover:bg-forest/5 dark:text-mint dark:hover:bg-mint/10 transition-colors"
        >
          {mounted && theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            aria-label="Notifications"
            onClick={() => setNotifOpen((v) => !v)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-forest hover:bg-forest/5 dark:text-mint dark:hover:bg-mint/10 transition-colors"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-saffron" />
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark shadow-xl overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-forest/10 dark:border-mint/10">
                <p className="font-display font-semibold text-sm text-forest dark:text-mint">Notifications</p>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="font-utility text-xs text-emerald hover:underline">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 && (
                  <p className="px-4 py-6 text-center font-utility text-xs text-forest/40 dark:text-mint/40">No notifications.</p>
                )}
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={cn(
                      "block w-full text-left px-4 py-3 border-b border-forest/5 dark:border-mint/5 last:border-0 hover:bg-forest/5 dark:hover:bg-mint/10",
                      !n.isRead && "bg-emerald/5"
                    )}
                  >
                    <p className="font-display text-sm font-medium text-forest dark:text-mint">{n.title}</p>
                    <p className="font-body text-xs text-forest/60 dark:text-mint/60 mt-0.5">{n.body}</p>
                    <p className="font-utility text-[10px] text-forest/40 dark:text-mint/40 mt-1">{n.createdAt}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile menu */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-forest/5 dark:hover:bg-mint/10 transition-colors"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald/20 text-emerald">
              <UserRound className="h-3.5 w-3.5" />
            </span>
            <span className="font-utility text-xs text-forest dark:text-mint max-w-[100px] truncate">{userName}</span>
            <ChevronDown className="h-3 w-3 text-forest/50 dark:text-mint/50" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark shadow-xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-forest/10 dark:border-mint/10">
                <p className="font-display text-sm font-medium text-forest dark:text-mint truncate">{userName}</p>
                <p className="font-utility text-xs text-forest/50 dark:text-mint/50 truncate">{userEmail}</p>
                <span className="mt-1 inline-block rounded-full bg-emerald/10 text-emerald px-2 py-0.5 font-utility text-[10px] font-medium">{role}</span>
              </div>
              <button
                onClick={() => { router.push("/dashboard/profile"); setProfileOpen(false); }}
                className="block w-full text-left px-4 py-2.5 font-utility text-sm text-forest dark:text-mint hover:bg-forest/5 dark:hover:bg-mint/10"
              >
                View profile
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex w-full items-center gap-2 text-left px-4 py-2.5 font-utility text-sm text-red-500 hover:bg-red-500/5"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
