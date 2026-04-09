import { createServerSupabaseClient } from "@/lib/supabase-server";
import { requireAuth, getProfile } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import type { Profile } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const user = await requireAuth();
  const currentProfile = (await getProfile()) as Profile | null;
  const supabase = await createServerSupabaseClient();

  // Get all conversations for this user
  const { data: conversations } = await supabase
    .from("conversations")
    .select("*, participant_1:profiles!conversations_participant_1_id_fkey(*), participant_2:profiles!conversations_participant_2_id_fkey(*)")
    .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`)
    .order("last_message_at", { ascending: false });

  // For each conversation, get the last message and unread count
  const convosWithDetails = await Promise.all(
    (conversations || []).map(async (convo) => {
      const otherUser = convo.participant_1_id === user.id
        ? (convo.participant_2 as Profile)
        : (convo.participant_1 as Profile);

      const { data: lastMsg } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", convo.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      const { count: unreadCount } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", convo.id)
        .neq("sender_id", user.id)
        .eq("read", false);

      return { ...convo, otherUser, lastMessage: lastMsg, unreadCount: unreadCount || 0 };
    })
  );

  return (
    <div className="min-h-screen bg-[#b4c8d8]">
      <Navbar username={currentProfile?.username} userId={user.id} />
      <div className="mx-auto max-w-2xl px-3 py-4 sm:px-4 sm:py-6">
        <div className="ms-panel overflow-hidden rounded">
          <div className="ms-section-header flex items-center gap-2">
            <span>&#9993;</span> Messages
          </div>
          {convosWithDetails.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#999]">
              No messages yet. Visit a profile and send a message to start a conversation!
            </div>
          ) : (
            <div>
              {convosWithDetails.map((convo, i) => (
                <Link
                  key={convo.id}
                  href={`/messages/${convo.otherUser?.username}`}
                  className={`flex items-center gap-3 p-3 no-underline hover:bg-[#eef3f7] ${
                    convo.unreadCount > 0 ? "bg-[#eef3f7]" : i % 2 === 0 ? "bg-[#f5f8fa]" : "bg-white"
                  } ${i < convosWithDetails.length - 1 ? "border-b border-[#dde6ed]" : ""}`}
                >
                  <Image
                    src={convo.otherUser?.avatar_url || "/default-avatar.svg"}
                    alt={convo.otherUser?.display_name || "User"}
                    width={44}
                    height={44}
                    className="h-11 w-11 flex-shrink-0 rounded border border-[#6699cc] object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-bold text-[#003366]">
                        {convo.otherUser?.display_name || convo.otherUser?.username}
                      </p>
                      <span className="flex-shrink-0 text-[10px] text-[#999]">
                        {convo.lastMessage && new Date(convo.lastMessage.created_at).toLocaleDateString("en-US", {
                          month: "short", day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="truncate text-xs text-[#666]">
                      {convo.lastMessage?.sender_id === user.id ? "You: " : ""}
                      {convo.lastMessage?.body || "No messages yet"}
                    </p>
                  </div>
                  {convo.unreadCount > 0 && (
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#ff6600] text-[10px] font-bold text-white">
                      {convo.unreadCount}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
