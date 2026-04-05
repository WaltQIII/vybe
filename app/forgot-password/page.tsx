"use client";

import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <div className="ms-stars-bg flex min-h-screen items-center justify-center bg-[#1a2a3a] px-4 py-8">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="mb-5 text-center sm:mb-6">
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)] sm:text-5xl">
            My<span className="text-[#ffcc00]">Space</span>
          </h1>
          <p className="mt-1 text-xs text-[#8aaccf] sm:text-sm">a place for friends</p>
        </div>

        <div className="ms-panel overflow-hidden rounded">
          <div className="ms-section-header text-center">
            Reset Password
          </div>
          <div className="p-4 sm:p-6">
            {sent ? (
              <div>
                <div className="mb-4 rounded border border-green-300 bg-green-50 p-3 text-xs text-green-700 sm:p-4">
                  Check your email! We sent a password reset link to{" "}
                  <strong>{email}</strong>.
                </div>
                <p className="text-center text-xs">
                  <Link href="/login" className="font-bold text-[#003366]">
                    Back to Log In
                  </Link>
                </p>
              </div>
            ) : (
              <>
                <p className="mb-4 text-xs text-[#666]">
                  Enter your email and we&apos;ll send you a link to reset your
                  password.
                </p>

                {error && (
                  <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-xs text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleReset} className="space-y-3 sm:space-y-4">
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

                  <button
                    type="submit"
                    disabled={loading}
                    className="ms-btn-primary w-full rounded py-2.5 disabled:opacity-50 sm:py-2"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>
                </form>

                <div className="mt-4 border-t border-[#dde6ed] pt-3 text-center">
                  <Link href="/login" className="text-xs font-bold text-[#003366]">
                    Back to Log In
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-[10px] text-[#5577aa]">
          &copy; 2003-2026 MySpace Clone. All rights reserved.
        </p>
      </div>
    </div>
  );
}
