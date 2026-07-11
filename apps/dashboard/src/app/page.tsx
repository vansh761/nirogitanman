import { getAnalyticsSummary } from "database";
export default async function AnalyticsPage() {
  let s = { doctors: 0, patients: 0, appointments: 0, aiChats: 0, publishedBlogs: 0, revenue: 0 };
  try {
    s = await getAnalyticsSummary();
  } catch {}
  const cards = [
    { label: "Verified doctors", value: s.doctors },
    { label: "Total patients", value: s.patients },
    { label: "Total appointments", value: s.appointments }, 
    { label: "Niro AI messages logged", value: s.aiChats },
    { label: "Published blog posts", value: s.publishedBlogs },
    { label: "Revenue collected", value: `₹${s.revenue}` },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-forest dark:text-mint">Analytics</h1>
        <p className="font-body text-sm text-forest/60 dark:text-mint/60">Platform-wide metrics, live from Postgres.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark p-5">
            <p className="font-utility text-xs text-forest/50 dark:text-mint/50">{c.label}</p>
            <p className="mt-1 font-display text-2xl font-semibold text-forest dark:text-mint">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
