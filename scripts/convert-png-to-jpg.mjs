// One-shot conversion: heavy PNG-photo → JPG (mozjpeg).
// Hero — resize to max 1200px wide (used in <=380px containers, 2x DPR = 760).
// Team / business-goals — keep native size, quality 90.
// Run: node scripts/convert-png-to-jpg.mjs
import sharp from "sharp";
import { promises as fs } from "node:fs";

const tasks = [
  {
    label: "hero (resize to 1200w, q85)",
    src: "public/assets/figma/9656-first-screen-1440/hero-image.png",
    dst: "public/assets/figma/9656-first-screen-1440/hero-image.jpg",
    transform: (img) => img.resize({ width: 1200, withoutEnlargement: true }).jpeg({ quality: 85, mozjpeg: true }),
  },
  {
    label: "team (q90)",
    src: "public/assets/figma/9656-team-what-we-do-1440/team.png",
    dst: "public/assets/figma/9656-team-what-we-do-1440/team.jpg",
    transform: (img) => img.jpeg({ quality: 90, mozjpeg: true }),
  },
  {
    label: "business-goals rectangle75 (q90)",
    src: "public/assets/figma/10547-business-goals-360/rectangle75.png",
    dst: "public/assets/figma/9656-business-goals-1440/rectangle75.jpg",
    transform: (img) => img.jpeg({ quality: 90, mozjpeg: true }),
  },
];

for (const t of tasks) {
  const srcStat = await fs.stat(t.src);
  await t.transform(sharp(t.src)).toFile(t.dst);
  const dstStat = await fs.stat(t.dst);
  const before = (srcStat.size / 1024).toFixed(0);
  const after = (dstStat.size / 1024).toFixed(0);
  const ratio = ((1 - dstStat.size / srcStat.size) * 100).toFixed(1);
  console.log(`OK ${t.label}: ${before} KB -> ${after} KB (-${ratio}%)`);
  console.log(`   ${t.dst}`);
}
