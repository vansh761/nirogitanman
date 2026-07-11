import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { NAV_ITEMS, type Role } from "@/lib/rbac";
import { getNotificationsForUser } from "database";
import { Providers } from "@/components/providers";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as { role?: Role }).role ?? "FREE_USER";
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role));

  let notifications: Awaited<ReturnType<typeof getNotificationsForUser>> = [];
  try {
    if (session.user.id) notifications = await getNotificationsForUser(session.user.id as string);
  } catch {}

  return (
    <Providers>
      <div className="flex min-h-screen">
        <Sidebar items={items} userName={session.user.name ?? "User"} role={role} />
        <div className="flex-1 flex flex-col">
          <Topbar
            navItems={items}
            userName={session.user.name ?? "User"}
            userEmail={session.user.email ?? ""}
            role={role}
            initialNotifications={notifications}
          />
          <main className="flex-1 p-6 bg-forest/[0.015] dark:bg-mint/[0.015]">{children}</main>
        </div>
      </div>
    </Providers>
  );
}
