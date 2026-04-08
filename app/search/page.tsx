import { createServerSupabaseClient } from "@/lib/supabase-server";
import { requireAuth, getProfile } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import type { Profile } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await requireAuth();
  const profile = (await getProfile()) as Profile | null;
  const { q } = await searchParams;
  const supabase = await createServerSupabaseClient();

  let results: Profile[] = [];
  if (q && q.trim().length >= 2) {
    const query = q.trim().toLowerCase();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .or(`username.ilike.%${query}%,display_name.ilike.%${query}%,city.ilike.%${query}%,country.ilike.%${query}%`)
      .neq("id", user.id)
      .limit(20);
    results = (data as Profile[]) || [];
  }

  return (
    <div className="min-h-screen bg-[#b4c8d8]">
      <Navbar username={profile?.username} userId={user.id} />
      <div className="mx-auto max-w-2xl px-3 py-4 sm:px-4 sm:py-6">
        <div className="ms-panel overflow-hidden rounded">
          <div className="ms-section-header">Find People</div>
          <div className="p-3 sm:p-4">
            <form action="/search" method="GET">
              <div className="flex gap-2">
                <input
                  type="text"
                  name="q"
                  defaultValue={q || ""}
                  placeholder="Search by username or name..."
                  className="ms-input flex-1"
                  autoFocus
                />
                <button type="submit" className="ms-btn-primary rounded">
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>

        {q && (
          <div className="ms-panel mt-3 overflow-hidden rounded sm:mt-4">
            <div className="ms-section-header">
              Results for &quot;{q}&quot; ({results.length})
            </div>
            {results.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#999]">
                No users found matching &quot;{q}&quot;.
              </div>
            ) : (
              <div>
                {results.map((r, i) => (
                  <Link
                    key={r.id}
                    href={`/profile/${r.username}`}
                    className={`flex items-center gap-3 p-3 no-underline hover:bg-[#eef3f7] ${
                      i % 2 === 0 ? "bg-[#f5f8fa]" : "bg-white"
                    } ${i < results.length - 1 ? "border-b border-[#dde6ed]" : ""}`}
                  >
                    <Image
                      src={r.avatar_url || "/default-avatar.svg"}
                      alt={r.display_name || r.username}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded border border-[#6699cc] object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-[#003366]">
                        {r.display_name || r.username}
                      </p>
                      <p className="text-xs text-[#6688aa]">@{r.username}</p>
                      {(r.city || r.country) && (
                        <p className="text-[10px] text-[#555]">
                          &#128205; {[r.city, r.country].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>
                    {r.mood && (
                      <span className="hidden text-[10px] italic text-[#999] sm:block">
                        {r.mood}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
