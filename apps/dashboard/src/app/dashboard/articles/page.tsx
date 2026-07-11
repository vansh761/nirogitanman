import { getArticlesForAdmin } from "database";

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-forest/10 text-forest/60 dark:bg-mint/10 dark:text-mint/60",
  IN_REVIEW: "bg-amber-500/10 text-amber-600",
  PUBLISHED: "bg-emerald/10 text-emerald",
  ARCHIVED: "bg-red-500/10 text-red-500",
};

export default async function ArticlesPage() {
  let articles: Awaited<ReturnType<typeof getArticlesForAdmin>> = [];
  try {
    articles = await getArticlesForAdmin();
  } catch {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-forest dark:text-mint">Articles</h1>
        <p className="font-body text-sm text-forest/60 dark:text-mint/60">Short health-tip articles from Postgres.</p>
      </div>
      <div className="rounded-2xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-forest/10 dark:border-mint/10 text-left font-utility text-xs uppercase tracking-wide text-forest/50 dark:text-mint/50">
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} className="border-b border-forest/5 dark:border-mint/5 last:border-0">
                <td className="px-5 py-3 font-body text-forest dark:text-mint">{a.title}</td>
                <td className="px-5 py-3 font-utility text-xs text-forest/60 dark:text-mint/60">{a.category ?? "—"}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 font-utility text-[11px] font-medium ${STATUS_STYLES[a.status] ?? ""}`}>{a.status}</span>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr><td colSpan={3} className="px-5 py-8 text-center font-utility text-xs text-forest/40 dark:text-mint/40">No articles found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
