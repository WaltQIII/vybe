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
    <div className="ms-stars-bg flex min-h-screen items-center justify-center bg-[#1a2a3a]">
      <div className="w-full max-w-md px-4">
        {/* Logo */}
        <div className="mb-6 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
            My<span className="text-[#ffcc00]">Space</span>
          </h1>
          <p className="mt-1 text-sm text-[#8aaccf]">a place for friends</p>
        </div>

        {/* Login box */}
        <div className="ms-panel overflow-hidden rounded">
          <div className="ms-section-header text-center">
            Member Login
          </div>
          <div className="p-6">
            {error && (
              <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-xs text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-[#003366]">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded border border-[#6699cc] bg-[#f5f8fa] px-3 py-2 text-xs focus:border-[#003366] focus:outline-none"
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
                  className="w-full rounded border border-[#6699cc] bg-[#f5f8fa] px-3 py-2 text-xs focus:border-[#003366] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="ms-btn-primary w-full rounded py-2 disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>

            <div className="mt-4 border-t border-[#dde6ed] pt-3 text-center">
              <Link
                href="/forgot-password"
                className="text-[10px] text-[#6688aa] hover:text-[#003366]"
              >
                Forgot your password?
              </Link>
            </div>

            <div className="mt-3 text-center">
              <span className="text-xs text-[#666]">New to MySpace? </span>
              <Link href="/signup" className="text-xs font-bold text-[#ff6600]">
                Sign Up!
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-[10px] text-[#5577aa]">
          &copy; 2003-2026 MySpace Clone. All rights reserved.
        </p>
      </div>
    </div>
  );
}
