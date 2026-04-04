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
    <div className="flex min-h-screen items-center justify-center bg-[#c0c0d0]">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-[#003366]">MySpace</h1>
          <p className="mt-2 text-gray-600">A place for friends.</p>
        </div>

        <div className="rounded-lg border-2 border-[#003366] bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-center text-xl font-bold text-[#003366]">
            Log In
          </h2>

          {error && (
            <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
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
              <label className="mb-1 block text-sm font-bold">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-[#003366] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-[#003366] py-2 font-bold text-white hover:bg-[#004488] disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-bold text-[#ff6600]">
              Sign Up!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
