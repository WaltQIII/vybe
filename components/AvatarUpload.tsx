"use client";

import { createClient } from "@/lib/supabase";
import Image from "next/image";
import { useState } from "react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_DIMENSION = 800;
const JPEG_QUALITY = 0.8;

function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      let { width, height } = img;

      if (width <= MAX_DIMENSION && height <= MAX_DIMENSION && file.size < 500 * 1024) {
        // Already small enough, skip compression
        resolve(file);
        return;
      }

      // Scale down to fit within MAX_DIMENSION
      if (width > height) {
        if (width > MAX_DIMENSION) {
          height = Math.round(height * (MAX_DIMENSION / width));
          width = MAX_DIMENSION;
        }
      } else {
        if (height > MAX_DIMENSION) {
          width = Math.round(width * (MAX_DIMENSION / height));
          height = MAX_DIMENSION;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Compression failed"));
        },
        "image/jpeg",
        JPEG_QUALITY
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

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

    if (file.size > MAX_FILE_SIZE) {
      alert("File must be under 10MB");
      return;
    }

    setUploading(true);

    try {
      const compressed = await compressImage(file);
      const path = `${userId}/avatar.jpg`;

      const { error } = await supabase.storage
        .from("avatars")
        .upload(path, compressed, {
          upsert: true,
          contentType: "image/jpeg",
        });

      if (error) {
        alert("Upload failed: " + error.message);
        setUploading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(path);

      // Append cache-buster so the browser loads the new image
      onUpload(publicUrl + "?v=" + Date.now());
    } catch (err) {
      alert("Image processing failed: " + (err as Error).message);
    }

    setUploading(false);
  }

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-4">
      <Image
        src={currentUrl || "/default-avatar.svg"}
        alt="Avatar"
        width={72}
        height={72}
        className="h-20 w-20 rounded border-2 border-[#6699cc] object-cover shadow sm:h-[72px] sm:w-[72px]"
      />
      <div className="text-center sm:text-left">
        <label className="ms-btn-primary inline-block cursor-pointer rounded">
          {uploading ? "Compressing & uploading..." : "Change Photo"}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
        <p className="mt-1 text-[10px] text-[#999]">Max 10MB. Auto-compressed to 800px.</p>
      </div>
    </div>
  );
}
