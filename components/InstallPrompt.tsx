"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already installed or previously dismissed this session
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    function handlePrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handlePrompt);
    return () => window.removeEventListener("beforeinstallprompt", handlePrompt);
  }, []);

  if (!deferredPrompt || dismissed) return null;

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#1a4f7f] bg-gradient-to-r from-[#2a5f8f] to-[#4a86b8] px-4 py-2.5 shadow-lg">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
        <p className="text-xs text-white sm:text-sm">
          Install <span className="font-bold">Vybe</span> for a better
          experience
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={handleInstall}
            className="rounded bg-[#ff6600] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#ff7722]"
          >
            Install
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="rounded px-2 py-1.5 text-xs text-white/70 hover:text-white"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
