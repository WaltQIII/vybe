import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="ms-stars-bg flex min-h-screen flex-col bg-[#1a2a3a]">
      {/* Header */}
      <nav className="border-b border-[#1a4f7f] bg-gradient-to-b from-[#4a86b8] to-[#2a5f8f] text-white shadow-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="text-2xl font-bold tracking-tight text-white drop-shadow-[1px_1px_0px_rgba(0,0,0,0.3)] sm:text-3xl">
            Vy<span className="text-[#ffcc00]">be</span>
          </span>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded px-4 py-1.5 text-sm text-white no-underline hover:bg-white/15"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="rounded bg-[#ff6600] px-4 py-1.5 text-sm font-bold text-white no-underline hover:bg-[#ff7722]"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)] sm:text-7xl">
          Vy<span className="text-[#ffcc00]">be</span>
        </h1>
        <p className="mt-2 text-sm text-[#8aaccf] sm:text-lg">
          express yourself. connect for real.
        </p>

        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-[#a0bdd4] sm:text-base">
          Your profile, your way. Customize your page with colors, music, and
          vibes. Add friends, leave comments on walls, and make your corner of
          the internet feel like <em>you</em>.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="rounded bg-[#ff6600] px-8 py-3 text-base font-bold text-white no-underline shadow-lg hover:bg-[#ff7722] sm:text-lg"
          >
            Create Your Vybe
          </Link>
          <Link
            href="/login"
            className="rounded border border-white/30 px-8 py-3 text-base text-white no-underline hover:bg-white/10 sm:text-lg"
          >
            Log In
          </Link>
        </div>

        {/* Feature highlights */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded border border-white/10 bg-white/5 p-5">
            <div className="mb-2 text-2xl">&#127912;</div>
            <h3 className="text-sm font-bold text-white">Custom Profiles</h3>
            <p className="mt-1 text-xs text-[#8aaccf]">
              Pick your colors, set a mood, add a profile song.
            </p>
          </div>
          <div className="rounded border border-white/10 bg-white/5 p-5">
            <div className="mb-2 text-2xl">&#128172;</div>
            <h3 className="text-sm font-bold text-white">Comment Walls</h3>
            <p className="mt-1 text-xs text-[#8aaccf]">
              Leave messages on your friends&apos; walls like the old days.
            </p>
          </div>
          <div className="rounded border border-white/10 bg-white/5 p-5">
            <div className="mb-2 text-2xl">&#127911;</div>
            <h3 className="text-sm font-bold text-white">Profile Songs</h3>
            <p className="mt-1 text-xs text-[#8aaccf]">
              Add a YouTube or SoundCloud track that plays when people visit.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-[10px] text-[#5577aa]">
        &copy; 2026 Vybe. All rights reserved.
      </footer>
    </div>
  );
}
