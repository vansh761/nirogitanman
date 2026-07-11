"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[niro-web] unhandled error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-canvas dark:bg-canvas-dark">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-saffron/10 text-saffron mb-5">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h1 className="font-display text-3xl font-semibold text-forest dark:text-mint">Something went wrong</h1>
      <p className="mt-2 font-body text-forest/60 dark:text-mint/60 max-w-sm">
        An unexpected error occurred. You can try again, or head back to the homepage.
      </p>
      <div className="mt-6 flex gap-3">
        <Button variant="outline" size="md" onClick={() => reset()}>Try again</Button>
        <Link href="/">
          <Button variant="primary" size="md">Back to home</Button>
        </Link>
      </div>
    </div>
  );
}
