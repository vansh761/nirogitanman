import { getSubscriptionsForAdmin } from "database";

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-emerald/10 text-emerald",
  TRIAL: "bg-sky/10 text-sky",
  CANCELLED: "bg-red-500/10 text-red-500",
  EXPIRED: "bg-forest/10 text-forest/60 dark:bg-mint/10 dark:text-mint/60",
};

export default async function SubscriptionsPage() {
  let subs: Awaited<ReturnType<typeof getSubscriptionsForAdmin>> = [];
  try {
    subs = await getSubscriptionsForAdmin();
  } catch {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-forest dark:text-mint">Subscriptions</h1>
        <p className="font-body text-sm text-forest/60 dark:text-mint/60">Free vs paid plan status, from Postgres.</p>
      </div>
      <div className="rounded-2xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-forest/10 dark:border-mint/10 text-left font-utility text-xs uppercase tracking-wide text-forest/50 dark:text-mint/50">
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Plan</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Expires</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s) => (
              <tr key={s.id} className="border-b border-forest/5 dark:border-mint/5 last:border-0">
                <td className="px-5 py-3 font-body text-forest dark:text-mint">{s.name}</td>
                <td className="px-5 py-3 font-utility text-xs text-forest/60 dark:text-mint/60">{s.plan}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 font-utility text-[11px] font-medium ${STATUS_STYLES[s.status] ?? ""}`}>{s.status}</span>
                </td>
                <td className="px-5 py-3 font-utility text-xs text-forest/60 dark:text-mint/60">{s.expiresAt ?? "—"}</td>
              </tr>
            ))}
            {subs.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-8 text-center font-utility text-xs text-forest/40 dark:text-mint/40">No subscriptions found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
