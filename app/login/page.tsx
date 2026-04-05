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

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="ms-stars-bg flex min-h-screen items-center justify-center bg-[#1a2a3a] px-4 py-8">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Logo */}
        <div className="mb-5 text-center sm:mb-6">
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)] sm:text-5xl">
            Vy<span className="text-[#ffcc00]">be</span>
          </h1>
          <p className="mt-1 text-xs text-[#8aaccf] sm:text-sm">express yourself. connect for real.</p>
        </div>

        {/* Login box */}
        <div className="ms-panel overflow-hidden rounded">
          <div className="ms-section-header text-center">
            Member Login
          </div>
          <div className="p-4 sm:p-6">
            {error && (
              <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-xs text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-[#003366]">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="ms-input"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#003366]">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="ms-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="ms-btn-primary w-full rounded py-2.5 disabled:opacity-50 sm:py-2"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>

            <div className="mt-4 border-t border-[#dde6ed] pt-3 text-center">
              <Link
                href="/forgot-password"
                className="text-[11px] text-[#6688aa] hover:text-[#003366]"
              >
                Forgot your password?
              </Link>
            </div>

            <div className="mt-3 text-center">
              <span className="text-xs text-[#666]">New to Vybe?</span>
              <Link href="/signup" className="text-xs font-bold text-[#ff6600]">
                Sign Up!
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-[10px] text-[#5577aa]">
          &copy; 2026 Vybe. All rights reserved.
        </p>
      </div>
    </div>
  );
}
