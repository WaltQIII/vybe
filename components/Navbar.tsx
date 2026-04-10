"use client";

import { createClient } from "@/lib/supabase";
import { useTheme } from "./ThemeProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MessageBadge from "./MessageBadge";
import NotificationBell from "./NotificationBell";

interface NavbarProps {
  username?: string | null;
  userId?: string | null;
}

export default function Navbar({ username, userId }: NavbarProps) {
  const supabase = createClient();
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5">
          <Link href="/" className="flex items-center gap-1 no-underline">
            <span className="text-xl font-extrabold tracking-tight">
              <span className="vb-gradient-text">Vy</span>
              <span className="text-[#f59e0b]">be</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 sm:flex">
            <Link href="/" className="vb-btn vb-btn-ghost rounded-lg !px-3 !py-1.5 !text-xs">
              Home
            </Link>
            {username && (
              <Link href={`/profile/${username}`} className="vb-btn vb-btn-ghost rounded-lg !px-3 !py-1.5 !text-xs">
                Profile
              </Link>
            )}
            <Link href="/discover" className="vb-btn vb-btn-ghost rounded-lg !px-3 !py-1.5 !text-xs">
              Discover
            </Link>
            <Link href="/settings" className="vb-btn vb-btn-ghost rounded-lg !px-3 !py-1.5 !text-xs">
              Settings
            </Link>

            <div className="mx-1 h-5 w-px bg-[var(--border)]" />

            {userId && <MessageBadge userId={userId} />}
            {userId && <NotificationBell userId={userId} />}

            <button
              onClick={toggle}
              className="vb-btn vb-btn-ghost rounded-lg !p-1.5"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
              ) : (
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="vb-btn vb-btn-accent rounded-lg !px-3 !py-1.5 !text-xs"
            >
              Log Out
            </button>
          </div>

          {/* Mobile: icons + hamburger */}
          <div className="flex items-center gap-1 sm:hidden">
            {userId && <MessageBadge userId={userId} />}
            {userId && <NotificationBell userId={userId} />}
            <button
              onClick={toggle}
              className="vb-btn vb-btn-ghost rounded-lg !p-2"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
              ) : (
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="vb-btn vb-btn-ghost rounded-lg !p-2"
              aria-label="Menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="border-t border-[var(--border)] px-4 pb-3 sm:hidden">
            <div className="flex flex-col gap-0.5 pt-2">
              {[
                ["/", "Home"],
                ...(username ? [[`/profile/${username}`, "Profile"]] : []),
                ["/discover", "Discover"],
                ["/settings", "Settings"],
                ["/messages", "Messages"],
                ["/notifications", "Notifications"],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-[var(--text)] no-underline hover:bg-[var(--bg-secondary)]"
                >
                  {label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="mt-1 rounded-lg bg-[var(--orange)] px-3 py-2.5 text-left text-sm font-bold text-white"
              >
                Log Out
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
