"use client";

import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CreatePostProps {
  userId: string;
}

export default function CreatePost({ userId }: CreatePostProps) {
  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [posting, setPosting] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  async function handlePost() {
    if (!caption.trim() && !imageUrl.trim()) return;
    setPosting(true);
    try {
      await supabase.from("posts").insert({
        user_id: userId,
        caption: caption.trim() || null,
        image_url: imageUrl.trim() || null,
      });
      setCaption("");
      setImageUrl("");
      setOpen(false);
      router.refresh();
    } catch { /* ignore */ } finally { setPosting(false); }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="vb-card w-full p-4 text-left text-sm text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-secondary)]"
      >
        What&apos;s on your mind?
      </button>
    );
  }

  return (
    <div className="vb-card overflow-hidden p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text)]">New Post</h3>
        <button onClick={() => setOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text)]">
          &times;
        </button>
      </div>

      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Write something..."
        rows={3}
        className="vb-input mt-3"
        autoFocus
      />

      <input
        type="url"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL (optional)"
        className="vb-input mt-2"
      />

      {imageUrl && (
        <div className="mt-2 overflow-hidden rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Preview"
            className="max-h-40 w-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>
      )}

      <div className="mt-3 flex justify-end">
        <button
          onClick={handlePost}
          disabled={posting || (!caption.trim() && !imageUrl.trim())}
          className="vb-btn vb-btn-primary rounded-lg disabled:opacity-50"
        >
          {posting ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}
