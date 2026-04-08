"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#b4c8d8] px-4">
      <div className="ms-panel w-full max-w-md overflow-hidden rounded">
        <div className="ms-section-header text-center">Something went wrong</div>
        <div className="p-5 text-center">
          <p className="text-sm text-[#333]">
            Sorry, this page ran into an error.
          </p>
          <pre className="mt-2 max-h-40 overflow-auto rounded bg-red-50 p-2 text-left text-xs text-red-700">
            {error.message}
            {error.digest && `\nDigest: ${error.digest}`}
            {error.stack && `\n${error.stack}`}
          </pre>
          <button
            onClick={reset}
            className="ms-btn-primary mt-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
