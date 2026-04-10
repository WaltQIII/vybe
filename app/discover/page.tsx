import { createServerSupabaseClient } from "@/lib/supabase-server";
import { requireAuth, getProfile } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import type { Profile } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filter?: string }>;
}) {
  const user = await requireAuth();
  const currentProfile = (await getProfile()) as Profile | null;
  const { q, filter } = await searchParams;
  const supabase = await createServerSupabaseClient();

  const activeFilter = filter || "everyone";

  // Build query
  let query = supabase
    .from("profiles")
    .select("*")
    .neq("id", user.id)
    .limit(20);

  // Search by name, username, city, country
  if (q && q.trim().length >= 2) {
    const term = q.trim().toLowerCase();
    query = query.or(
      `username.ilike.%${term}%,display_name.ilike.%${term}%,city.ilike.%${term}%,country.ilike.%${term}%`
    );
  }

  // Location filters
  if (activeFilter === "same_city" && currentProfile?.city) {
    query = query.eq("city", currentProfile.city);
  } else if (activeFilter === "same_country" && currentProfile?.country) {
    query = query.eq("country", currentProfile.country);
  }

  const { data } = await query.order("created_at", { ascending: false });
  const results = (data as Profile[]) || [];

  // "People you may know" — same city
  let localPeople: Profile[] = [];
  if (!q && activeFilter === "everyone" && currentProfile?.city) {
    const { data: local } = await supabase
      .from("profiles")
      .select("*")
      .eq("city", currentProfile.city)
      .neq("id", user.id)
      .limit(6);
    localPeople = (local as Profile[]) || [];
  }

  const filters = [
    { key: "everyone", label: "Everyone" },
    { key: "same_city", label: "Same City" },
    { key: "same_country", label: "Same State" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar username={currentProfile?.username} userId={user.id} />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="mb-4 text-xl font-bold text-[var(--text)]">Discover</h1>

        {/* Search */}
        <form action="/discover" method="GET" className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              name="q"
              defaultValue={q || ""}
              placeholder="Search by name, city, or country..."
              className="vb-input flex-1"
              autoFocus
            />
            <button type="submit" className="vb-btn vb-btn-primary rounded-lg">
              Search
            </button>
          </div>
        </form>

        {/* Filter tabs */}
        <div className="mb-4 flex gap-1">
          {filters.map((f) => (
            <Link
              key={f.key}
              href={`/discover?filter=${f.key}${q ? `&q=${q}` : ""}`}
              className={`vb-btn rounded-lg !px-3 !py-1.5 !text-xs no-underline ${
                activeFilter === f.key ? "vb-btn-primary" : "vb-btn-secondary"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        {/* People you may know */}
        {localPeople.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-3 text-sm font-semibold text-[var(--text-secondary)]">
              People in {currentProfile?.city}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {localPeople.map((p) => (
                <UserCard key={p.id} profile={p} />
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <h2 className="mb-3 text-sm font-semibold text-[var(--text-secondary)]">
          {q ? `Results for "${q}"` : "Browse People"} ({results.length})
        </h2>

        {results.length === 0 ? (
          <div className="vb-card p-6 text-center text-sm text-[var(--text-muted)]">
            No one found. Try a different search.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {results.map((p) => (
              <UserCard key={p.id} profile={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function UserCard({ profile }: { profile: Profile }) {
  return (
    <Link
      href={`/profile/${profile.username}`}
      className="vb-card flex flex-col items-center p-4 text-center no-underline transition-transform hover:scale-[1.02]"
    >
      <Image
        src={profile.avatar_url || "/default-avatar.svg"}
        alt={profile.display_name || profile.username}
        width={64}
        height={64}
        className="h-16 w-16 rounded-full object-cover"
      />
      <p className="mt-2 w-full truncate text-sm font-semibold text-[var(--text)]">
        {profile.display_name || profile.username}
      </p>
      <p className="w-full truncate text-xs text-[var(--text-muted)]">@{profile.username}</p>
      {(profile.city || profile.country) && (
        <p className="mt-1 w-full truncate text-[10px] text-[var(--text-muted)]">
          &#128205; {[profile.city, profile.country].filter(Boolean).join(", ")}
        </p>
      )}
      {profile.mood && (
        <p className="mt-1 w-full truncate text-[10px] italic text-[var(--text-muted)]">
          {profile.mood}
        </p>
      )}
    </Link>
  );
}
