"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[niro-dashboard] unhandled error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-canvas dark:bg-canvas-dark">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-saffron/10 text-saffron mb-5">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h1 className="font-display text-3xl font-semibold text-forest dark:text-mint">Something went wrong</h1>
      <p className="mt-2 font-body text-forest/60 dark:text-mint/60 max-w-sm">
        An unexpected error occurred loading this page.
      </p>
      <button onClick={() => reset()} className="mt-6 rounded-full bg-emerald text-white px-6 py-3 font-utility text-sm font-medium">
        Try again
      </button>
    </div>
  );
}
