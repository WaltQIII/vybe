import type { Profile } from "@/lib/types";
import Image from "next/image";

interface ProfileCardProps {
  profile: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const avatarUrl = profile.avatar_url || "/default-avatar.svg";

  return (
    <div className="ms-panel overflow-hidden rounded">
      <div className="ms-section-header">
        {profile.display_name || profile.username}&apos;s Profile
      </div>
      <div className="p-3 sm:p-4">
        <div className="mb-3 text-center sm:mb-4">
          <Image
            src={avatarUrl}
            alt={profile.display_name || profile.username}
            width={150}
            height={150}
            className="mx-auto h-[120px] w-[120px] rounded border-2 border-[#6699cc] object-cover shadow-md sm:h-[150px] sm:w-[150px]"
          />
        </div>

        <h1 className="text-center text-lg font-bold text-[#003366] sm:text-xl">
          {profile.display_name || profile.username}
        </h1>
        <p className="text-center text-xs text-[#6688aa]">@{profile.username}</p>

        {profile.mood && (
          <div className="mx-auto mt-2 max-w-fit rounded-full bg-[#eef3f7] px-3 py-1 text-center text-xs italic text-[#336699]">
            {profile.mood}
          </div>
        )}

        {profile.bio && (
          <p className="mt-3 text-center text-xs text-[#333] sm:text-sm">{profile.bio}</p>
        )}

        <div className="mt-3 border-t border-[#ddd] pt-2 text-center text-[10px] text-[#999]">
          Online since{" "}
          {new Date(profile.created_at).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      {profile.about_me && (
        <>
          <div className="ms-section-header">About Me</div>
          <div className="whitespace-pre-wrap p-3 text-xs leading-relaxed sm:p-4 sm:text-sm">
            {profile.about_me}
          </div>
        </>
      )}
    </div>
  );
}
