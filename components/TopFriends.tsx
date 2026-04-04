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
    <div className="rounded-lg border-2 border-[#003366] bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#003366]">
          Top Friends ({friends.length}/8)
        </h2>
      </div>

      {/* Add/Remove friend button for visitors */}
      {currentUserId && !isOwner && (
        <div className="mb-4">
          {isFriend ? (
            <button
              onClick={handleRemoveFriend}
              disabled={loading}
              className="w-full rounded border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              {loading ? "..." : "Remove from Friends"}
            </button>
          ) : (
            <button
              onClick={handleAddFriend}
              disabled={loading}
              className="w-full rounded bg-[#ff6600] px-3 py-1.5 text-sm font-bold text-white hover:bg-[#ff7722] disabled:opacity-50"
            >
              {loading ? "..." : "Add to Friends"}
            </button>
          )}
        </div>
      )}

      {friends.length === 0 && (
        <p className="text-sm text-gray-500">No friends yet.</p>
      )}

      <div className="grid grid-cols-4 gap-3">
        {friends.slice(0, 8).map((friend) => (
          <Link
            key={friend.id}
            href={`/profile/${friend.username}`}
            className="flex flex-col items-center gap-1 text-center no-underline hover:opacity-80"
          >
            <Image
              src={friend.avatar_url || "/default-avatar.svg"}
              alt={friend.display_name || friend.username}
              width={60}
              height={60}
              className="h-[60px] w-[60px] rounded object-cover"
            />
            <span className="text-xs font-bold text-[#003366]">
              {friend.display_name || friend.username}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
