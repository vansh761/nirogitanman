import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center gap-3">
      <ShieldAlert className="h-10 w-10 text-saffron" />
      <h1 className="font-display text-xl font-semibold text-forest dark:text-mint">Not available for your role</h1>
      <p className="font-body text-sm text-forest/60 dark:text-mint/60 max-w-sm">
        Your account doesn&apos;t have permission to view this section. If you believe this is a mistake, contact an administrator.
      </p>
      <Link href="/dashboard" className="mt-2 font-utility text-sm text-emerald">Back to dashboard</Link>
    </div>
  );
}
