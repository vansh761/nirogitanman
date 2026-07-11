import { getAiChatsForAdmin } from "database";

export default async function AiLogsPage() {
  let chats: Awaited<ReturnType<typeof getAiChatsForAdmin>> = [];
  try {
    chats = await getAiChatsForAdmin(50);
  } catch {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-forest dark:text-mint">AI Logs</h1>
        <p className="font-body text-sm text-forest/60 dark:text-mint/60">
          Live Niro AI conversation log, most recent first — for QA and safety review.
        </p>
      </div>

      <div className="space-y-2">
        {chats.map((c) => (
          <div key={c.id} className="rounded-xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark p-4">
            <div className="flex items-center justify-between mb-1">
              <span className={`font-utility text-[11px] font-medium px-2 py-0.5 rounded-full ${c.role === "user" ? "bg-sky/10 text-sky" : "bg-emerald/10 text-emerald"}`}>
                {c.role}
              </span>
              <span className="font-utility text-[11px] text-forest/40 dark:text-mint/40">{c.createdAt} · session {c.sessionId.slice(0, 8)}</span>
            </div>
            <p className="font-body text-sm text-forest/80 dark:text-mint/80 line-clamp-3">{c.content}</p>
          </div>
        ))}
        {chats.length === 0 && (
          <p className="font-utility text-sm text-forest/40 dark:text-mint/40 text-center py-10">
            No AI conversations logged yet — try the Niro AI widget on the public site.
          </p>
        )}
      </div>
    </div>
  );
}
