import { requireAuth, getProfile } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import SettingsForm from "@/components/SettingsForm";
import { redirect } from "next/navigation";
import type { Profile } from "@/lib/types";

export default async function SettingsPage() {
  const { user, supabase } = await requireAuth();

  const profile = await getProfile(supabase, user);
  if (!profile) redirect("/signup");

  const typedProfile = profile as Profile;

  return (
    <div className="min-h-screen bg-[#b4c8d8]">
      <Navbar username={typedProfile.username} userId={user.id} />
      <div className="mx-auto max-w-2xl px-3 py-4 sm:px-4 sm:py-6">
        <div className="mb-3 overflow-hidden rounded border border-[#6699cc] bg-gradient-to-r from-[#2a5f8f] to-[#4a86b8] p-3 text-white shadow-md sm:mb-4 sm:p-4">
          <h1 className="text-lg font-bold drop-shadow-[1px_1px_0px_rgba(0,0,0,0.3)] sm:text-xl">
            Edit Your Profile
          </h1>
          <p className="text-[10px] text-white/70 sm:text-xs">
            Make your space yours!
          </p>
        </div>
        <SettingsForm profile={typedProfile} />
      </div>
    </div>
  );
}
