const sharp = require("sharp");
const path = require("path");

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Vybe icon SVG - blue rounded square with "Vb" text
function makeSvg(size) {
  const fontSize = Math.round(size * 0.55);
  const yPos = Math.round(size * 0.68);
  const bSize = Math.round(size * 0.3);
  const bX = Math.round(size * 0.62);
  const bY = Math.round(size * 0.68);
  const rx = Math.round(size * 0.15);

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${rx}" fill="#2a5f8f"/>
  <text x="${Math.round(size * 0.38)}" y="${yPos}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="bold" font-size="${fontSize}" fill="white">V</text>
  <text x="${bX}" y="${bY}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="bold" font-size="${bSize}" fill="#ffcc00">b</text>
</svg>`);
}

async function generate() {
  for (const size of sizes) {
    const svg = makeSvg(size);
    await sharp(svg)
      .resize(size, size)
      .png()
      .toFile(path.join(__dirname, "..", "public", "icons", `icon-${size}x${size}.png`));
    console.log(`Generated icon-${size}x${size}.png`);
  }
}

generate().catch(console.error);
