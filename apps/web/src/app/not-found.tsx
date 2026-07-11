import Link from "next/link";
import { Leaf } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-canvas dark:bg-canvas-dark">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald/10 text-emerald mb-5">
        <Leaf className="h-7 w-7" />
      </div>
      <h1 className="font-display text-3xl font-semibold text-forest dark:text-mint">Page not found</h1>
      <p className="mt-2 font-body text-forest/60 dark:text-mint/60 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist, or may have moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-emerald text-white px-6 py-3 font-utility text-sm font-medium"
      >
        Back to home
      </Link>
    </div>
  );
}
