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
    <div className="flex min-h-screen items-center justify-center bg-[#c0c0d0]">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-[#003366]">MySpace</h1>
          <p className="mt-2 text-gray-600">A place for friends.</p>
        </div>

        <div className="rounded-lg border-2 border-[#003366] bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-center text-xl font-bold text-[#003366]">
            Sign Up
          </h2>

          {error && (
            <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-bold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-[#003366] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="e.g. tom"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-[#003366] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Tom Anderson"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-[#003366] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-[#003366] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-[#ff6600] py-2 font-bold text-white hover:bg-[#ff7722] disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up!"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[#003366]">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
