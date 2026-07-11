import { getCategoriesForAdmin } from "database";

export default async function CategoriesPage() {
  let categories: Awaited<ReturnType<typeof getCategoriesForAdmin>> = [];
  try {
    categories = await getCategoriesForAdmin();
  } catch {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-forest dark:text-mint">Categories</h1>
        <p className="font-body text-sm text-forest/60 dark:text-mint/60">Shared taxonomy for blogs and articles.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div key={c.id} className="rounded-2xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark p-5">
            <p className="font-display font-semibold text-forest dark:text-mint">{c.name}</p>
            <p className="font-utility text-xs text-forest/50 dark:text-mint/50">/{c.slug}</p>
            <p className="mt-2 font-utility text-xs text-emerald">{c.blogCount} blogs · {c.articleCount} articles</p>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="font-utility text-sm text-forest/40 dark:text-mint/40 col-span-full text-center py-10">No categories found.</p>
        )}
      </div>
    </div>
  );
}
