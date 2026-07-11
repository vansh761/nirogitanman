import { getDashboardKpis } from "database";
import { WeeklyChart } from "./weekly-chart";

export default async function DashboardHome() {
  let kpis = { activePatients: 0, appointmentsThisWeek: 0, aiChats: 0 };
  try {
    kpis = await getDashboardKpis();
  } catch {}

  const cards = [
    { label: "Active patients", value: String(kpis.activePatients) },
    { label: "Appointments this week", value: String(kpis.appointmentsThisWeek) },
    { label: "Niro AI chats logged", value: String(kpis.aiChats) },
    { label: "MRR (mock)", value: "₹4.1L" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-forest dark:text-mint">Dashboard</h1>
        <p className="font-body text-sm text-forest/60 dark:text-mint/60">Live overview from Postgres.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((kpi) => (
          <div key={kpi.label} className="rounded-2xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark p-5">
            <p className="font-utility text-xs text-forest/50 dark:text-mint/50">{kpi.label}</p>
            <p className="mt-1 font-display text-2xl font-semibold text-forest dark:text-mint">{kpi.value}</p>
          </div>
        ))}
      </div>
      <WeeklyChart />
    </div>
  );
}
