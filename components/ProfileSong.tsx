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
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}`}
            width="100%"
            height="80"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="rounded"
            title="Profile Song"
          />
        ) : soundcloudUrl ? (
          <iframe
            width="100%"
            height="166"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(soundcloudUrl)}&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=false`}
            title="Profile Song"
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
