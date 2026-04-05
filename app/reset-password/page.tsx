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
    <div className="ms-stars-bg flex min-h-screen items-center justify-center bg-[#1a2a3a] px-4 py-8">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="mb-5 text-center sm:mb-6">
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)] sm:text-5xl">
            Vy<span className="text-[#ffcc00]">be</span>
          </h1>
          <p className="mt-1 text-xs text-[#8aaccf] sm:text-sm">express yourself. connect for real.</p>
        </div>

        <div className="ms-panel overflow-hidden rounded">
          <div className="ms-section-header text-center">
            Set New Password
          </div>
          <div className="p-4 sm:p-6">
            {done ? (
              <div>
                <div className="mb-4 rounded border border-green-300 bg-green-50 p-3 text-xs text-green-700 sm:p-4">
                  Password updated! Redirecting you to the home page...
                </div>
                <p className="text-center text-xs">
                  <Link href="/" className="font-bold text-[#003366]">
                    Go to Home
                  </Link>
                </p>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-xs text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleUpdate} className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#003366]">
                      New Password
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

                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#003366]">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      minLength={6}
                      className="ms-input"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="ms-btn-primary w-full rounded py-2.5 disabled:opacity-50 sm:py-2"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-[10px] text-[#5577aa]">
          &copy; 2026 Vybe. All rights reserved.
        </p>
      </div>
    </div>
  );
}
