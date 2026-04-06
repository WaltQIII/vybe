import { createServerSupabaseClient } from "@/lib/supabase-server";
import { requireAuth, getProfile } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import Navbar from "@/components/Navbar";
import AdminReportList from "@/components/AdminReportList";
import { redirect } from "next/navigation";
import type { Profile } from "@/lib/types";

export default async function AdminPage() {
  const user = await requireAuth();

  if (!isAdmin(user.id)) redirect("/");

  const profile = (await getProfile()) as Profile | null;
  const supabase = await createServerSupabaseClient();

  const { data: reports } = await supabase
    .from("reports")
    .select(
      "*, reporter:profiles!reports_reporter_id_fkey(*), reported_user:profiles!reports_reported_user_id_fkey(*)"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="min-h-screen bg-[#b4c8d8]">
      <Navbar username={profile?.username} userId={user.id} />
      <div className="mx-auto max-w-4xl px-3 py-4 sm:px-4 sm:py-6">
        <div className="mb-3 overflow-hidden rounded border border-[#6699cc] bg-gradient-to-r from-[#8b0000] to-[#cc3333] p-3 text-white shadow-md sm:mb-4 sm:p-4">
          <h1 className="text-lg font-bold sm:text-xl">Admin Panel</h1>
          <p className="text-[10px] text-white/70 sm:text-xs">
            Review and manage reports
          </p>
        </div>
        <AdminReportList reports={reports || []} />
      </div>
    </div>
  );
}
