"use client";

import Link from "next/link";

interface SendMessageButtonProps {
  username: string;
}

export default function SendMessageButton({ username }: SendMessageButtonProps) {
  return (
    <Link
      href={`/messages/${username}`}
      className="ms-btn-primary inline-block rounded text-center no-underline"
    >
      Send Message
    </Link>
  );
}
