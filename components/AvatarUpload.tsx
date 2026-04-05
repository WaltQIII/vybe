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
        width={72}
        height={72}
        className="rounded border-2 border-[#6699cc] object-cover shadow"
      />
      <div>
        <label className="ms-btn-primary inline-block cursor-pointer rounded">
          {uploading ? "Uploading..." : "Change Photo"}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
        <p className="mt-1 text-[10px] text-[#999]">Max 2MB. JPG, PNG, or GIF.</p>
      </div>
    </div>
  );
}
