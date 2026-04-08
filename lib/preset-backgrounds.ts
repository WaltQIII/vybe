export interface PresetBackground {
  id: string;
  name: string;
  category: string;
  url: string;
  thumb: string;
}

// Unsplash CDN URLs with size parameters for thumbnails and full images
function unsplash(id: string, w = 1920): string {
  return `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;
}

function thumb(id: string): string {
  return unsplash(id, 300);
}

export const PRESET_CATEGORIES = ["Nature", "Abstract", "Aesthetic", "Fun"] as const;

export const PRESET_BACKGROUNDS: PresetBackground[] = [
  // Nature
  { id: "nature-ocean", name: "Ocean Waves", category: "Nature", url: unsplash("photo-1507525428034-b723cf961d3e"), thumb: thumb("photo-1507525428034-b723cf961d3e") },
  { id: "nature-sunset", name: "Sunset", category: "Nature", url: unsplash("photo-1495616811223-4d98c6e9c869"), thumb: thumb("photo-1495616811223-4d98c6e9c869") },
  { id: "nature-mountains", name: "Mountains", category: "Nature", url: unsplash("photo-1464822759023-fed622ff2c3b"), thumb: thumb("photo-1464822759023-fed622ff2c3b") },
  { id: "nature-beach", name: "Tropical Beach", category: "Nature", url: unsplash("photo-1476673160081-cf065607f449"), thumb: thumb("photo-1476673160081-cf065607f449") },
  { id: "nature-forest", name: "Forest", category: "Nature", url: unsplash("photo-1448375240586-882707db888b"), thumb: thumb("photo-1448375240586-882707db888b") },

  // Abstract
  { id: "abstract-geometric", name: "Geometric", category: "Abstract", url: unsplash("photo-1557672172-298e090bd0f1"), thumb: thumb("photo-1557672172-298e090bd0f1") },
  { id: "abstract-gradient", name: "Gradient", category: "Abstract", url: unsplash("photo-1579546929518-9e396f3cc135"), thumb: thumb("photo-1579546929518-9e396f3cc135") },
  { id: "abstract-neon", name: "Neon Lights", category: "Abstract", url: unsplash("photo-1550684376-efcbd6e3f031"), thumb: thumb("photo-1550684376-efcbd6e3f031") },
  { id: "abstract-galaxy", name: "Galaxy", category: "Abstract", url: unsplash("photo-1462331940025-496dfbfc7564"), thumb: thumb("photo-1462331940025-496dfbfc7564") },
  { id: "abstract-waves", name: "Color Waves", category: "Abstract", url: unsplash("photo-1604076913837-52ab5f43bc03"), thumb: thumb("photo-1604076913837-52ab5f43bc03") },

  // Aesthetic
  { id: "aesthetic-lofi", name: "Lo-fi City", category: "Aesthetic", url: unsplash("photo-1519501025264-65ba15a82390"), thumb: thumb("photo-1519501025264-65ba15a82390") },
  { id: "aesthetic-rain", name: "Rainy Window", category: "Aesthetic", url: unsplash("photo-1428592953211-077101b2021b"), thumb: thumb("photo-1428592953211-077101b2021b") },
  { id: "aesthetic-paper", name: "Vintage Paper", category: "Aesthetic", url: unsplash("photo-1524721696987-b9527df9e512"), thumb: thumb("photo-1524721696987-b9527df9e512") },
  { id: "aesthetic-marble", name: "Dark Marble", category: "Aesthetic", url: unsplash("photo-1551871812-10ecc21ffa2f"), thumb: thumb("photo-1551871812-10ecc21ffa2f") },
  { id: "aesthetic-bokeh", name: "Bokeh Lights", category: "Aesthetic", url: unsplash("photo-1530103862676-de8c9debad1d"), thumb: thumb("photo-1530103862676-de8c9debad1d") },

  // Fun
  { id: "fun-bubbles", name: "Bubbles", category: "Fun", url: unsplash("photo-1558618666-fcd25c85f82e"), thumb: thumb("photo-1558618666-fcd25c85f82e") },
  { id: "fun-confetti", name: "Confetti", category: "Fun", url: unsplash("photo-1513151233558-d860c5398176"), thumb: thumb("photo-1513151233558-d860c5398176") },
  { id: "fun-stars", name: "Stars", category: "Fun", url: unsplash("photo-1419242902214-272b3f66ee7a"), thumb: thumb("photo-1419242902214-272b3f66ee7a") },
  { id: "fun-clouds", name: "Clouds", category: "Fun", url: unsplash("photo-1534088568595-a066f410bcda"), thumb: thumb("photo-1534088568595-a066f410bcda") },
  { id: "fun-fireworks", name: "Fireworks", category: "Fun", url: unsplash("photo-1498931299476-f16f5a0b9f21"), thumb: thumb("photo-1498931299476-f16f5a0b9f21") },
];
