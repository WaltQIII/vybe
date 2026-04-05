import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getUser } from "@/lib/auth";
import ProfileCard from "@/components/ProfileCard";
import CommentWall from "@/components/CommentWall";
import TopFriends from "@/components/TopFriends";
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

  // Check if current user is already a friend (for add/remove button)
  let isFriend = false;
  if (user && !isOwner) {
    const { data } = await supabase
      .from("friendships")
      .select("id")
      .eq("user_id", user.id)
      .eq("friend_id", typedProfile.id)
      .single();
    isFriend = !!data;
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

      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Profile header banner */}
        <div className="mb-4 overflow-hidden rounded border border-[#6699cc] bg-gradient-to-r from-[#2a5f8f] to-[#4a86b8] p-4 text-white shadow-md">
          <h1 className="text-2xl font-bold drop-shadow-[1px_1px_0px_rgba(0,0,0,0.3)]">
            {typedProfile.display_name || typedProfile.username}&apos;s Space
          </h1>
          <p className="text-xs text-white/70">
            myspace.com/{typedProfile.username}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Left column: Profile + Friends */}
          <div className="space-y-4 md:col-span-1">
            <ProfileCard profile={typedProfile} />
            <TopFriends
              friends={friends}
              profileId={typedProfile.id}
              currentUserId={user?.id || null}
              isOwner={isOwner}
              isFriend={isFriend}
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
        <div className="mt-6 text-center text-[10px] text-[#6688aa]">
          &copy; 2003-2026 MySpace Clone. All rights reserved.
        </div>
      </div>
    </div>
  );
}
