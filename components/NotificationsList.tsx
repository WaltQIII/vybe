"use client";

import type { Profile } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

interface Notification {
  id: string;
  type: string;
  from_user: Profile | null;
  data: Record<string, string>;
  read: boolean;
  created_at: string;
}

interface NotificationsListProps {
  notifications: Notification[];
}

export default function NotificationsList({
  notifications,
}: NotificationsListProps) {
  if (notifications.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-[#999]">
        No notifications yet.
      </div>
    );
  }

  return (
    <div>
      {notifications.map((notif, i) => {
        const fromUser = notif.from_user;
        let message = "";
        let href = "/";

        switch (notif.type) {
          case "wall_comment":
            message = "left a comment on your wall";
            href = `/profile/${notif.data.profile_username || ""}`;
            break;
          case "friend_request":
            message = "sent you a friend request";
            href = `/profile/${fromUser?.username || ""}`;
            break;
          case "friend_accepted":
            message = "accepted your friend request";
            href = `/profile/${fromUser?.username || ""}`;
            break;
          case "direct_message":
            message = `sent you a message${notif.data.preview ? `: "${notif.data.preview}"` : ""}`;
            href = `/messages/${fromUser?.username || ""}`;
            break;
        }

        return (
          <Link
            key={notif.id}
            href={href}
            className={`flex items-center gap-3 border-b border-[#dde6ed] p-3 no-underline hover:bg-[#eef3f7] ${
              !notif.read ? "bg-[#eef3f7]" : i % 2 === 0 ? "bg-[#f5f8fa]" : "bg-white"
            }`}
          >
            <Image
              src={fromUser?.avatar_url || "/default-avatar.svg"}
              alt={fromUser?.display_name || "User"}
              width={36}
              height={36}
              className="h-9 w-9 flex-shrink-0 rounded border border-[#6699cc] object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[#333] sm:text-sm">
                <span className="font-bold text-[#003366]">
                  {fromUser?.display_name || fromUser?.username || "Someone"}
                </span>{" "}
                {message}
              </p>
              <span className="text-[10px] text-[#999]">
                {new Date(notif.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>
            {!notif.read && (
              <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[#ff6600]" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
