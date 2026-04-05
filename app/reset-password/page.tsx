"use client";

import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 2000);
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
            Set New Password
          </h2>

          {done ? (
            <div>
              <div className="mb-4 rounded bg-green-100 p-4 text-sm text-green-700">
                Password updated! Redirecting you to the home page...
              </div>
              <p className="text-center text-sm">
                <Link href="/" className="font-bold text-[#003366]">
                  Go to Home
                </Link>
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-bold">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:border-[#003366] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-bold">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    minLength={6}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:border-[#003366] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded bg-[#003366] py-2 font-bold text-white hover:bg-[#004488] disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
