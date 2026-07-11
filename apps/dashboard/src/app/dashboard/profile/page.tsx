import { auth } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await auth();

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="font-display text-2xl font-semibold text-forest dark:text-mint">Profile</h1>
        <p className="font-body text-sm text-forest/60 dark:text-mint/60">Your account details.</p>
      </div>
      <div className="rounded-2xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark p-6 space-y-4">
        <div>
          <p className="font-utility text-xs text-forest/50 dark:text-mint/50">Name</p>
          <p className="font-display text-forest dark:text-mint">{session?.user?.name}</p>
        </div>
        <div>
          <p className="font-utility text-xs text-forest/50 dark:text-mint/50">Email</p>
          <p className="font-display text-forest dark:text-mint">{session?.user?.email}</p>
        </div>
        <div>
          <p className="font-utility text-xs text-forest/50 dark:text-mint/50">Role</p>
          <p className="font-display text-forest dark:text-mint">{(session?.user as { role?: string })?.role}</p>
        </div>
      </div>
    </div>
  );
}
