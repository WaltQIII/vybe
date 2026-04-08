"use client";

import { createClient } from "@/lib/supabase";
import { useEffect, useState } from "react";

interface ProfileViewCounterProps {
  profileId: string;
  currentUserId: string | null;
  isOwner: boolean;
}

export default function ProfileViewCounter({
  profileId,
  currentUserId,
  isOwner,
}: ProfileViewCounterProps) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    async function recordAndFetch() {
      try {
        // Record view if logged in and not viewing own profile
        if (currentUserId && !isOwner) {
          await supabase
            .from("profile_views")
            .upsert(
              { profile_id: profileId, viewer_id: currentUserId },
              { onConflict: "profile_id,viewer_id" }
            );
        }

        // Fetch total unique view count
        const { count: viewCount } = await supabase
          .from("profile_views")
          .select("*", { count: "exact", head: true })
          .eq("profile_id", profileId);

        if (!cancelled) setCount(viewCount ?? 0);
      } catch {
        // Ignore errors on unmounted component or network failures
      }
    }

    recordAndFetch();
    return () => { cancelled = true; };
  }, [profileId, currentUserId, isOwner]);

  if (count === null) return null;

  return (
    <div className="text-center text-[10px] text-[#999]">
      Visited <span className="font-bold text-[#336699]">{count}</span>{" "}
      {count === 1 ? "time" : "times"}
    </div>
  );
}
