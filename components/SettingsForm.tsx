"use client";

import { createClient } from "@/lib/supabase";
import type { Profile } from "@/lib/types";
import AvatarUpload from "./AvatarUpload";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SettingsFormProps {
  profile: Profile;
}

export default function SettingsForm({ profile }: SettingsFormProps) {
  const [displayName, setDisplayName] = useState(profile.display_name || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [aboutMe, setAboutMe] = useState(profile.about_me || "");
  const [mood, setMood] = useState(profile.mood || "");
  const [bgColor, setBgColor] = useState(profile.bg_color || "#ffffff");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const supabase = createClient();
  const router = useRouter();

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        bio: bio.slice(0, 300),
        about_me: aboutMe,
        mood,
        bg_color: bgColor,
        avatar_url: avatarUrl || null,
      })
      .eq("id", profile.id);

    if (error) {
      setMessage("Error saving: " + error.message);
    } else {
      setMessage("Profile updated!");
      router.refresh();
    }

    setSaving(false);
  }

  return (
    <form onSubmit={handleSave}>
      <div className="ms-panel overflow-hidden rounded">
        <div className="ms-section-header">Profile Photo</div>
        <div className="p-4">
          <AvatarUpload
            userId={profile.id}
            currentUrl={avatarUrl}
            onUpload={setAvatarUrl}
          />
        </div>
      </div>

      <div className="ms-panel mt-4 overflow-hidden rounded">
        <div className="ms-section-header">Basic Info</div>
        <div className="space-y-4 p-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-[#003366]">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded border border-[#6699cc] bg-[#f5f8fa] px-3 py-2 text-xs focus:border-[#003366] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-[#003366]">
              Bio ({bio.length}/300)
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={300}
              rows={2}
              className="w-full rounded border border-[#6699cc] bg-[#f5f8fa] px-3 py-2 text-xs focus:border-[#003366] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-[#003366]">
              Mood Status
            </label>
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder='e.g. "feeling creative ✨"'
              className="w-full rounded border border-[#6699cc] bg-[#f5f8fa] px-3 py-2 text-xs focus:border-[#003366] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="ms-panel mt-4 overflow-hidden rounded">
        <div className="ms-section-header">About Me</div>
        <div className="p-4">
          <textarea
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            rows={8}
            placeholder="Tell the world about yourself..."
            className="w-full rounded border border-[#6699cc] bg-[#f5f8fa] px-3 py-2 text-xs focus:border-[#003366] focus:outline-none"
          />
        </div>
      </div>

      <div className="ms-panel mt-4 overflow-hidden rounded">
        <div className="ms-section-header">Customize Profile</div>
        <div className="p-4">
          <label className="mb-1 block text-xs font-bold text-[#003366]">
            Background Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-8 w-12 cursor-pointer rounded border border-[#6699cc]"
            />
            <span className="text-xs text-[#666]">{bgColor}</span>
            <div
              className="h-8 flex-1 rounded border border-[#6699cc]"
              style={{ backgroundColor: bgColor }}
            />
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`mt-4 rounded border p-3 text-xs ${
            message.startsWith("Error")
              ? "border-red-300 bg-red-50 text-red-700"
              : "border-green-300 bg-green-50 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="ms-btn-primary rounded disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/profile/${profile.username}`)}
          className="ms-btn-accent rounded"
        >
          View My Profile
        </button>
      </div>
    </form>
  );
}
