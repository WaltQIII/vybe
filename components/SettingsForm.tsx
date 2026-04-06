"use client";

import { createClient } from "@/lib/supabase";
import type { Profile } from "@/lib/types";
import AvatarUpload from "./AvatarUpload";
import DeleteAccountButton from "./DeleteAccountButton";
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
        <div className="p-3 sm:p-4">
          <AvatarUpload
            userId={profile.id}
            currentUrl={avatarUrl}
            onUpload={setAvatarUrl}
          />
        </div>
      </div>

      <div className="ms-panel mt-3 overflow-hidden rounded sm:mt-4">
        <div className="ms-section-header">Basic Info</div>
        <div className="space-y-3 p-3 sm:space-y-4 sm:p-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-[#003366]">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="ms-input"
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
              className="ms-input"
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
              className="ms-input"
            />
          </div>
        </div>
      </div>

      <div className="ms-panel mt-3 overflow-hidden rounded sm:mt-4">
        <div className="ms-section-header">About Me</div>
        <div className="p-3 sm:p-4">
          <textarea
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            rows={6}
            placeholder="Tell the world about yourself..."
            className="ms-input sm:[rows:8]"
          />
        </div>
      </div>

      <div className="ms-panel mt-3 overflow-hidden rounded sm:mt-4">
        <div className="ms-section-header">Customize Profile</div>
        <div className="p-3 sm:p-4">
          <label className="mb-1 block text-xs font-bold text-[#003366]">
            Background Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border border-[#6699cc] sm:h-8 sm:w-12"
            />
            <span className="text-xs text-[#666]">{bgColor}</span>
            <div
              className="h-10 flex-1 rounded border border-[#6699cc] sm:h-8"
              style={{ backgroundColor: bgColor }}
            />
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`mt-3 rounded border p-3 text-xs sm:mt-4 sm:text-sm ${
            message.startsWith("Error")
              ? "border-red-300 bg-red-50 text-red-700"
              : "border-green-300 bg-green-50 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="mt-3 flex flex-col gap-2 sm:mt-4 sm:flex-row">
        <button
          type="submit"
          disabled={saving}
          className="ms-btn-primary w-full rounded disabled:opacity-50 sm:w-auto"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/profile/${profile.username}`)}
          className="ms-btn-accent w-full rounded sm:w-auto"
        >
          View My Profile
        </button>
      </div>

      {/* Danger zone */}
      <div className="ms-panel mt-6 overflow-hidden rounded border-red-300 sm:mt-8">
        <div className="bg-gradient-to-r from-[#8b0000] to-[#cc3333] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white sm:text-xs">
          Danger Zone
        </div>
        <div className="p-3 sm:p-4">
          <p className="mb-3 text-xs text-[#666]">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>
          <DeleteAccountButton />
        </div>
      </div>
    </form>
  );
}
