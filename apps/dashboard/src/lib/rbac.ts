export type Role = "GUEST" | "FREE_USER" | "PAID_USER" | "DOCTOR" | "EDITOR" | "ADMIN";

// Which dashboard route prefixes each role may access.
// ADMIN implicitly has access to everything — checked separately.
export const ROLE_ROUTE_ACCESS: Record<Exclude<Role, "ADMIN" | "GUEST">, string[]> = {
  FREE_USER: ["/dashboard", "/dashboard/profile", "/dashboard/notifications", "/dashboard/support"],
  PAID_USER: ["/dashboard", "/dashboard/profile", "/dashboard/notifications", "/dashboard/support", "/dashboard/appointments"],
  DOCTOR: [
    "/dashboard",
    "/dashboard/appointments",
    "/dashboard/patients",
    "/dashboard/profile",
    "/dashboard/notifications",
    "/dashboard/messages",
    "/dashboard/support",
  ],
  EDITOR: [
    "/dashboard",
    "/dashboard/blog",
    "/dashboard/articles",
    "/dashboard/categories",
    "/dashboard/doctors",
    "/dashboard/profile",
    "/dashboard/notifications",
    "/dashboard/support",
    "/dashboard/editor",
  ],
};

export function canAccess(role: Role, pathname: string): boolean {
  if (role === "ADMIN") return true;
  if (role === "GUEST") return false;
  const allowed = ROLE_ROUTE_ACCESS[role] ?? [];
  return allowed.some((prefix) => {
    if (prefix === "/dashboard") return pathname === "/dashboard";
    return pathname === prefix || pathname.startsWith(prefix + "/");
  });
}

export const NAV_ITEMS: { label: string; href: string; roles: Role[] }[] = [
  { label: "Dashboard Home", href: "/dashboard", roles: ["ADMIN", "EDITOR", "DOCTOR", "PAID_USER", "FREE_USER"] },
  { label: "Analytics", href: "/dashboard/analytics", roles: ["ADMIN"] },
  { label: "Appointments", href: "/dashboard/appointments", roles: ["ADMIN", "DOCTOR", "PAID_USER"] },
  { label: "Doctors", href: "/dashboard/doctors", roles: ["ADMIN", "EDITOR"] },
  { label: "Patients", href: "/dashboard/patients", roles: ["ADMIN", "DOCTOR"] },
  { label: "Users", href: "/dashboard/users", roles: ["ADMIN"] },
  { label: "Blog", href: "/dashboard/blog", roles: ["ADMIN", "EDITOR"] },
  { label: "Articles", href: "/dashboard/articles", roles: ["ADMIN", "EDITOR"] },
  { label: "Categories", href: "/dashboard/categories", roles: ["ADMIN", "EDITOR"] },
  { label: "Orders", href: "/dashboard/orders", roles: ["ADMIN"] },
  { label: "Subscriptions", href: "/dashboard/subscriptions", roles: ["ADMIN"] },
  { label: "AI Logs", href: "/dashboard/ai-logs", roles: ["ADMIN"] },
  { label: "Messages", href: "/dashboard/messages", roles: ["ADMIN", "DOCTOR"] },
  { label: "Settings", href: "/dashboard/settings", roles: ["ADMIN"] },
  { label: "Profile", href: "/dashboard/profile", roles: ["ADMIN", "EDITOR", "DOCTOR", "PAID_USER", "FREE_USER"] },
  { label: "Notifications", href: "/dashboard/notifications", roles: ["ADMIN", "EDITOR", "DOCTOR", "PAID_USER", "FREE_USER"] },
  { label: "Support", href: "/dashboard/support", roles: ["ADMIN", "EDITOR", "DOCTOR", "PAID_USER", "FREE_USER"] },
];
