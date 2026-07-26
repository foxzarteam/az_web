/**
 * One-shot compressor for oversized public assets.
 * Run: node scripts/optimize-images.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve("public");

/** @type {{ file: string, maxWidth: number, quality: number, format?: 'webp'|'jpeg'|'png' }[]} */
const JOBS = [
  { file: "images/hero/hero.png", maxWidth: 1400, quality: 82, format: "webp" },
  { file: "images/hero/about.png", maxWidth: 900, quality: 82, format: "webp" },
  { file: "images/hero/about_foot.png", maxWidth: 480, quality: 80, format: "webp" },
  { file: "images/hero/faq.png", maxWidth: 640, quality: 80, format: "webp" },
  { file: "images/service/personal.png", maxWidth: 1200, quality: 82, format: "webp" },
  { file: "images/service/insurance.png", maxWidth: 1200, quality: 82, format: "webp" },
  { file: "images/service/home.png", maxWidth: 1200, quality: 82, format: "webp" },
  { file: "images/service/business.png", maxWidth: 1200, quality: 82, format: "webp" },
  { file: "images/service/credit.png", maxWidth: 1200, quality: 82, format: "webp" },
  { file: "images/service/about.jpg", maxWidth: 1200, quality: 80, format: "webp" },
  { file: "images/loan-helper/avatar.png", maxWidth: 256, quality: 80, format: "webp" },
  { file: "images/logo/logo.png", maxWidth: 560, quality: 90, format: "webp" },
  { file: "images/contact-page/contact.jpg", maxWidth: 1200, quality: 78, format: "webp" },
  { file: "images/features/features_iimage.jpg", maxWidth: 1000, quality: 78, format: "webp" },
  { file: "images/mobile/m1.png", maxWidth: 320, quality: 80, format: "webp" },
  { file: "images/mobile/m2.png", maxWidth: 320, quality: 80, format: "webp" },
  { file: "images/mobile/m3.png", maxWidth: 320, quality: 80, format: "webp" },
  { file: "images/plays.png", maxWidth: 96, quality: 85, format: "webp" },
  { file: "favicon.png", maxWidth: 64, quality: 90, format: "png" },
  { file: "images/logo/app_icon.png", maxWidth: 192, quality: 85, format: "png" },
  { file: "city/imgi_52_hyderabad.png", maxWidth: 640, quality: 80, format: "webp" },
];

/** Open Graph default (1200×630). Prefer compressed hero.webp. */
async function buildOgDefault() {
  const candidates = ["images/hero/hero.webp", "images/hero/hero.png"];
  let src = null;
  for (const rel of candidates) {
    const full = path.join(ROOT, rel);
    try {
      await fs.access(full);
      src = full;
      break;
    } catch {
      /* try next */
    }
  }
  if (!src) {
    console.warn("skip OG: hero source missing");
    return;
  }
  const dest = path.join(ROOT, "images/og-default.jpg");
  await sharp(src)
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(dest);
  const st = await fs.stat(dest);
  console.log(`ok  images/og-default.jpg  ${(st.size / 1024).toFixed(1)} KB`);
}

async function optimizeOne(job) {
  const input = path.join(ROOT, job.file);
  try {
    await fs.access(input);
  } catch {
    console.warn(`skip missing ${job.file}`);
    return null;
  }

  const ext = job.format === "jpeg" ? ".jpg" : `.${job.format ?? "webp"}`;
  const outRel = job.file.replace(/\.(png|jpe?g|webp)$/i, ext);
  const output = path.join(ROOT, outRel);
  const before = (await fs.stat(input)).size;

  let pipeline = sharp(input).rotate().resize({
    width: job.maxWidth,
    withoutEnlargement: true,
  });

  if (job.format === "png") {
    pipeline = pipeline.png({ quality: job.quality, compressionLevel: 9 });
  } else if (job.format === "jpeg") {
    pipeline = pipeline.jpeg({ quality: job.quality, mozjpeg: true });
  } else {
    pipeline = pipeline.webp({ quality: job.quality, effort: 6 });
  }

  // Avoid reading+writing same path
  const tmp = `${output}.tmp`;
  await pipeline.toFile(tmp);
  await fs.rename(tmp, output);
  const after = (await fs.stat(output)).size;
  console.log(
    `ok  ${outRel}  ${(before / 1024).toFixed(0)} → ${(after / 1024).toFixed(0)} KB`,
  );
  return outRel;
}

async function main() {
  for (const job of JOBS) {
    await optimizeOne(job);
  }
  await buildOgDefault();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
