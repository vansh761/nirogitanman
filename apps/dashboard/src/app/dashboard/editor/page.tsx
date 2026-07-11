import { getPublishedTestimonialsForAdmin, getFaqsForAdmin } from "database";

export default async function EditorToolsPage() {
  let testimonials: Awaited<ReturnType<typeof getPublishedTestimonialsForAdmin>> = [];
  let faqs: Awaited<ReturnType<typeof getFaqsForAdmin>> = [];
  try {
    [testimonials, faqs] = await Promise.all([getPublishedTestimonialsForAdmin(), getFaqsForAdmin()]);
  } catch {}

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-forest dark:text-mint">Editor Tools</h1>
        <p className="font-body text-sm text-forest/60 dark:text-mint/60">Homepage testimonials and FAQs, live from Postgres.</p>
      </div>

      <div>
        <h2 className="font-display font-semibold text-forest dark:text-mint mb-3">Testimonials</h2>
        <div className="space-y-2">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark p-4 flex items-center justify-between">
              <div>
                <p className="font-display font-semibold text-sm text-forest dark:text-mint">{t.name}</p>
                <p className="font-body text-sm text-forest/70 dark:text-mint/70">{t.message}</p>
              </div>
              <span className={`font-utility text-[11px] px-2 py-0.5 rounded-full shrink-0 ml-3 ${t.isPublished ? "bg-emerald/10 text-emerald" : "bg-forest/10 text-forest/60 dark:bg-mint/10 dark:text-mint/60"}`}>
                {t.isPublished ? "Published" : "Hidden"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-display font-semibold text-forest dark:text-mint mb-3">FAQs</h2>
        <div className="space-y-2">
          {faqs.map((f) => (
            <div key={f.id} className="rounded-xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark p-4">
              <p className="font-display font-semibold text-sm text-forest dark:text-mint">{f.question}</p>
              <p className="font-body text-sm text-forest/70 dark:text-mint/70 mt-1">{f.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
