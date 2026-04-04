import { createServerSupabaseClient } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import FeedItem from "@/components/FeedItem";
import type { Profile, WallComment } from "@/lib/types";
import Link from "next/link";

export default async function HomePage() {
  const user = await requireAuth();
  const supabase = await createServerSupabaseClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const typedProfile = profile as Profile | null;

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
    <div className="min-h-screen bg-[#c0c0d0]">
      <Navbar username={typedProfile?.username} />

      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8 rounded-lg border-2 border-[#003366] bg-white p-6 shadow-md">
          <h1 className="text-2xl font-bold text-[#003366]">
            Welcome back, {typedProfile?.display_name || typedProfile?.username}!
          </h1>
          {typedProfile?.mood && (
            <p className="mt-1 text-sm italic text-gray-600">
              {typedProfile.mood}
            </p>
          )}
          <div className="mt-3 flex gap-3">
            <Link
              href={`/profile/${typedProfile?.username}`}
              className="rounded bg-[#003366] px-4 py-1.5 text-sm font-bold text-white no-underline hover:bg-[#004488]"
            >
              View My Profile
            </Link>
            <Link
              href="/settings"
              className="rounded border border-gray-300 px-4 py-1.5 text-sm no-underline hover:bg-gray-50"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        <h2 className="mb-4 text-xl font-bold text-[#003366]">
          Friend Activity
        </h2>

        {friendIds.length === 0 && (
          <div className="rounded-lg border-2 border-[#003366] bg-white p-6 text-center shadow-md">
            <p className="text-gray-500">
              You haven&apos;t added any friends yet! Browse profiles and add
              friends to see their activity here.
            </p>
          </div>
        )}

        {friendIds.length > 0 && feedComments.length === 0 && (
          <div className="rounded-lg border-2 border-[#003366] bg-white p-6 text-center shadow-md">
            <p className="text-gray-500">
              No recent activity from your friends.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {feedComments.map((comment) => (
            <FeedItem key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
}
