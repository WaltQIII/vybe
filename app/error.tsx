"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#b4c8d8] px-4">
      <div className="ms-panel w-full max-w-md overflow-hidden rounded">
        <div className="ms-section-header text-center">Something went wrong</div>
        <div className="p-5 text-center">
          <p className="text-sm text-[#333]">
            Sorry, this page ran into an error.
          </p>
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
