import { getAppointmentsWithNames } from "database";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-600",
  CONFIRMED: "bg-sky/10 text-sky",
  COMPLETED: "bg-emerald/10 text-emerald",
  CANCELLED: "bg-red-500/10 text-red-500",
};

export default async function AppointmentsPage() {
  let appointments: Awaited<ReturnType<typeof getAppointmentsWithNames>> = [];
  let dbError = false;
  try {
    appointments = await getAppointmentsWithNames();
  } catch {
    dbError = true;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-forest dark:text-mint">Appointments</h1>
        <p className="font-body text-sm text-forest/60 dark:text-mint/60">
          Live from Postgres — includes requests submitted through the public booking flow.
        </p>
      </div>

      {dbError && (
        <p className="rounded-xl bg-red-500/10 text-red-500 px-4 py-3 font-utility text-xs">
          Could not reach the database. Check DATABASE_URL in .env.local.
        </p>
      )}

      <div className="rounded-2xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-forest/10 dark:border-mint/10 text-left font-utility text-xs uppercase tracking-wide text-forest/50 dark:text-mint/50">
              <th className="px-5 py-3">Patient</th>
              <th className="px-5 py-3">Doctor</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Slot</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt) => (
              <tr key={apt.id} className="border-b border-forest/5 dark:border-mint/5 last:border-0">
                <td className="px-5 py-3 font-body text-forest dark:text-mint">{apt.patient}</td>
                <td className="px-5 py-3 font-body text-forest/70 dark:text-mint/70">{apt.doctor}</td>
                <td className="px-5 py-3 font-utility text-xs text-forest/60 dark:text-mint/60">{apt.date}</td>
                <td className="px-5 py-3 font-utility text-xs text-forest/60 dark:text-mint/60">{apt.slot}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 font-utility text-[11px] font-medium ${STATUS_STYLES[apt.status]}`}>
                    {apt.status}
                  </span>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && !dbError && (
              <tr><td colSpan={5} className="px-5 py-8 text-center font-utility text-xs text-forest/40 dark:text-mint/40">No appointments yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
