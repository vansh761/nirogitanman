import { getPatientsForAdmin } from "database";

export default async function PatientsPage() {
  let patients: Awaited<ReturnType<typeof getPatientsForAdmin>> = [];
  try {
    patients = await getPatientsForAdmin();
  } catch {
    // rendered empty below
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-forest dark:text-mint">Patients</h1>
        <p className="font-body text-sm text-forest/60 dark:text-mint/60">Patient records from Postgres.</p>
      </div>

      <div className="rounded-2xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-forest/10 dark:border-mint/10 text-left font-utility text-xs uppercase tracking-wide text-forest/50 dark:text-mint/50">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Gender</th>
              <th className="px-5 py-3">Phone</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id} className="border-b border-forest/5 dark:border-mint/5 last:border-0">
                <td className="px-5 py-3 font-body text-forest dark:text-mint">{p.name}</td>
                <td className="px-5 py-3 font-body text-forest/70 dark:text-mint/70">{p.email}</td>
                <td className="px-5 py-3 font-utility text-xs text-forest/60 dark:text-mint/60">{p.gender ?? "—"}</td>
                <td className="px-5 py-3 font-utility text-xs text-forest/60 dark:text-mint/60">{p.phone ?? "—"}</td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-8 text-center font-utility text-xs text-forest/40 dark:text-mint/40">No patients found — check DATABASE_URL.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
