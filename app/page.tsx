import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getUser, getProfile } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import ComponentErrorBoundary from "@/components/ComponentErrorBoundary";
import PostCard from "@/components/PostCard";
import CreatePost from "@/components/CreatePost";
import LandingPage from "@/components/LandingPage";
import type { Profile, Post } from "@/lib/types";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getUser();

  if (!user) {
    return <LandingPage />;
  }

  const supabase = await createServerSupabaseClient();
  const typedProfile = (await getProfile()) as Profile | null;

  // Get posts with author, like count, comment count, and whether current user liked
  const { data: rawPosts } = await supabase
    .from("posts")
    .select("*, author:profiles!posts_user_id_fkey(*)")
    .order("created_at", { ascending: false })
    .limit(30);

  // Enrich with like/comment counts
  const posts: Post[] = await Promise.all(
    (rawPosts || []).map(async (post) => {
      const { count: likeCount } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id);
      const { count: commentCount } = await supabase
        .from("post_comments")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id);
      const { data: userLike } = await supabase
        .from("likes")
        .select("id")
        .eq("post_id", post.id)
        .eq("user_id", user.id)
        .single();

      return {
        ...post,
        like_count: likeCount || 0,
        comment_count: commentCount || 0,
        liked_by_user: !!userLike,
      } as Post;
    })
  );

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <ComponentErrorBoundary name="Navbar">
        <Navbar username={typedProfile?.username} userId={user.id} />
      </ComponentErrorBoundary>

      <div className="mx-auto max-w-2xl px-4 py-6">
        {/* Welcome */}
        <div className="vb-card overflow-hidden p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] text-lg font-bold text-white">
              {(typedProfile?.display_name || typedProfile?.username || "?")[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-[var(--text)]">
                Hey, {typedProfile?.display_name || typedProfile?.username || "friend"}
              </h1>
              {typedProfile?.mood && (
                <p className="truncate text-sm text-[var(--text-muted)]">{typedProfile.mood}</p>
              )}
            </div>
          </div>
          {typedProfile?.username && (
            <div className="mt-4 flex gap-2">
              <Link href={`/profile/${typedProfile.username}`} className="vb-btn vb-btn-primary rounded-lg !text-xs no-underline">
                View Profile
              </Link>
              <Link href="/discover" className="vb-btn vb-btn-secondary rounded-lg !text-xs no-underline">
                Discover People
              </Link>
            </div>
          )}
        </div>

        {/* Create Post */}
        <div className="mt-4">
          <CreatePost userId={user.id} />
        </div>

        {/* Posts Feed */}
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-semibold text-[var(--text-secondary)]">Feed</h2>

          {posts.length === 0 ? (
            <div className="vb-card p-6 text-center">
              <p className="text-sm text-[var(--text-secondary)]">No posts yet.</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">Be the first to share something!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} currentUserId={user.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
