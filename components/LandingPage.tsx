import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)]">
      {/* Header */}
      <nav className="border-b border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="text-xl font-extrabold tracking-tight">
            <span className="vb-gradient-text">Vy</span>
            <span className="text-[#f59e0b]">be</span>
          </span>
          <div className="flex items-center gap-2">
            <Link href="/login" className="vb-btn vb-btn-ghost rounded-lg !text-sm">
              Log In
            </Link>
            <Link href="/signup" className="vb-btn vb-btn-accent rounded-lg !text-sm">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
          <span className="vb-gradient-text">Vy</span>
          <span className="text-[#f59e0b]">be</span>
        </h1>
        <p className="mt-3 text-base text-[var(--text-secondary)] sm:text-lg">
          express yourself. connect for real.
        </p>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
          Your profile, your way. Customize your page with backgrounds, music,
          and vibes. Add friends, share posts, and make your corner of the
          internet feel like <em>you</em>.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="vb-btn vb-btn-primary rounded-xl !px-8 !py-3 !text-base shadow-lg"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="vb-btn vb-btn-secondary rounded-xl !px-8 !py-3 !text-base"
          >
            Log In
          </Link>
        </div>

        {/* Features */}
        <div className="mx-auto mt-20 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            ["&#127912;", "Custom Profiles", "Pick your colors, set a mood, add a profile song."],
            ["&#128247;", "Photo Posts", "Share moments with a feed that feels like yours."],
            ["&#127911;", "Profile Songs", "Add a track that plays when people visit your page."],
          ].map(([icon, title, desc], i) => (
            <div key={i} className="vb-card p-5 text-center">
              <div className="mb-2 text-2xl" dangerouslySetInnerHTML={{ __html: icon }} />
              <h3 className="text-sm font-bold text-[var(--text)]">{title}</h3>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-[var(--text-muted)]">
        &copy; 2026 Vybe
      </footer>
    </div>
  );
}
