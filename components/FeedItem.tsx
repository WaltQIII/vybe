import type { Profile, WallComment } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

interface FeedItemProps {
  comment: WallComment & { profile?: Profile };
}

export default function FeedItem({ comment }: FeedItemProps) {
  return (
    <div className="flex gap-3 rounded-lg border-2 border-[#003366] bg-white p-4 shadow-sm">
      <Image
        src={comment.author?.avatar_url || "/default-avatar.svg"}
        alt={comment.author?.display_name || "User"}
        width={40}
        height={40}
        className="h-10 w-10 flex-shrink-0 rounded object-cover"
      />
      <div className="flex-1">
        <p className="text-sm">
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
        <p className="mt-1 text-sm">{comment.body}</p>
        <span className="mt-1 block text-xs text-gray-400">
          {new Date(comment.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
