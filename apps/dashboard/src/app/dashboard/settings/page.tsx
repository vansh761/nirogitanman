import { getSettings } from "database";

export default async function SettingsPage() {
  let settings: Awaited<ReturnType<typeof getSettings>> = [];
  try {
    settings = await getSettings();
  } catch {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-forest dark:text-mint">Settings</h1>
        <p className="font-body text-sm text-forest/60 dark:text-mint/60">Platform-wide configuration (admin only).</p>
      </div>
      <div className="rounded-2xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark divide-y divide-forest/5 dark:divide-mint/5">
        {settings.map((s) => (
          <div key={s.key} className="flex items-center justify-between px-5 py-4">
            <span className="font-utility text-sm text-forest/70 dark:text-mint/70">{s.key}</span>
            <span className="font-display text-sm font-medium text-forest dark:text-mint">{JSON.stringify(s.value)}</span>
          </div>
        ))}
        {settings.length === 0 && (
          <p className="font-utility text-sm text-forest/40 dark:text-mint/40 text-center py-10">No settings configured.</p>
        )}
      </div>
    </div>
  );
}
