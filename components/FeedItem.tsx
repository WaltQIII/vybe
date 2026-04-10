import type { Profile, WallComment } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

interface FeedItemProps {
  comment: WallComment & { profile?: Profile };
}

export default function FeedItem({ comment }: FeedItemProps) {
  return (
    <div className="vb-card overflow-hidden p-4">
      <div className="flex gap-3">
        <Image
          src={comment.author?.avatar_url || "/default-avatar.svg"}
          alt={comment.author?.display_name || "User"}
          width={40}
          height={40}
          className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1 text-sm">
          <p className="text-[var(--text)]">
            <Link
              href={`/profile/${comment.author?.username}`}
              className="font-semibold text-[var(--text)] no-underline hover:text-[var(--accent)]"
            >
              {comment.author?.display_name || comment.author?.username}
            </Link>{" "}
            <span className="text-[var(--text-muted)]">wrote on</span>{" "}
            <Link
              href={`/profile/${comment.profile?.username}`}
              className="font-semibold text-[var(--text)] no-underline hover:text-[var(--accent)]"
            >
              {comment.profile?.display_name || comment.profile?.username}
            </Link>
            <span className="text-[var(--text-muted)]">&apos;s wall</span>
          </p>
          <p className="mt-2 break-words text-[var(--text)]">{comment.body}</p>
          <span className="mt-2 block text-xs text-[var(--text-muted)]">
            {new Date(comment.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
