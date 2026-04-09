import { createServerSupabaseClient } from "@/lib/supabase-server";
import { requireAuth, getProfile } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import ChatView from "@/components/ChatView";
import type { Profile, Message } from "@/lib/types";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await requireAuth();
  const currentProfile = (await getProfile()) as Profile | null;
  const supabase = await createServerSupabaseClient();

  // Find the other user
  const { data: otherProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!otherProfile) notFound();

  const typedOther = otherProfile as Profile;

  // Find or create conversation
  const { data: existingConvo } = await supabase
    .from("conversations")
    .select("*")
    .or(
      `and(participant_1_id.eq.${user.id},participant_2_id.eq.${typedOther.id}),and(participant_1_id.eq.${typedOther.id},participant_2_id.eq.${user.id})`
    )
    .single();

  let conversationId = existingConvo?.id;

  if (!conversationId) {
    const { data: newConvo } = await supabase
      .from("conversations")
      .insert({ participant_1_id: user.id, participant_2_id: typedOther.id })
      .select()
      .single();
    conversationId = newConvo?.id;
  }

  if (!conversationId) notFound();

  // Get messages
  const { data: messages } = await supabase
    .from("messages")
    .select("*, sender:profiles!messages_sender_id_fkey(*)")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  // Mark unread messages as read
  await supabase
    .from("messages")
    .update({ read: true })
    .eq("conversation_id", conversationId)
    .neq("sender_id", user.id)
    .eq("read", false);

  return (
    <div className="flex min-h-screen flex-col bg-[#b4c8d8]">
      <Navbar username={currentProfile?.username} userId={user.id} />
      <ChatView
        conversationId={conversationId}
        currentUserId={user.id}
        otherUser={typedOther}
        initialMessages={(messages as Message[]) || []}
      />
    </div>
  );
}
