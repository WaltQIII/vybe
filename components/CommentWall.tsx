"use client";

import { createClient } from "@/lib/supabase";
import type { WallComment } from "@/lib/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CommentWallProps {
  profileId: string;
  profileUsername: string;
  comments: WallComment[];
  currentUserId: string | null;
  isOwner: boolean;
}

export default function CommentWall({
  profileId,
  profileUsername,
  comments,
  currentUserId,
  isOwner,
}: CommentWallProps) {
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  async function handlePost(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || !currentUserId) return;

    setPosting(true);
    await supabase.from("wall_comments").insert({
      profile_id: profileId,
      author_id: currentUserId,
      body: body.trim(),
    });
    // Notify wall owner (if not self)
    if (currentUserId !== profileId) {
      await supabase.from("notifications").insert({
        user_id: profileId,
        type: "wall_comment",
        from_user_id: currentUserId,
        data: { profile_username: profileUsername },
      });
    }
    setBody("");
    setPosting(false);
    router.refresh();
  }

  async function handleDelete(commentId: string) {
    await supabase.from("wall_comments").delete().eq("id", commentId);
    router.refresh();
  }

  return (
    <div className="ms-panel overflow-hidden rounded">
      <div className="ms-section-header flex items-center gap-2">
        <span>&#9993;</span> {isOwner ? "My" : ""} Comment Wall ({comments.length})
      </div>
      <div className="p-3 sm:p-4">
        {currentUserId && (
          <form onSubmit={handlePost} className="mb-4">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Leave a comment on this wall..."
              rows={3}
              className="ms-input"
            />
            <button
              type="submit"
              disabled={posting || !body.trim()}
              className="ms-btn-accent mt-2 rounded disabled:opacity-50"
            >
              {posting ? "Posting..." : "Post Comment"}
            </button>
          </form>
        )}

        {comments.length === 0 && (
          <div className="rounded border border-dashed border-[#6699cc] bg-[#eef3f7] p-4 text-center sm:p-6">
            <p className="text-xs text-[#336699] sm:text-sm">
              No comments yet. Be the first to leave one!
            </p>
          </div>
        )}

        <div className="space-y-0">
          {comments.map((comment, i) => (
            <div
              key={comment.id}
              className={`flex gap-2 p-2.5 sm:gap-3 sm:p-3 ${
                i % 2 === 0 ? "bg-[#f5f8fa]" : "bg-white"
              } ${i < comments.length - 1 ? "border-b border-[#dde6ed]" : ""}`}
            >
              <Image
                src={comment.author?.avatar_url || "/default-avatar.svg"}
                alt={comment.author?.display_name || "User"}
                width={36}
                height={36}
                className="h-8 w-8 flex-shrink-0 rounded border border-[#6699cc] object-cover sm:h-9 sm:w-9"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <a
                    href={`/profile/${comment.author?.username}`}
                    className="text-xs font-bold text-[#003366] sm:text-sm"
                  >
                    {comment.author?.display_name || comment.author?.username}
                  </a>
                  <span className="text-[10px] text-[#999]">
                    {new Date(comment.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                  {isOwner && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-[10px] text-red-400 hover:text-red-600"
                    >
                      [x]
                    </button>
                  )}
                </div>
                <p className="mt-1 break-words text-xs text-[#333] sm:text-sm">{comment.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
