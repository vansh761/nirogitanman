import { getContactMessagesForAdmin } from "database";

export default async function MessagesPage() {
  let messages: Awaited<ReturnType<typeof getContactMessagesForAdmin>> = [];
  try {
    messages = await getContactMessagesForAdmin();
  } catch {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-forest dark:text-mint">Messages</h1>
        <p className="font-body text-sm text-forest/60 dark:text-mint/60">Contact form submissions from the public site.</p>
      </div>
      <div className="space-y-2">
        {messages.map((m) => (
          <div key={m.id} className="rounded-xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark p-4">
            <div className="flex items-center justify-between">
              <p className="font-display font-semibold text-sm text-forest dark:text-mint">{m.name} <span className="font-utility font-normal text-forest/50 dark:text-mint/50">· {m.email}</span></p>
              <span className="font-utility text-[11px] text-forest/40 dark:text-mint/40">{m.createdAt}</span>
            </div>
            <p className="mt-1 font-body text-sm text-forest/75 dark:text-mint/75">{m.message}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="font-utility text-sm text-forest/40 dark:text-mint/40 text-center py-10">No messages yet.</p>
        )}
      </div>
    </div>
  );
}
