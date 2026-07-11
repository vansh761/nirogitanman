import { auth } from "@/lib/auth";
import { getNotificationsForUser } from "database";

export default async function NotificationsPage() {
  const session = await auth();
  let notifications: Awaited<ReturnType<typeof getNotificationsForUser>> = [];
  try {
    if (session?.user?.id) notifications = await getNotificationsForUser(session.user.id as string);
  } catch {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-forest dark:text-mint">Notifications</h1>
        <p className="font-body text-sm text-forest/60 dark:text-mint/60">Updates relevant to your account.</p>
      </div>
      <div className="space-y-2">
        {notifications.map((n) => (
          <div key={n.id} className={`rounded-xl border p-4 ${n.isRead ? "border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark" : "border-emerald/30 bg-emerald/5"}`}>
            <div className="flex items-center justify-between">
              <p className="font-display font-semibold text-sm text-forest dark:text-mint">{n.title}</p>
              <span className="font-utility text-[11px] text-forest/40 dark:text-mint/40">{n.createdAt}</span>
            </div>
            <p className="mt-1 font-body text-sm text-forest/70 dark:text-mint/70">{n.body}</p>
          </div>
        ))}
        {notifications.length === 0 && (
          <p className="font-utility text-sm text-forest/40 dark:text-mint/40 text-center py-10">No notifications.</p>
        )}
      </div>
    </div>
  );
}
