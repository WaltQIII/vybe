"use client";

import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import NotificationBell from "./NotificationBell";

interface NavbarProps {
  username?: string | null;
  userId?: string | null;
}

export default function Navbar({ username, userId }: NavbarProps) {
  const supabase = createClient();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="border-b border-[#1a4f7f] bg-gradient-to-b from-[#4a86b8] to-[#2a5f8f] text-white shadow-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-3 py-2 sm:px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span className="text-2xl font-bold tracking-tight text-white drop-shadow-[1px_1px_0px_rgba(0,0,0,0.3)] sm:text-3xl">
            Vy<span className="text-[#ffcc00]">be</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 text-xs sm:flex">
          <Link
            href="/"
            className="rounded px-3 py-1.5 text-white no-underline hover:bg-white/15"
          >
            Home
          </Link>
          {username && (
            <Link
              href={`/profile/${username}`}
              className="rounded px-3 py-1.5 text-white no-underline hover:bg-white/15"
            >
              My Profile
            </Link>
          )}
          <Link
            href="/settings"
            className="rounded px-3 py-1.5 text-white no-underline hover:bg-white/15"
          >
            Edit Profile
          </Link>
          <Link
            href="/search"
            className="rounded px-2 py-1.5 text-white no-underline hover:bg-white/15"
            aria-label="Search"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
          {userId && <NotificationBell userId={userId} />}
          <span className="mx-1 text-white/30">|</span>
          <button
            onClick={handleLogout}
            className="ms-btn-accent rounded !py-1.5 !text-xs"
          >
            Log Out
          </button>
        </div>

        {/* Mobile: bell + hamburger */}
        <div className="flex items-center gap-1 sm:hidden">
          {userId && <NotificationBell userId={userId} />}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded hover:bg-white/15"
            aria-label="Toggle menu"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="border-t border-white/20 px-3 pb-3 sm:hidden">
          <div className="flex flex-col gap-1 pt-2">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="rounded px-3 py-2.5 text-sm text-white no-underline hover:bg-white/15"
            >
              Home
            </Link>
            {username && (
              <Link
                href={`/profile/${username}`}
                onClick={() => setMenuOpen(false)}
                className="rounded px-3 py-2.5 text-sm text-white no-underline hover:bg-white/15"
              >
                My Profile
              </Link>
            )}
            <Link
              href="/settings"
              onClick={() => setMenuOpen(false)}
              className="rounded px-3 py-2.5 text-sm text-white no-underline hover:bg-white/15"
            >
              Edit Profile
            </Link>
            <Link
              href="/search"
              onClick={() => setMenuOpen(false)}
              className="rounded px-3 py-2.5 text-sm text-white no-underline hover:bg-white/15"
            >
              Find People
            </Link>
            <Link
              href="/notifications"
              onClick={() => setMenuOpen(false)}
              className="rounded px-3 py-2.5 text-sm text-white no-underline hover:bg-white/15"
            >
              Notifications
            </Link>
            <button
              onClick={handleLogout}
              className="mt-1 rounded bg-[#ff6600] px-3 py-2.5 text-left text-sm font-bold text-white hover:bg-[#ff7722]"
            >
              Log Out
            </button>
          </div>
        </div>
      )}

      {/* Tagline — hidden on very small screens */}
      <div className="hidden border-t border-white/20 py-0.5 text-center text-[10px] text-white/60 sm:block">
        express yourself. connect for real.
      </div>
    </nav>
  );
}
