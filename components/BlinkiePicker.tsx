"use client";

import Image from "next/image";
import { useState } from "react";

interface BlinkiePickerProps {
  blinkies: string[];
  onChange: (blinkies: string[]) => void;
}

export default function BlinkiePicker({ blinkies, onChange }: BlinkiePickerProps) {
  const [gifUrl, setGifUrl] = useState("");

  function addGif() {
    const url = gifUrl.trim();
    if (!url || blinkies.length >= 5) return;
    if (!url.startsWith("http")) return;
    onChange([...blinkies, url]);
    setGifUrl("");
  }

  function removeGif(index: number) {
    onChange(blinkies.filter((_, i) => i !== index));
  }

  return (
    <div className="ms-panel mt-3 overflow-hidden rounded sm:mt-4">
      <div className="ms-section-header flex items-center gap-2">
        <span>&#10024;</span> Blinkies &amp; Stickers
      </div>
      <div className="p-3 sm:p-4">
        <p className="mb-2 text-[10px] text-[#999]">
          Add up to 5 GIFs to your profile. Find GIFs at{" "}
          <a href="https://giphy.com" target="_blank" rel="noopener noreferrer" className="text-[#003366]">
            giphy.com
          </a>{" "}
          — right-click a GIF, copy image address, and paste it below.
        </p>

        {/* Current blinkies */}
        {blinkies.length > 0 && (
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {blinkies.map((url, i) => (
              <div key={i} className="group relative">
                <Image
                  src={url}
                  alt={`Blinkie ${i + 1}`}
                  width={80}
                  height={80}
                  className="h-16 w-auto rounded border border-[#6699cc] object-contain"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => removeGif(i)}
                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white hover:bg-red-600"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add GIF */}
        {blinkies.length < 5 && (
          <div className="flex gap-2">
            <input
              type="url"
              value={gifUrl}
              onChange={(e) => setGifUrl(e.target.value)}
              placeholder="Paste a GIF URL..."
              className="ms-input flex-1"
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addGif(); } }}
            />
            <button
              type="button"
              onClick={addGif}
              disabled={!gifUrl.trim() || blinkies.length >= 5}
              className="ms-btn-primary rounded disabled:opacity-50"
            >
              Add
            </button>
          </div>
        )}

        <p className="mt-1 text-[10px] text-[#999]">
          {blinkies.length}/5 blinkies added
        </p>
      </div>
    </div>
  );
}
