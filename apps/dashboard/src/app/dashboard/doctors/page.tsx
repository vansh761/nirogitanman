import { getDoctorsForAdmin } from "database";

export default async function DoctorsPage() {
  let doctors: Awaited<ReturnType<typeof getDoctorsForAdmin>> = [];
  try {
    doctors = await getDoctorsForAdmin();
  } catch {
    // rendered empty below
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-forest dark:text-mint">Doctors</h1>
        <p className="font-body text-sm text-forest/60 dark:text-mint/60">Verified doctor profiles from Postgres.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((doc) => (
          <div key={doc.id} className="rounded-2xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark p-5">
            <div className="flex items-center justify-between">
              <p className="font-display font-semibold text-forest dark:text-mint">{doc.name}</p>
              {doc.isVerified && (
                <span className="rounded-full bg-emerald/10 text-emerald px-2 py-0.5 font-utility text-[10px] font-medium">Verified</span>
              )}
            </div>
            <p className="font-utility text-xs text-forest/60 dark:text-mint/60 mt-1">{doc.specialization} · {doc.experienceYrs} yrs</p>
            <p className="font-utility text-xs text-saffron mt-2">★ {doc.rating}</p>
          </div>
        ))}
        {doctors.length === 0 && (
          <p className="font-utility text-sm text-forest/40 dark:text-mint/40 col-span-full text-center py-10">No doctors found — check DATABASE_URL.</p>
        )}
      </div>
    </div>
  );
}
