export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas dark:bg-canvas-dark">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-full border-2 border-emerald/30 border-t-emerald animate-spin" />
        <p className="font-utility text-xs text-forest/50 dark:text-mint/50">Loading Niro Ayurveda…</p>
      </div>
    </div>
  );
}
