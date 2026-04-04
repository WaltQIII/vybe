"use client";

import { createClient } from "@/lib/supabase";
import Image from "next/image";
import { useState } from "react";

interface AvatarUploadProps {
  userId: string;
  currentUrl: string | null;
  onUpload: (url: string) => void;
}

export default function AvatarUpload({
  userId,
  currentUrl,
  onUpload,
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File must be under 2MB");
      return;
    }

    setUploading(true);

    const ext = file.name.split(".").pop();
    const path = `${userId}/avatar.${ext}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (error) {
      alert("Upload failed: " + error.message);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(path);

    onUpload(publicUrl);
    setUploading(false);
  }

  return (
    <div className="flex items-center gap-4">
      <Image
        src={currentUrl || "/default-avatar.svg"}
        alt="Avatar"
        width={80}
        height={80}
        className="rounded border-2 border-[#003366] object-cover"
      />
      <label className="cursor-pointer rounded bg-[#003366] px-3 py-2 text-sm font-bold text-white hover:bg-[#004488]">
        {uploading ? "Uploading..." : "Change Photo"}
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  );
}
