/**
 * Verify that required public assets exist on disk.
 *
 * Usage:
 *   pnpm --filter @workspace/scripts run verify:assets
 *
 * Checks:
 * - Official logo, favicon, touch-icon, OG image
 * - One product image per approved SKU (webp or png)
 * - Hero image
 */

import { existsSync } from "node:fs";
import { resolve } from "node:path";

const PUBLIC_DIR = resolve(process.cwd(), "../artifacts/skyrich-tr/public");

const REQUIRED_FILES = [
  { path: "/images/logo.svg", desc: "Official logo SVG" },
  { path: "/images/logo.png", desc: "Official logo PNG (fallback)" },
  { path: "/favicon.svg", desc: "Favicon SVG" },
  { path: "/apple-touch-icon.png", desc: "Apple touch icon" },
  { path: "/images/og-default.png", desc: "OG default image" },
  { path: "/images/hero-1.png", desc: "Hero background image" },
];

const OPTIONAL_FILES = [
  { path: "/images/certifications.pdf", desc: "Certifications PDF" },
  { path: "/images/manual.pdf", desc: "User manual PDF" },
];

const APPROVED_SKUS = [
  "HJTX9-FP",
  "HJTX14H-FP",
  "HJTZ10S-FP",
  "HJTZ14S-FPZ",
  "HJTZ14S-FP",
  "HJ51913-FP",
  "HJTX20HQ-FP",
  "HJTZ7S-FPZ",
  "HJTX20CH-FP",
  "HJ13L-FPZ",
  "HJT9B-FP",
  "HJT7B-FPZ",
];

function check(path: string, desc: string, required: boolean): boolean {
  const full = resolve(PUBLIC_DIR, path.replace(/^\//, ""));
  const ok = existsSync(full);
  const label = required ? "REQUIRED" : "OPTIONAL";
  if (ok) {
    console.log(`  [OK] ${label}  ${path} — ${desc}`);
  } else {
    console.log(`  [${required ? "MISS" : "SKIP"}] ${label} ${path} — ${desc}`);
  }
  return ok;
}

function main() {
  console.log(`Checking assets in: ${PUBLIC_DIR}\n`);

  let requiredMissing = 0;
  let optionalMissing = 0;

  for (const f of REQUIRED_FILES) {
    if (!check(f.path, f.desc, true)) requiredMissing++;
  }

  for (const sku of APPROVED_SKUS) {
    const webp = `/images/products/${sku}.webp`;
    const png = `/images/products/${sku}.png`;
    const hasWebp = existsSync(resolve(PUBLIC_DIR, webp.replace(/^\//, "")));
    const hasPng = existsSync(resolve(PUBLIC_DIR, png.replace(/^\//, "")));
    if (hasWebp || hasPng) {
      console.log(`  [OK] PRODUCT ${hasWebp ? webp : png} — ${sku}`);
    } else {
      console.log(`  [MISS] PRODUCT ${webp} (or .png) — ${sku}`);
      requiredMissing++;
    }
  }

  for (const f of OPTIONAL_FILES) {
    if (!check(f.path, f.desc, false)) optionalMissing++;
  }

  console.log("\n---");
  if (requiredMissing === 0) {
    console.log("All required assets present.");
  } else {
    console.log(`Missing ${requiredMissing} required asset(s).`);
    process.exitCode = 1;
  }
  if (optionalMissing > 0) {
    console.log(`Missing ${optionalMissing} optional asset(s).`);
  }
}

main();
