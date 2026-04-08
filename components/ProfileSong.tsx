"use client";

interface ProfileSongProps {
  songUrl: string;
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
  if (url.includes("soundcloud.com/")) {
    return url;
  }
  return null;
}

export default function ProfileSong({ songUrl }: ProfileSongProps) {
  const youtubeId = getYouTubeId(songUrl);
  const soundcloudUrl = getSoundCloudUrl(songUrl);

  return (
    <div className="ms-panel overflow-hidden rounded">
      <div className="ms-section-header flex items-center gap-2">
        <span>&#9835;</span> Now Playing
      </div>
      <div className="p-2">
        {youtubeId ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&playsinline=1`}
            width="100%"
            height="152"
            allow="encrypted-media"
            allowFullScreen
            // @ts-expect-error -- playsinline is valid for iOS but not in React types
            playsInline
            className="rounded"
            title="Profile Song"
            style={{ border: 0 }}
          />
        ) : soundcloudUrl ? (
          <iframe
            width="100%"
            height="166"
            scrolling="no"
            frameBorder="no"
            allow="encrypted-media"
            src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(soundcloudUrl)}&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=false`}
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
  );
}
