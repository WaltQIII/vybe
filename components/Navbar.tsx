"use client";

import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavbarProps {
  username?: string | null;
}

export default function Navbar({ username }: NavbarProps) {
  const supabase = createClient();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="border-b border-[#1a4f7f] bg-gradient-to-b from-[#4a86b8] to-[#2a5f8f] px-4 py-0 text-white shadow-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        {/* Logo area */}
        <Link href="/" className="flex items-center gap-2 py-2 no-underline">
          <span className="text-3xl font-bold tracking-tight text-white drop-shadow-[1px_1px_0px_rgba(0,0,0,0.3)]">
            My<span className="text-[#ffcc00]">Space</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1 text-xs">
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
          <span className="mx-1 text-white/30">|</span>
          <button
            onClick={handleLogout}
            className="ms-btn-accent rounded text-xs"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Nostalgic tagline marquee */}
      <div className="border-t border-white/20 py-0.5 text-center text-[10px] text-white/60">
        a place for friends
      </div>
    </nav>
  );
}
