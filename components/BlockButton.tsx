"use client";

import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface BlockButtonProps {
  currentUserId: string;
  targetUserId: string;
  isBlocked: boolean;
}

export default function BlockButton({
  currentUserId,
  targetUserId,
  isBlocked,
}: BlockButtonProps) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  async function handleBlock() {
    if (!confirm("Are you sure you want to block this user? They won't be able to view your profile or comment on your wall.")) return;
    setLoading(true);
    try {
      await supabase.from("blocks").insert({
        blocker_id: currentUserId,
        blocked_id: targetUserId,
      });
      router.refresh();
    } catch { /* ignore */ } finally { setLoading(false); }
  }

  async function handleUnblock() {
    setLoading(true);
    try {
      await supabase
        .from("blocks")
        .delete()
        .eq("blocker_id", currentUserId)
        .eq("blocked_id", targetUserId);
      router.refresh();
    } catch { /* ignore */ } finally { setLoading(false); }
  }

  return isBlocked ? (
    <button
      onClick={handleUnblock}
      disabled={loading}
      className="text-[10px] text-[#999] hover:text-[#003366] disabled:opacity-50"
    >
      {loading ? "..." : "Unblock User"}
    </button>
  ) : (
    <button
      onClick={handleBlock}
      disabled={loading}
      className="text-[10px] text-[#999] hover:text-red-500 disabled:opacity-50"
    >
      {loading ? "..." : "Block User"}
    </button>
  );
}
