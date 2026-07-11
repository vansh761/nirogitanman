export default function SupportPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-semibold text-forest dark:text-mint">Support</h1>
        <p className="font-body text-sm text-forest/60 dark:text-mint/60">Help center and ticket submission.</p>
      </div>
      <div className="rounded-2xl border border-dashed border-forest/20 dark:border-mint/20 p-10 text-center">
        {/* TODO: wire this page to Prisma once packages/database is generated against a live Postgres instance. */}
        <p className="font-utility text-sm text-forest/50 dark:text-mint/50">
          Scaffold ready — connect to the database to populate support.
        </p>
      </div>
    </div>
  );
}
