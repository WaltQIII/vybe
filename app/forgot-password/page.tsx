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
    <div className="flex min-h-screen items-center justify-center bg-[#c0c0d0]">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-[#003366]">MySpace</h1>
          <p className="mt-2 text-gray-600">A place for friends.</p>
        </div>

        <div className="rounded-lg border-2 border-[#003366] bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-center text-xl font-bold text-[#003366]">
            Reset Password
          </h2>

          {sent ? (
            <div>
              <div className="mb-4 rounded bg-green-100 p-4 text-sm text-green-700">
                Check your email! We sent a password reset link to{" "}
                <strong>{email}</strong>.
              </div>
              <p className="text-center text-sm">
                <Link href="/login" className="font-bold text-[#003366]">
                  Back to Log In
                </Link>
              </p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-gray-600">
                Enter your email and we&apos;ll send you a link to reset your
                password.
              </p>

              {error && (
                <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleReset} className="space-y-4">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded bg-[#003366] py-2 font-bold text-white hover:bg-[#004488] disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <p className="mt-4 text-center text-sm">
                <Link href="/login" className="font-bold text-[#003366]">
                  Back to Log In
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
