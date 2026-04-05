"use client";

import { createClient } from "@/lib/supabase";
import type { Profile } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TopFriendsProps {
  friends: Profile[];
  profileId: string;
  currentUserId: string | null;
  isOwner: boolean;
  isFriend: boolean;
}

export default function TopFriends({
  friends,
  profileId,
  currentUserId,
  isOwner,
  isFriend,
}: TopFriendsProps) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  async function handleAddFriend() {
    if (!currentUserId) return;
    setLoading(true);
    await supabase.from("friendships").insert({
      user_id: currentUserId,
      friend_id: profileId,
    });
    setLoading(false);
    router.refresh();
  }

  async function handleRemoveFriend() {
    if (!currentUserId) return;
    setLoading(true);
    await supabase
      .from("friendships")
      .delete()
      .eq("user_id", currentUserId)
      .eq("friend_id", profileId);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="ms-panel overflow-hidden rounded">
      <div className="ms-section-header flex items-center gap-2">
        <span>&#9829;</span> Top Friends ({friends.length}/8)
      </div>
      <div className="p-4">
        {/* Add/Remove friend button for visitors */}
        {currentUserId && !isOwner && (
          <div className="mb-3">
            {isFriend ? (
              <button
                onClick={handleRemoveFriend}
                disabled={loading}
                className="w-full rounded border border-red-300 bg-red-50 px-3 py-1.5 text-xs text-red-600 hover:bg-red-100 disabled:opacity-50"
              >
                {loading ? "..." : "- Remove from Friends"}
              </button>
            ) : (
              <button
                onClick={handleAddFriend}
                disabled={loading}
                className="ms-btn-accent w-full rounded disabled:opacity-50"
              >
                {loading ? "..." : "+ Add to Friends"}
              </button>
            )}
          </div>
        )}

        {friends.length === 0 && (
          <p className="py-2 text-center text-xs text-[#999]">
            No friends added yet.
          </p>
        )}

        <div className="grid grid-cols-4 gap-2">
          {friends.slice(0, 8).map((friend) => (
            <Link
              key={friend.id}
              href={`/profile/${friend.username}`}
              className="flex flex-col items-center gap-1 rounded p-1 text-center no-underline hover:bg-[#eef3f7]"
            >
              <Image
                src={friend.avatar_url || "/default-avatar.svg"}
                alt={friend.display_name || friend.username}
                width={52}
                height={52}
                className="h-[52px] w-[52px] rounded border border-[#6699cc] object-cover"
              />
              <span className="w-full truncate text-[10px] font-bold text-[#003366]">
                {friend.display_name || friend.username}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
