import { requireAuth, getProfile } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import NotificationsList from "@/components/NotificationsList";
import type { Profile } from "@/lib/types";

export default async function NotificationsPage() {
  const { user, supabase } = await requireAuth();
  const profile = (await getProfile(supabase, user)) as Profile | null;

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*, from_user:profiles!notifications_from_user_id_fkey(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  // Mark all as read
  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false);

  return (
    <div className="min-h-screen bg-[#b4c8d8]">
      <Navbar username={profile?.username} userId={user.id} />
      <div className="mx-auto max-w-2xl px-3 py-4 sm:px-4 sm:py-6">
        <div className="ms-panel overflow-hidden rounded">
          <div className="ms-section-header">Notifications</div>
          <NotificationsList notifications={notifications || []} />
        </div>
      </div>
    </div>
  );
}
