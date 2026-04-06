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
  pendingRequest: "sent" | "received" | null;
  requestId: string | null;
}

export default function TopFriends({
  friends,
  profileId,
  currentUserId,
  isOwner,
  isFriend,
  pendingRequest,
  requestId,
}: TopFriendsProps) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  async function handleSendRequest() {
    if (!currentUserId) return;
    setLoading(true);
    await supabase.from("friend_requests").insert({
      from_user_id: currentUserId,
      to_user_id: profileId,
    });
    await supabase.from("notifications").insert({
      user_id: profileId,
      type: "friend_request",
      from_user_id: currentUserId,
    });
    setLoading(false);
    router.refresh();
  }

  async function handleCancelRequest() {
    if (!requestId) return;
    setLoading(true);
    await supabase.from("friend_requests").delete().eq("id", requestId);
    setLoading(false);
    router.refresh();
  }

  async function handleAcceptRequest() {
    if (!requestId || !currentUserId) return;
    setLoading(true);
    // Accept the request
    await supabase
      .from("friend_requests")
      .update({ status: "accepted" })
      .eq("id", requestId);
    // Create bidirectional friendships
    await supabase.from("friendships").insert([
      { user_id: currentUserId, friend_id: profileId },
      { user_id: profileId, friend_id: currentUserId },
    ]);
    // Notify the requester that their request was accepted
    await supabase.from("notifications").insert({
      user_id: profileId,
      type: "friend_accepted",
      from_user_id: currentUserId,
    });
    setLoading(false);
    router.refresh();
  }

  async function handleDeclineRequest() {
    if (!requestId) return;
    setLoading(true);
    await supabase
      .from("friend_requests")
      .update({ status: "declined" })
      .eq("id", requestId);
    setLoading(false);
    router.refresh();
  }

  async function handleRemoveFriend() {
    if (!currentUserId) return;
    setLoading(true);
    // Remove both directions
    await supabase
      .from("friendships")
      .delete()
      .eq("user_id", currentUserId)
      .eq("friend_id", profileId);
    await supabase
      .from("friendships")
      .delete()
      .eq("user_id", profileId)
      .eq("friend_id", currentUserId);
    // Clean up any accepted request
    await supabase
      .from("friend_requests")
      .delete()
      .or(`and(from_user_id.eq.${currentUserId},to_user_id.eq.${profileId}),and(from_user_id.eq.${profileId},to_user_id.eq.${currentUserId})`);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="ms-panel overflow-hidden rounded">
      <div className="ms-section-header flex items-center gap-2">
        <span>&#9829;</span> Top Friends ({friends.length}/8)
      </div>
      <div className="p-3 sm:p-4">
        {/* Friend action buttons for visitors */}
        {currentUserId && !isOwner && (
          <div className="mb-3 space-y-2">
            {isFriend ? (
              <button
                onClick={handleRemoveFriend}
                disabled={loading}
                className="w-full rounded border border-red-300 bg-red-50 px-3 py-2.5 text-xs text-red-600 hover:bg-red-100 disabled:opacity-50 sm:py-1.5"
              >
                {loading ? "..." : "- Remove Friend"}
              </button>
            ) : pendingRequest === "sent" ? (
              <button
                onClick={handleCancelRequest}
                disabled={loading}
                className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2.5 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-50 sm:py-1.5"
              >
                {loading ? "..." : "Cancel Request"}
              </button>
            ) : pendingRequest === "received" ? (
              <div className="flex gap-2">
                <button
                  onClick={handleAcceptRequest}
                  disabled={loading}
                  className="ms-btn-accent flex-1 rounded disabled:opacity-50"
                >
                  {loading ? "..." : "Accept"}
                </button>
                <button
                  onClick={handleDeclineRequest}
                  disabled={loading}
                  className="flex-1 rounded border border-gray-300 bg-gray-50 px-3 py-2.5 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-50 sm:py-1.5"
                >
                  {loading ? "..." : "Decline"}
                </button>
              </div>
            ) : (
              <button
                onClick={handleSendRequest}
                disabled={loading}
                className="ms-btn-accent w-full rounded disabled:opacity-50"
              >
                {loading ? "..." : "+ Send Friend Request"}
              </button>
            )}
          </div>
        )}

        {friends.length === 0 && (
          <p className="py-2 text-center text-xs text-[#999]">
            No friends added yet.
          </p>
        )}

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {friends.slice(0, 8).map((friend) => (
            <Link
              key={friend.id}
              href={`/profile/${friend.username}`}
              className="flex flex-col items-center gap-1 rounded p-1.5 text-center no-underline hover:bg-[#eef3f7] sm:p-1"
            >
              <Image
                src={friend.avatar_url || "/default-avatar.svg"}
                alt={friend.display_name || friend.username}
                width={52}
                height={52}
                className="h-12 w-12 rounded border border-[#6699cc] object-cover sm:h-[52px] sm:w-[52px]"
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
