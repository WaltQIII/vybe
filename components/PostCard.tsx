"use client";

import { createClient } from "@/lib/supabase";
import type { Post, Profile } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PostCardProps {
  post: Post;
  currentUserId: string;
}

export default function PostCard({ post, currentUserId }: PostCardProps) {
  const [liked, setLiked] = useState(post.liked_by_user || false);
  const [likeCount, setLikeCount] = useState(post.like_count || 0);
  const supabase = createClient();
  const router = useRouter();
  const author = post.author as Profile | undefined;

  async function toggleLike() {
    try {
      if (liked) {
        await supabase.from("likes").delete().eq("user_id", currentUserId).eq("post_id", post.id);
        setLiked(false);
        setLikeCount((c) => Math.max(0, c - 1));
      } else {
        await supabase.from("likes").insert({ user_id: currentUserId, post_id: post.id });
        setLiked(true);
        setLikeCount((c) => c + 1);
      }
    } catch { /* ignore */ }
  }

  async function handleDelete() {
    if (!confirm("Delete this post?")) return;
    try {
      await supabase.from("posts").delete().eq("id", post.id);
      router.refresh();
    } catch { /* ignore */ }
  }

  return (
    <div className="vb-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4">
        <Image
          src={author?.avatar_url || "/default-avatar.svg"}
          alt={author?.display_name || "User"}
          width={36}
          height={36}
          className="h-9 w-9 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <Link
            href={`/profile/${author?.username}`}
            className="text-sm font-semibold text-[var(--text)] no-underline hover:text-[var(--accent)]"
          >
            {author?.display_name || author?.username}
          </Link>
          <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
            <span>@{author?.username}</span>
            {(author?.city || author?.country) && (
              <>
                <span>&middot;</span>
                <span>{[author?.city, author?.country].filter(Boolean).join(", ")}</span>
              </>
            )}
          </div>
        </div>
        <span className="text-xs text-[var(--text-muted)]">
          {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
        {post.user_id === currentUserId && (
          <button onClick={handleDelete} className="text-xs text-[var(--text-muted)] hover:text-red-500">
            &times;
          </button>
        )}
      </div>

      {/* Caption */}
      {post.caption && (
        <p className="px-4 pt-3 text-sm text-[var(--text)]">{post.caption}</p>
      )}

      {/* Image */}
      {post.image_url && (
        <div className="mt-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image_url}
            alt="Post"
            className="w-full object-cover"
            style={{ maxHeight: 500 }}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 px-4 py-3">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1 text-sm transition-colors ${
            liked ? "text-red-500" : "text-[var(--text-muted)] hover:text-red-500"
          }`}
        >
          {liked ? (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          )}
          <span className="text-xs font-medium">{likeCount}</span>
        </button>
        <span className="text-xs text-[var(--text-muted)]">
          {post.comment_count || 0} comments
        </span>
      </div>
    </div>
  );
}
