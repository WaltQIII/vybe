import type { Profile } from "@/lib/types";
import Image from "next/image";

interface ProfileCardProps {
  profile: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const avatarUrl = profile.avatar_url || "/default-avatar.svg";

  return (
    <div className="rounded-lg border-2 border-[#003366] bg-white p-6 shadow-md">
      <div className="flex gap-6">
        <div className="flex-shrink-0">
          <Image
            src={avatarUrl}
            alt={profile.display_name || profile.username}
            width={150}
            height={150}
            className="rounded border-2 border-[#003366] object-cover"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#003366]">
            {profile.display_name || profile.username}
          </h1>
          <p className="text-sm text-gray-500">@{profile.username}</p>

          {profile.mood && (
            <p className="mt-2 text-sm italic text-gray-600">
              {profile.mood}
            </p>
          )}

          {profile.bio && <p className="mt-3 text-sm">{profile.bio}</p>}

          <p className="mt-2 text-xs text-gray-400">
            Member since{" "}
            {new Date(profile.created_at).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {profile.about_me && (
        <div className="mt-6 border-t pt-4">
          <h2 className="mb-2 text-lg font-bold text-[#003366]">About Me</h2>
          <div className="whitespace-pre-wrap text-sm">{profile.about_me}</div>
        </div>
      )}
    </div>
  );
}
