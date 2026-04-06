"use client";

import { createClient } from "@/lib/supabase";
import type { Profile } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Report {
  id: string;
  reporter: Profile | null;
  reported_user: Profile | null;
  reported_comment_id: string | null;
  reason: string;
  status: string;
  created_at: string;
}

interface AdminReportListProps {
  reports: Report[];
}

export default function AdminReportList({ reports }: AdminReportListProps) {
  const [filter, setFilter] = useState<string>("pending");
  const supabase = createClient();
  const router = useRouter();

  const filtered = reports.filter((r) =>
    filter === "all" ? true : r.status === filter
  );

  async function updateStatus(reportId: string, status: string) {
    await supabase.from("reports").update({ status }).eq("id", reportId);
    router.refresh();
  }

  return (
    <div>
      {/* Filter tabs */}
      <div className="mb-3 flex gap-1">
        {["pending", "reviewed", "dismissed", "all"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded px-3 py-1.5 text-xs font-bold uppercase ${
              filter === f
                ? "bg-[#003366] text-white"
                : "bg-white text-[#003366] border border-[#6699cc]"
            }`}
          >
            {f} {f !== "all" && `(${reports.filter((r) => r.status === f).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="ms-panel overflow-hidden rounded">
          <div className="p-6 text-center text-xs text-[#999]">
            No {filter === "all" ? "" : filter} reports.
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((report) => (
            <div key={report.id} className="ms-panel overflow-hidden rounded">
              <div className="p-3 sm:p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                          report.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : report.status === "reviewed"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {report.status}
                      </span>
                      <span className="text-[10px] text-[#999]">
                        {new Date(report.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="mt-1 text-xs">
                      <span className="text-[#999]">Reporter:</span>{" "}
                      <Link
                        href={`/profile/${report.reporter?.username}`}
                        className="font-bold text-[#003366]"
                      >
                        {report.reporter?.display_name || report.reporter?.username}
                      </Link>
                    </p>
                    <p className="text-xs">
                      <span className="text-[#999]">Reported:</span>{" "}
                      <Link
                        href={`/profile/${report.reported_user?.username}`}
                        className="font-bold text-[#003366]"
                      >
                        {report.reported_user?.display_name || report.reported_user?.username}
                      </Link>
                      {report.reported_comment_id && (
                        <span className="text-[#999]"> (comment)</span>
                      )}
                    </p>
                    <p className="mt-1 rounded bg-[#f5f8fa] p-2 text-xs text-[#333]">
                      {report.reason}
                    </p>
                  </div>
                  {report.status === "pending" && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => updateStatus(report.id, "reviewed")}
                        className="ms-btn-primary rounded !px-2 !py-1 !text-[10px]"
                      >
                        Review
                      </button>
                      <button
                        onClick={() => updateStatus(report.id, "dismissed")}
                        className="rounded border border-gray-300 px-2 py-1 text-[10px] text-[#666] hover:bg-gray-50"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
