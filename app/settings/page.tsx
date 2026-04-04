import { createServerSupabaseClient } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import SettingsForm from "@/components/SettingsForm";
import { redirect } from "next/navigation";
import type { Profile } from "@/lib/types";

export default async function SettingsPage() {
  const user = await requireAuth();
  const supabase = await createServerSupabaseClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // If no profile yet (shouldn't normally happen), redirect to signup
  if (!profile) redirect("/signup");

  const typedProfile = profile as Profile;

  return (
    <div className="min-h-screen bg-[#c0c0d0]">
      <Navbar username={typedProfile.username} />
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-[#003366]">
          Edit Profile
        </h1>
        <SettingsForm profile={typedProfile} />
      </div>
    </div>
  );
}
