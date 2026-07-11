"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Sparkles, Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("admin@nirotanman.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push(params.get("from") || "/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-forest/[0.02] dark:bg-mint/[0.02] px-4">
      <div className="w-full max-w-sm rounded-3xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark p-8 shadow-xl">
        <div className="flex items-center gap-2 font-display font-semibold text-lg text-forest dark:text-mint">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          Niro Ayurveda
        </div>
        <p className="mt-1 font-utility text-xs text-forest/60 dark:text-mint/60">Dashboard sign in</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@nirotanman.com"
            className="w-full rounded-xl border border-forest/10 dark:border-mint/10 bg-transparent px-4 py-3 text-sm font-body outline-none focus-visible:ring-2 focus-visible:ring-emerald"
          />
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-xl border border-forest/10 dark:border-mint/10 bg-transparent px-4 py-3 text-sm font-body outline-none focus-visible:ring-2 focus-visible:ring-emerald"
          />

          {error && <p className="font-utility text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-emerald text-white py-3 text-sm font-utility font-medium disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
          </button>
        </form>

        <div className="mt-5 rounded-xl bg-forest/5 dark:bg-mint/10 p-3 font-utility text-[11px] leading-relaxed text-forest/60 dark:text-mint/60">
          Demo accounts (password: <code>password123</code>):<br />
          admin@nirotanman.com · editor@nirogitanman.com<br />
          doctor@nirotanman.com · paid@nirotanman.com
        </div>
      </div>
    </div>
  );
}
