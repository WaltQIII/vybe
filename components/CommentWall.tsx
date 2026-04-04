"use client";

import { createClient } from "@/lib/supabase";
import type { WallComment } from "@/lib/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CommentWallProps {
  profileId: string;
  comments: WallComment[];
  currentUserId: string | null;
  isOwner: boolean;
}

export default function CommentWall({
  profileId,
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
    setBody("");
    setPosting(false);
    router.refresh();
  }

  async function handleDelete(commentId: string) {
    await supabase.from("wall_comments").delete().eq("id", commentId);
    router.refresh();
  }

  return (
    <div className="rounded-lg border-2 border-[#003366] bg-white p-6 shadow-md">
      <h2 className="mb-4 text-lg font-bold text-[#003366]">
        Comment Wall ({comments.length})
      </h2>

      {currentUserId && (
        <form onSubmit={handlePost} className="mb-6">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Leave a comment..."
            rows={3}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-[#003366] focus:outline-none"
          />
          <button
            type="submit"
            disabled={posting || !body.trim()}
            className="mt-2 rounded bg-[#ff6600] px-4 py-1.5 text-sm font-bold text-white hover:bg-[#ff7722] disabled:opacity-50"
          >
            {posting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      )}

      {comments.length === 0 && (
        <p className="text-sm text-gray-500">
          No comments yet. Be the first to leave one!
        </p>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex gap-3 border-b border-gray-100 pb-4 last:border-0"
          >
            <Image
              src={comment.author?.avatar_url || "/default-avatar.svg"}
              alt={comment.author?.display_name || "User"}
              width={40}
              height={40}
              className="h-10 w-10 flex-shrink-0 rounded object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <a
                  href={`/profile/${comment.author?.username}`}
                  className="text-sm font-bold text-[#003366]"
                >
                  {comment.author?.display_name || comment.author?.username}
                </a>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                  {isOwner && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-xs text-red-400 hover:text-red-600"
                    >
                      delete
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-1 text-sm">{comment.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
