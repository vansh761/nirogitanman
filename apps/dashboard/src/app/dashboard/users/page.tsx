import { getUsersForAdmin } from "database";

const ROLE_STYLES: Record<string, string> = {
  ADMIN: "bg-saffron/10 text-saffron",
  EDITOR: "bg-sky/10 text-sky",
  DOCTOR: "bg-emerald/10 text-emerald",
  PAID_USER: "bg-mint/30 text-forest dark:text-mint",
  FREE_USER: "bg-forest/10 text-forest/70 dark:bg-mint/10 dark:text-mint/70",
  GUEST: "bg-forest/5 text-forest/50 dark:bg-mint/5 dark:text-mint/50",
};

export default async function UsersPage() {
  let users: Awaited<ReturnType<typeof getUsersForAdmin>> = [];
  try {
    users = await getUsersForAdmin();
  } catch {
    // rendered empty below
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-forest dark:text-mint">Users</h1>
        <p className="font-body text-sm text-forest/60 dark:text-mint/60">All accounts across every role, from Postgres.</p>
      </div>

      <div className="rounded-2xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-forest/10 dark:border-mint/10 text-left font-utility text-xs uppercase tracking-wide text-forest/50 dark:text-mint/50">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-forest/5 dark:border-mint/5 last:border-0">
                <td className="px-5 py-3 font-body text-forest dark:text-mint">{u.name}</td>
                <td className="px-5 py-3 font-body text-forest/70 dark:text-mint/70">{u.email}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 font-utility text-[11px] font-medium ${ROLE_STYLES[u.role] ?? ""}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3 font-utility text-xs">
                  {u.isActive ? <span className="text-emerald">Active</span> : <span className="text-red-500">Inactive</span>}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-8 text-center font-utility text-xs text-forest/40 dark:text-mint/40">No users found — check DATABASE_URL.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
