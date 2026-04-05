import type { Profile, WallComment } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

interface FeedItemProps {
  comment: WallComment & { profile?: Profile };
}

export default function FeedItem({ comment }: FeedItemProps) {
  return (
    <div className="flex gap-2 rounded border border-[#ccdbe6] bg-[#f5f8fa] p-2.5 sm:gap-3 sm:p-3">
      <Image
        src={comment.author?.avatar_url || "/default-avatar.svg"}
        alt={comment.author?.display_name || "User"}
        width={36}
        height={36}
        className="h-8 w-8 flex-shrink-0 rounded border border-[#6699cc] object-cover sm:h-9 sm:w-9"
      />
      <div className="min-w-0 flex-1 text-xs sm:text-sm">
        <p>
          <Link
            href={`/profile/${comment.author?.username}`}
            className="font-bold text-[#003366]"
          >
            {comment.author?.display_name || comment.author?.username}
          </Link>{" "}
          wrote on{" "}
          <Link
            href={`/profile/${comment.profile?.username}`}
            className="font-bold text-[#003366]"
          >
            {comment.profile?.display_name || comment.profile?.username}
          </Link>
          &apos;s wall:
        </p>
        <p className="mt-1 break-words text-[#333]">{comment.body}</p>
        <span className="mt-1 block text-[10px] text-[#999]">
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
  );
}
