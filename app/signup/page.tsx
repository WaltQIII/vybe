"use client";

import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      setLoading(false);
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Username can only contain letters, numbers, and underscores");
      setLoading(false);
      return;
    }

    // Check if username is taken
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username.toLowerCase())
      .single();

    if (existing) {
      setError("That username is already taken!");
      setLoading(false);
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username.toLowerCase(),
          display_name: displayName || username,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    router.push("/settings");
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

        {/* Signup box */}
        <div className="ms-panel overflow-hidden rounded">
          <div className="ms-section-header text-center">
            Create Your Account
          </div>
          <div className="p-4 sm:p-6">
            {error && (
              <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-xs text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-3">
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
                  Pick a Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="e.g. tom"
                  className="ms-input"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#003366]">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Tom Anderson"
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
                  minLength={6}
                  className="ms-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="ms-btn-accent w-full rounded py-2.5 disabled:opacity-50 sm:py-2"
              >
                {loading ? "Creating account..." : "Sign Up!"}
              </button>
            </form>

            <div className="mt-4 border-t border-[#dde6ed] pt-3 text-center">
              <span className="text-xs text-[#666]">Already a member? </span>
              <Link href="/login" className="text-xs font-bold text-[#003366]">
                Log In
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
