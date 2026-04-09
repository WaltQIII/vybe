"use client";

import { createClient } from "@/lib/supabase";
import type { Profile, Message } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface ChatViewProps {
  conversationId: string;
  currentUserId: string;
  otherUser: Profile;
  initialMessages: Message[];
}

export default function ChatView({
  conversationId,
  currentUserId,
  otherUser,
  initialMessages,
}: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll for new messages every 10s
  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const { data } = await supabase
          .from("messages")
          .select("*, sender:profiles!messages_sender_id_fkey(*)")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true });
        if (!cancelled && data) setMessages(data as Message[]);

        // Mark as read
        await supabase
          .from("messages")
          .update({ read: true })
          .eq("conversation_id", conversationId)
          .neq("sender_id", currentUserId)
          .eq("read", false);
      } catch {
        // ignore
      }
    }

    const interval = setInterval(poll, 10000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [conversationId, currentUserId, supabase]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || sending) return;

    setSending(true);
    try {
      const { data: newMsg } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          body: body.trim(),
        })
        .select("*, sender:profiles!messages_sender_id_fkey(*)")
        .single();

      if (newMsg) setMessages((prev) => [...prev, newMsg as Message]);

      // Update conversation last_message_at
      await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);

      // Notify the other user
      await supabase.from("notifications").insert({
        user_id: otherUser.id,
        type: "direct_message",
        from_user_id: currentUserId,
        data: { preview: body.trim().substring(0, 50) },
      });

      setBody("");
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Chat header */}
      <div className="border-b border-[#dde6ed] bg-white px-3 py-2">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <Link href="/messages" className="text-sm text-[#003366]">
            &larr;
          </Link>
          <Image
            src={otherUser.avatar_url || "/default-avatar.svg"}
            alt={otherUser.display_name || otherUser.username}
            width={32}
            height={32}
            className="h-8 w-8 rounded border border-[#6699cc] object-cover"
          />
          <Link
            href={`/profile/${otherUser.username}`}
            className="text-sm font-bold text-[#003366] no-underline"
          >
            {otherUser.display_name || otherUser.username}
          </Link>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mx-auto max-w-2xl space-y-2">
          {messages.length === 0 && (
            <p className="py-8 text-center text-xs text-[#999]">
              No messages yet. Say hello!
            </p>
          )}
          {messages.map((msg) => {
            const isMine = msg.sender_id === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-3 py-2 ${
                    isMine
                      ? "bg-[#2a5f8f] text-white"
                      : "border border-[#dde6ed] bg-white text-[#333]"
                  }`}
                >
                  <p className="break-words text-sm">{msg.body}</p>
                  <p
                    className={`mt-1 text-[10px] ${
                      isMine ? "text-white/60" : "text-[#999]"
                    }`}
                  >
                    {new Date(msg.created_at).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-[#dde6ed] bg-white px-3 py-2">
        <form
          onSubmit={handleSend}
          className="mx-auto flex max-w-2xl gap-2"
        >
          <input
            type="text"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Type a message..."
            className="ms-input flex-1"
            autoFocus
          />
          <button
            type="submit"
            disabled={sending || !body.trim()}
            className="ms-btn-primary rounded disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
