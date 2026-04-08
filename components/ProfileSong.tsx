"use client";

import { useState, useRef, useCallback } from "react";

interface ProfileSongProps {
  songUrl: string;
  displayName?: string;
}

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/shorts\/([^&\s?]+)/,
  ];
  for (const p of patterns) {
    const match = url.match(p);
    if (match) return match[1];
  }
  return null;
}

function getSoundCloudUrl(url: string): string | null {
  if (url.includes("soundcloud.com/")) return url;
  return null;
}

export default function ProfileSong({ songUrl, displayName }: ProfileSongProps) {
  const youtubeId = getYouTubeId(songUrl);
  const soundcloudUrl = getSoundCloudUrl(songUrl);
  const [playing, setPlaying] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // For YouTube: load with autoplay, detect if blocked via a timer
  // If the iframe loads but autoplay is blocked (iOS), show the play button
  const handleYouTubeLoad = useCallback(() => {
    // On iOS Safari, autoplay with sound is always blocked.
    // We detect iOS/mobile and show the play button proactively.
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isMobileSafari = isIOS && /Safari/.test(navigator.userAgent);
    if (isMobileSafari && !playing) {
      setAutoplayBlocked(true);
    }
  }, [playing]);

  function handlePlay() {
    setPlaying(true);
    setAutoplayBlocked(false);
  }

  // YouTube embed URL
  const ytAutoplayUrl = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&playsinline=1&autoplay=1`
    : null;
  const ytManualUrl = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&playsinline=1&autoplay=1`
    : null;

  const name = displayName || "this Vybe";

  return (
    <>
      {/* Prominent play button shown when autoplay is blocked (iOS) */}
      {youtubeId && autoplayBlocked && !playing && (
        <button
          onClick={handlePlay}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded border border-[#6699cc] bg-gradient-to-r from-[#2a5f8f] to-[#4a86b8] px-4 py-3 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98] sm:mb-4"
        >
          <span className="text-lg">&#9654;</span>
          Play {name}&apos;s Vybe
        </button>
      )}

      {/* Now Playing panel */}
      <div className="ms-panel overflow-hidden rounded">
        <div className="ms-section-header flex items-center gap-2">
          <span>&#9835;</span> Now Playing
        </div>
        <div className="p-2">
          {youtubeId ? (
            <>
              {/* Desktop: autoplay immediately. iOS: show after play button tap */}
              {(!autoplayBlocked || playing) && (
                <iframe
                  ref={iframeRef}
                  src={(playing ? ytManualUrl : ytAutoplayUrl)!}
                  width="100%"
                  height="152"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  // @ts-expect-error -- playsinline is valid for iOS but not in React types
                  playsInline
                  className="rounded"
                  title="Profile Song"
                  style={{ border: 0 }}
                  onLoad={handleYouTubeLoad}
                />
              )}
              {/* Placeholder shown on iOS before user taps play */}
              {autoplayBlocked && !playing && (
                <button
                  onClick={handlePlay}
                  className="flex w-full items-center justify-center gap-2 rounded bg-[#1a1a1a] py-8 text-white"
                >
                  <span className="text-3xl">&#9654;</span>
                  <span className="text-sm font-bold">Tap to play</span>
                </button>
              )}
            </>
          ) : soundcloudUrl ? (
            <iframe
              width="100%"
              height="166"
              scrolling="no"
              frameBorder="no"
              allow="autoplay; encrypted-media"
              src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(soundcloudUrl)}&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=false`}
              title="Profile Song"
              style={{ border: 0 }}
            />
          ) : (
            <div className="p-2 text-center text-[10px] text-[#999]">
              <a
                href={songUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#003366]"
              >
                Listen to my song
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
