"use client";

export default function OfflinePage() {
  return (
    <div className="ms-stars-bg flex min-h-screen flex-col items-center justify-center bg-[#1a2a3a] px-4 text-center">
      <h1 className="text-4xl font-bold text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)] sm:text-5xl">
        Vy<span className="text-[#ffcc00]">be</span>
      </h1>
      <p className="mt-4 text-sm text-[#8aaccf]">You&apos;re offline right now.</p>
      <p className="mt-2 max-w-xs text-xs text-[#6688aa]">
        Check your internet connection and try again. Your Vybe will be waiting
        for you.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-6 rounded bg-[#ff6600] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#ff7722]"
      >
        Try Again
      </button>
    </div>
  );
}
