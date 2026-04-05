import { createServerSupabaseClient } from "@/lib/supabase-server";
import { requireAuth, getProfile } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import FeedItem from "@/components/FeedItem";
import type { Profile, WallComment } from "@/lib/types";
import Link from "next/link";

export default async function HomePage() {
  const user = await requireAuth();
  const supabase = await createServerSupabaseClient();

  const typedProfile = (await getProfile()) as Profile | null;

  // Get friends list
  const { data: friendships } = await supabase
    .from("friendships")
    .select("friend_id")
    .eq("user_id", user.id);

  const friendIds = friendships?.map((f) => f.friend_id) || [];

  // Get recent wall comments involving friends (posted by or on friend's wall)
  let feedComments: (WallComment & { profile?: Profile })[] = [];

  if (friendIds.length > 0) {
    const { data: comments } = await supabase
      .from("wall_comments")
      .select(
        "*, author:profiles!wall_comments_author_id_fkey(*), profile:profiles!wall_comments_profile_id_fkey(*)"
      )
      .or(
        `author_id.in.(${friendIds.join(",")}),profile_id.in.(${friendIds.join(",")})`
      )
      .order("created_at", { ascending: false })
      .limit(50);

    feedComments = (comments as (WallComment & { profile?: Profile })[]) || [];
  }

  return (
    <div className="min-h-screen bg-[#b4c8d8]">
      <Navbar username={typedProfile?.username} />

      <div className="mx-auto max-w-3xl px-3 py-4 sm:px-4 sm:py-6">
        {/* Welcome banner */}
        <div className="ms-panel mb-4 overflow-hidden rounded sm:mb-6">
          <div className="ms-section-header">
            Welcome Back!
          </div>
          <div className="p-3 sm:p-5">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4a86b8] to-[#2a5f8f] text-base font-bold text-white shadow-inner sm:h-12 sm:w-12 sm:text-lg">
                {(typedProfile?.display_name || typedProfile?.username || "?")[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-base font-bold text-[#003366] sm:text-xl">
                  Hey there, {typedProfile?.display_name || typedProfile?.username || "friend"}!
                </h1>
                {typedProfile?.mood && (
                  <p className="truncate text-xs italic text-[#666]">
                    Mood: {typedProfile.mood}
                  </p>
                )}
              </div>
            </div>

            {typedProfile?.username && (
              <div className="mt-3 flex flex-col gap-2 sm:mt-4 sm:flex-row">
                <Link
                  href={`/profile/${typedProfile.username}`}
                  className="ms-btn-primary inline-block rounded text-center no-underline"
                >
                  View My Profile
                </Link>
                <Link
                  href="/settings"
                  className="ms-btn-primary inline-block rounded text-center no-underline"
                >
                  Edit Profile
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Friend Activity */}
        <div className="ms-panel overflow-hidden rounded">
          <div className="ms-section-header flex items-center gap-2">
            <span>&#9733;</span> Friend Activity
          </div>
          <div className="p-3 sm:p-4">
            {friendIds.length === 0 && (
              <div className="rounded border border-dashed border-[#6699cc] bg-[#eef3f7] p-4 text-center sm:p-6">
                <p className="text-xs text-[#336699] sm:text-sm">
                  You haven&apos;t added any friends yet!
                </p>
                <p className="mt-1 text-[10px] text-[#666] sm:text-xs">
                  Browse profiles and add friends to see their activity here.
                </p>
              </div>
            )}

            {friendIds.length > 0 && feedComments.length === 0 && (
              <div className="rounded border border-dashed border-[#6699cc] bg-[#eef3f7] p-4 text-center sm:p-6">
                <p className="text-xs text-[#336699] sm:text-sm">
                  No recent activity from your friends yet.
                </p>
              </div>
            )}

            <div className="space-y-2 sm:space-y-3">
              {feedComments.map((comment) => (
                <FeedItem key={comment.id} comment={comment} />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-[10px] text-[#6688aa] sm:mt-6">
          &copy; 2003-2026 MySpace Clone. All rights reserved.
          <br />
          <span className="italic">The internet was better in 2005.</span>
        </div>
      </div>
    </div>
  );
}
