"use client";

import { createClient } from "@/lib/supabase";
import { useState } from "react";

interface ReportButtonProps {
  reporterId: string;
  reportedUserId?: string;
  reportedCommentId?: string;
  label?: string;
}

export default function ReportButton({
  reporterId,
  reportedUserId,
  reportedCommentId,
  label = "Report",
}: ReportButtonProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleSubmit() {
    if (!reason.trim()) return;
    setLoading(true);
    await supabase.from("reports").insert({
      reporter_id: reporterId,
      reported_user_id: reportedUserId || null,
      reported_comment_id: reportedCommentId || null,
      reason: reason.trim(),
    });
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <span className="text-[10px] text-green-600">Reported</span>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-[10px] text-[#999] hover:text-red-500"
      >
        {label}
      </button>
    );
  }

  return (
    <div className="mt-1 rounded border border-[#dde6ed] bg-[#f5f8fa] p-2">
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Why are you reporting this?"
        rows={2}
        className="ms-input !text-xs"
      />
      <div className="mt-1 flex gap-1">
        <button
          onClick={handleSubmit}
          disabled={loading || !reason.trim()}
          className="ms-btn-accent rounded !px-2 !py-1 !text-[10px] disabled:opacity-50"
        >
          {loading ? "..." : "Submit"}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="rounded px-2 py-1 text-[10px] text-[#999] hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
