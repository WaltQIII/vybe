"use client";

import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { useEffect, useState } from "react";

interface MessageBadgeProps {
  userId: string;
}

export default function MessageBadge({ userId }: MessageBadgeProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    async function fetchCount() {
      try {
        // Get all conversations for this user
        const { data: convos } = await supabase
          .from("conversations")
          .select("id")
          .or(`participant_1_id.eq.${userId},participant_2_id.eq.${userId}`);

        if (!convos || convos.length === 0) {
          if (!cancelled) setUnreadCount(0);
          return;
        }

        const convoIds = convos.map((c) => c.id);
        const { count } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .in("conversation_id", convoIds)
          .neq("sender_id", userId)
          .eq("read", false);

        if (!cancelled) setUnreadCount(count ?? 0);
      } catch {
        // ignore
      }
    }

    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [userId]);

  return (
    <Link
      href="/messages"
      className="relative rounded px-2 py-1.5 text-white no-underline hover:bg-white/15"
      aria-label="Messages"
    >
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
      </svg>
      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff6600] text-[9px] font-bold text-white">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
