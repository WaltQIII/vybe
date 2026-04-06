import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getUser } from "@/lib/auth";
import ProfileCard from "@/components/ProfileCard";
import CommentWall from "@/components/CommentWall";
import TopFriends from "@/components/TopFriends";
import ProfileViewCounter from "@/components/ProfileViewCounter";
import Navbar from "@/components/Navbar";
import { notFound } from "next/navigation";
import type { Profile } from "@/lib/types";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) notFound();

  const typedProfile = profile as Profile;

  const user = await getUser();

  // Get current user's profile for navbar
  let currentUserProfile: Profile | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    currentUserProfile = data as Profile | null;
  }

  const isOwner = user?.id === typedProfile.id;

  // Get friends
  const { data: friendships } = await supabase
    .from("friendships")
    .select("friend_id")
    .eq("user_id", typedProfile.id);

  let friends: Profile[] = [];
  if (friendships && friendships.length > 0) {
    const friendIds = friendships.map((f) => f.friend_id);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .in("id", friendIds);
    friends = (data as Profile[]) || [];
  }

  // Check friendship status and pending requests
  let isFriend = false;
  let pendingRequest: "sent" | "received" | null = null;
  let requestId: string | null = null;

  if (user && !isOwner) {
    const { data: friendship } = await supabase
      .from("friendships")
      .select("id")
      .eq("user_id", user.id)
      .eq("friend_id", typedProfile.id)
      .single();
    isFriend = !!friendship;

    if (!isFriend) {
      // Check for pending request I sent
      const { data: sentReq } = await supabase
        .from("friend_requests")
        .select("id")
        .eq("from_user_id", user.id)
        .eq("to_user_id", typedProfile.id)
        .eq("status", "pending")
        .single();
      if (sentReq) {
        pendingRequest = "sent";
        requestId = sentReq.id;
      } else {
        // Check for pending request they sent me
        const { data: recvReq } = await supabase
          .from("friend_requests")
          .select("id")
          .eq("from_user_id", typedProfile.id)
          .eq("to_user_id", user.id)
          .eq("status", "pending")
          .single();
        if (recvReq) {
          pendingRequest = "received";
          requestId = recvReq.id;
        }
      }
    }
  }

  // Get wall comments
  const { data: comments } = await supabase
    .from("wall_comments")
    .select("*, author:profiles!wall_comments_author_id_fkey(*)")
    .eq("profile_id", typedProfile.id)
    .order("created_at", { ascending: false });

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: typedProfile.bg_color || "#b4c8d8" }}
    >
      {user && <Navbar username={currentUserProfile?.username} />}

      <div className="mx-auto max-w-5xl px-3 py-4 sm:px-4 sm:py-6">
        {/* Profile header banner */}
        <div className="mb-3 overflow-hidden rounded border border-[#6699cc] bg-gradient-to-r from-[#2a5f8f] to-[#4a86b8] p-3 text-white shadow-md sm:mb-4 sm:p-4">
          <h1 className="text-lg font-bold drop-shadow-[1px_1px_0px_rgba(0,0,0,0.3)] sm:text-2xl">
            {typedProfile.display_name || typedProfile.username}&apos;s Vybe
          </h1>
          <p className="text-[10px] text-white/70 sm:text-xs">
            vybe.social/{typedProfile.username}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
          {/* Left column: Profile + Friends */}
          <div className="space-y-3 sm:space-y-4 md:col-span-1">
            <ProfileCard profile={typedProfile} />
            <ProfileViewCounter
              profileId={typedProfile.id}
              currentUserId={user?.id || null}
              isOwner={isOwner}
            />
            <TopFriends
              friends={friends}
              profileId={typedProfile.id}
              currentUserId={user?.id || null}
              isOwner={isOwner}
              isFriend={isFriend}
              pendingRequest={pendingRequest}
              requestId={requestId}
            />
          </div>

          {/* Right column: Comment Wall */}
          <div className="md:col-span-2">
            <CommentWall
              profileId={typedProfile.id}
              comments={comments || []}
              currentUserId={user?.id || null}
              isOwner={isOwner}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-[10px] text-[#6688aa] sm:mt-6">
          &copy; 2026 Vybe. All rights reserved.
        </div>
      </div>
    </div>
  );
}
