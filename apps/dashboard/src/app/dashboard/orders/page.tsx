import { getOrdersForAdmin } from "database";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-600",
  SUCCESS: "bg-emerald/10 text-emerald",
  FAILED: "bg-red-500/10 text-red-500",
  REFUNDED: "bg-sky/10 text-sky",
};

export default async function OrdersPage() {
  let orders: Awaited<ReturnType<typeof getOrdersForAdmin>> = [];
  try {
    orders = await getOrdersForAdmin();
  } catch {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-forest dark:text-mint">Orders</h1>
        <p className="font-body text-sm text-forest/60 dark:text-mint/60">Consultation payments from Postgres.</p>
      </div>
      <div className="rounded-2xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-forest/10 dark:border-mint/10 text-left font-utility text-xs uppercase tracking-wide text-forest/50 dark:text-mint/50">
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-forest/5 dark:border-mint/5 last:border-0">
                <td className="px-5 py-3 font-body text-forest dark:text-mint">{o.name}</td>
                <td className="px-5 py-3 font-utility text-xs text-forest/60 dark:text-mint/60">{o.currency} {o.amount}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 font-utility text-[11px] font-medium ${STATUS_STYLES[o.status] ?? ""}`}>{o.status}</span>
                </td>
                <td className="px-5 py-3 font-utility text-xs text-forest/60 dark:text-mint/60">{o.createdAt}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-8 text-center font-utility text-xs text-forest/40 dark:text-mint/40">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
