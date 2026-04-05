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
