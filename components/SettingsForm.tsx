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
    <form
      onSubmit={handleSave}
      className="space-y-6 rounded-lg border-2 border-[#003366] bg-white p-6 shadow-md"
    >
      <AvatarUpload
        userId={profile.id}
        currentUrl={avatarUrl}
        onUpload={setAvatarUrl}
      />

      <div>
        <label className="mb-1 block text-sm font-bold">Display Name</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2 focus:border-[#003366] focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold">
          Bio ({bio.length}/300)
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={300}
          rows={2}
          className="w-full rounded border border-gray-300 px-3 py-2 focus:border-[#003366] focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold">Mood Status</label>
        <input
          type="text"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder='e.g. "feeling creative ✨"'
          className="w-full rounded border border-gray-300 px-3 py-2 focus:border-[#003366] focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold">About Me</label>
        <textarea
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
          rows={6}
          className="w-full rounded border border-gray-300 px-3 py-2 focus:border-[#003366] focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold">
          Background Color
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="h-10 w-14 cursor-pointer rounded border"
          />
          <span className="text-sm text-gray-500">{bgColor}</span>
        </div>
      </div>

      {message && (
        <div
          className={`rounded p-3 text-sm ${
            message.startsWith("Error")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-[#003366] px-6 py-2 font-bold text-white hover:bg-[#004488] disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/profile/${profile.username}`)}
          className="rounded border border-gray-300 px-6 py-2 text-sm hover:bg-gray-50"
        >
          View Profile
        </button>
      </div>
    </form>
  );
}
