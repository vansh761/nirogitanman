import { getBlogsForAdmin } from "database";

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-forest/10 text-forest/60 dark:bg-mint/10 dark:text-mint/60",
  IN_REVIEW: "bg-amber-500/10 text-amber-600",
  PUBLISHED: "bg-emerald/10 text-emerald",
  ARCHIVED: "bg-red-500/10 text-red-500",
};

export default async function BlogPage() {
  let blogs: Awaited<ReturnType<typeof getBlogsForAdmin>> = [];
  try {
    blogs = await getBlogsForAdmin();
  } catch {
    // rendered empty below
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-forest dark:text-mint">Blog</h1>
        <p className="font-body text-sm text-forest/60 dark:text-mint/60">Posts from Postgres, managed by editors.</p>
      </div>

      <div className="rounded-2xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-forest/10 dark:border-mint/10 text-left font-utility text-xs uppercase tracking-wide text-forest/50 dark:text-mint/50">
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Published</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((b) => (
              <tr key={b.id} className="border-b border-forest/5 dark:border-mint/5 last:border-0">
                <td className="px-5 py-3 font-body text-forest dark:text-mint">{b.title}</td>
                <td className="px-5 py-3 font-utility text-xs text-forest/60 dark:text-mint/60">{b.category ?? "—"}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 font-utility text-[11px] font-medium ${STATUS_STYLES[b.status] ?? ""}`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-5 py-3 font-utility text-xs text-forest/60 dark:text-mint/60">{b.publishedAt ?? "—"}</td>
              </tr>
            ))}
            {blogs.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-8 text-center font-utility text-xs text-forest/40 dark:text-mint/40">No posts found — check DATABASE_URL.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
