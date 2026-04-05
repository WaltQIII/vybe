import { requireAuth, getProfile } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import SettingsForm from "@/components/SettingsForm";
import { redirect } from "next/navigation";
import type { Profile } from "@/lib/types";

export default async function SettingsPage() {
  await requireAuth();

  const profile = await getProfile();
  if (!profile) redirect("/signup");

  const typedProfile = profile as Profile;

  return (
    <div className="min-h-screen bg-[#b4c8d8]">
      <Navbar username={typedProfile.username} />
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-4 overflow-hidden rounded border border-[#6699cc] bg-gradient-to-r from-[#2a5f8f] to-[#4a86b8] p-4 text-white shadow-md">
          <h1 className="text-xl font-bold drop-shadow-[1px_1px_0px_rgba(0,0,0,0.3)]">
            Edit Your Profile
          </h1>
          <p className="text-xs text-white/70">
            Make your space yours!
          </p>
        </div>
        <SettingsForm profile={typedProfile} />
      </div>
    </div>
  );
}
