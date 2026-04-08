"use client";

import { useState } from "react";
import { PRESET_BACKGROUNDS, PRESET_CATEGORIES } from "@/lib/preset-backgrounds";
import Image from "next/image";

interface BackgroundPickerProps {
  bgType: string;
  bgColor: string;
  bgImageUrl: string;
  onBgTypeChange: (type: string) => void;
  onBgColorChange: (color: string) => void;
  onBgImageUrlChange: (url: string) => void;
}

export default function BackgroundPicker({
  bgType,
  bgColor,
  bgImageUrl,
  onBgTypeChange,
  onBgColorChange,
  onBgImageUrlChange,
}: BackgroundPickerProps) {
  const [activeTab, setActiveTab] = useState<"color" | "preset" | "custom_url">(
    bgType === "preset" ? "preset" : bgType === "custom_url" ? "custom_url" : "color"
  );
  const [activeCategory, setActiveCategory] = useState<string>(PRESET_CATEGORIES[0]);

  function selectTab(tab: "color" | "preset" | "custom_url") {
    setActiveTab(tab);
    onBgTypeChange(tab);
  }

  function selectPreset(url: string) {
    onBgImageUrlChange(url);
    onBgTypeChange("preset");
    setActiveTab("preset");
  }

  const filteredPresets = PRESET_BACKGROUNDS.filter(
    (p) => p.category === activeCategory
  );

  return (
    <div className="ms-panel mt-3 overflow-hidden rounded sm:mt-4">
      <div className="ms-section-header">Background</div>
      <div className="p-3 sm:p-4">
        {/* Tabs */}
        <div className="mb-3 flex gap-1">
          {(
            [
              ["color", "Solid Color"],
              ["preset", "Presets"],
              ["custom_url", "Custom URL"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => selectTab(key)}
              className={`rounded px-3 py-1.5 text-xs font-bold ${
                activeTab === key
                  ? "bg-[#003366] text-white"
                  : "border border-[#6699cc] bg-white text-[#003366]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Solid Color */}
        {activeTab === "color" && (
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => onBgColorChange(e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border border-[#6699cc] sm:h-8 sm:w-12"
            />
            <span className="text-xs text-[#666]">{bgColor}</span>
            <div
              className="h-10 flex-1 rounded border border-[#6699cc] sm:h-8"
              style={{ backgroundColor: bgColor }}
            />
          </div>
        )}

        {/* Preset Backgrounds */}
        {activeTab === "preset" && (
          <div>
            {/* Category tabs */}
            <div className="mb-3 flex flex-wrap gap-1">
              {PRESET_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded px-2 py-1 text-[10px] font-bold uppercase ${
                    activeCategory === cat
                      ? "bg-[#336699] text-white"
                      : "bg-[#eef3f7] text-[#336699]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Preset grid */}
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {filteredPresets.map((preset) => {
                const isSelected =
                  bgType === "preset" && bgImageUrl === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => selectPreset(preset.url)}
                    className={`group relative overflow-hidden rounded border-2 transition-all ${
                      isSelected
                        ? "border-[#ff6600] ring-2 ring-[#ff6600]/30"
                        : "border-transparent hover:border-[#6699cc]"
                    }`}
                  >
                    <Image
                      src={preset.thumb}
                      alt={preset.name}
                      width={150}
                      height={100}
                      className="aspect-[3/2] w-full object-cover"
                      unoptimized
                    />
                    <span className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5 text-[9px] text-white">
                      {preset.name}
                    </span>
                    {isSelected && (
                      <span className="absolute right-1 top-1 rounded-full bg-[#ff6600] px-1.5 py-0.5 text-[8px] font-bold text-white">
                        &#10003;
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Custom URL */}
        {activeTab === "custom_url" && (
          <div>
            <input
              type="url"
              value={bgImageUrl}
              onChange={(e) => onBgImageUrlChange(e.target.value)}
              placeholder="https://example.com/my-background.jpg"
              className="ms-input"
            />
            <p className="mt-1 text-[10px] text-[#999]">
              Paste any image URL. Works best with landscape images at least
              1920px wide.
            </p>
            {bgImageUrl && activeTab === "custom_url" && (
              <div className="mt-2 overflow-hidden rounded border border-[#6699cc]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bgImageUrl}
                  alt="Preview"
                  className="aspect-[16/9] w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Preview */}
        {(activeTab === "preset" || activeTab === "custom_url") &&
          bgImageUrl && (
            <p className="mt-2 text-[10px] text-green-600">
              &#10003; Background selected. Save your profile to apply it.
            </p>
          )}
      </div>
    </div>
  );
}
