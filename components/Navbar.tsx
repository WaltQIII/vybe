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
    <nav className="border-b-2 border-[#003366] bg-[#003366] px-4 py-3 text-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white no-underline">
          MySpace
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-white no-underline hover:underline">
            Home
          </Link>
          {username && (
            <Link
              href={`/profile/${username}`}
              className="text-white no-underline hover:underline"
            >
              My Profile
            </Link>
          )}
          <Link
            href="/settings"
            className="text-white no-underline hover:underline"
          >
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="rounded bg-[#ff6600] px-3 py-1 text-white hover:bg-[#ff7722]"
          >
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
}
