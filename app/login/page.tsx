"use client";

import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-extrabold">
            <span className="vb-gradient-text">Vy</span>
            <span className="text-[#f59e0b]">be</span>
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">express yourself. connect for real.</p>
        </div>

        <div className="vb-card overflow-hidden p-6">
          <h2 className="mb-4 text-center text-sm font-semibold text-[var(--text-secondary)]">Log In</h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-xs text-red-500">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="vb-input" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="vb-input" />
            </div>
            <button type="submit" disabled={loading} className="vb-btn vb-btn-primary w-full rounded-lg !py-2.5 disabled:opacity-50">
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/forgot-password" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)]">
              Forgot password?
            </Link>
          </div>
          <div className="mt-3 text-center text-xs text-[var(--text-muted)]">
            New to Vybe?{" "}
            <Link href="/signup" className="font-semibold text-[var(--accent)]">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
