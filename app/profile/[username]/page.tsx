import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getUser } from "@/lib/auth";
import ProfileCard from "@/components/ProfileCard";
import CommentWall from "@/components/CommentWall";
import TopFriends from "@/components/TopFriends";
import ProfileViewCounter from "@/components/ProfileViewCounter";
import ProfileSong from "@/components/ProfileSong";
import ReportButton from "@/components/ReportButton";
import BlockButton from "@/components/BlockButton";
import Navbar from "@/components/Navbar";
import ComponentErrorBoundary from "@/components/ComponentErrorBoundary";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import type { Profile } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, username, bio, mood")
    .eq("username", username)
    .single();

  if (!profile) return { title: "Profile Not Found" };

  const name = profile.display_name || profile.username;
  const description = profile.bio || profile.mood || `Check out ${name}'s Vybe profile.`;

  return {
    title: `${name}'s Vybe`,
    description,
    openGraph: {
      title: `${name}'s Vybe`,
      description,
      type: "profile",
    },
  };
}

export const dynamic = "force-dynamic";

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

  // Check if this user has blocked the viewer
  let blockedByOwner = false;
  if (user && !isOwner) {
    const { data: block } = await supabase
      .from("blocks")
      .select("id")
      .eq("blocker_id", typedProfile.id)
      .eq("blocked_id", user.id)
      .single();
    blockedByOwner = !!block;
  }

  if (blockedByOwner) {
    return (
      <div className="min-h-screen bg-[#b4c8d8]">
        {user && <Navbar username={currentUserProfile?.username} userId={user.id} />}
        <div className="mx-auto max-w-2xl px-3 py-12 text-center">
          <div className="ms-panel overflow-hidden rounded">
            <div className="ms-section-header">Profile Unavailable</div>
            <div className="p-6">
              <p className="text-sm text-[#666]">This profile is not available.</p>
              <Link href="/" className="mt-3 inline-block text-xs text-[#003366]">
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if viewer has blocked this profile owner
  let hasBlockedOwner = false;
  if (user && !isOwner) {
    const { data: block } = await supabase
      .from("blocks")
      .select("id")
      .eq("blocker_id", user.id)
      .eq("blocked_id", typedProfile.id)
      .single();
    hasBlockedOwner = !!block;
  }

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
      {user && (
        <ComponentErrorBoundary name="Navbar">
          <Navbar username={currentUserProfile?.username} userId={user.id} />
        </ComponentErrorBoundary>
      )}

      <div className="mx-auto max-w-5xl px-3 py-4 sm:px-4 sm:py-6">
        {/* Profile header banner */}
        <div className="mb-3 overflow-hidden rounded border border-[#6699cc] bg-gradient-to-r from-[#2a5f8f] to-[#4a86b8] p-3 text-white shadow-md sm:mb-4 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold drop-shadow-[1px_1px_0px_rgba(0,0,0,0.3)] sm:text-2xl">
                {typedProfile.display_name || typedProfile.username}&apos;s Vybe
              </h1>
              <p className="text-[10px] text-white/70 sm:text-xs">
                vybe.social/{typedProfile.username}
              </p>
            </div>
            {user && !isOwner && (
              <div className="flex items-center gap-3">
                <ComponentErrorBoundary name="ReportButton">
                  <ReportButton
                    reporterId={user.id}
                    reportedUserId={typedProfile.id}
                    label="Report Profile"
                  />
                </ComponentErrorBoundary>
                <ComponentErrorBoundary name="BlockButton">
                  <BlockButton
                    currentUserId={user.id}
                    targetUserId={typedProfile.id}
                    isBlocked={hasBlockedOwner}
                  />
                </ComponentErrorBoundary>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
          {/* Left column */}
          <div className="space-y-3 sm:space-y-4 md:col-span-1">
            <ProfileCard profile={typedProfile} />
            <ComponentErrorBoundary name="ProfileViewCounter">
              <ProfileViewCounter
                profileId={typedProfile.id}
                currentUserId={user?.id || null}
                isOwner={isOwner}
              />
            </ComponentErrorBoundary>
            {typedProfile.song_url && (
              <ComponentErrorBoundary name="ProfileSong">
                <ProfileSong songUrl={typedProfile.song_url} />
              </ComponentErrorBoundary>
            )}
            <ComponentErrorBoundary name="TopFriends">
              <TopFriends
                friends={friends}
                profileId={typedProfile.id}
                currentUserId={user?.id || null}
                isOwner={isOwner}
                isFriend={isFriend}
                pendingRequest={pendingRequest}
                requestId={requestId}
              />
            </ComponentErrorBoundary>
          </div>

          {/* Right column */}
          <div className="md:col-span-2">
            <ComponentErrorBoundary name="CommentWall">
              <CommentWall
                profileId={typedProfile.id}
                profileUsername={typedProfile.username}
                comments={comments || []}
                currentUserId={user?.id || null}
                isOwner={isOwner}
              />
            </ComponentErrorBoundary>
          </div>
        </div>

        <div className="mt-4 text-center text-[10px] text-[#6688aa] sm:mt-6">
          &copy; 2026 Vybe. All rights reserved.
        </div>
      </div>
    </div>
  );
}
