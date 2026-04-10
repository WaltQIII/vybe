"use client";

import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (username.length < 3) {
      setError("Username must be at least 3 characters.");
      setLoading(false);
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Username can only contain letters, numbers, and underscores.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username: username.toLowerCase(), display_name: displayName || username } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/login");
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
          <h2 className="mb-4 text-center text-sm font-semibold text-[var(--text-secondary)]">Create Your Account</h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-xs text-red-500">{error}</div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="vb-input" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="e.g. tom" className="vb-input" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Display Name</label>
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="e.g. Tom Anderson" className="vb-input" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="vb-input" />
            </div>
            <button type="submit" disabled={loading} className="vb-btn vb-btn-accent w-full rounded-lg !py-2.5 disabled:opacity-50">
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-[var(--text-muted)]">
            Already a member?{" "}
            <Link href="/login" className="font-semibold text-[var(--accent)]">Log In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
