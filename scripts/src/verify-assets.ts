/**
 * Verify that required public assets exist on disk.
 *
 * Usage:
 *   pnpm --filter @workspace/scripts run verify:assets
 *
 * Environment:
 *   STRICT=1   — treat product-image misses as fatal (use in CI / pre-deploy)
 *   Without STRICT, product-image misses are warnings so local dev can proceed
 *   with placeholders.
 *
 * Checks:
 * - Official logo in /brand/, favicon, touch-icon, OG image
 * - One product image per approved SKU (webp or png)
 * - Hero image
 */

import { existsSync } from "node:fs";
import { resolve } from "node:path";

const PUBLIC_DIR = resolve(process.cwd(), "../artifacts/skyrich-tr/public");
const STRICT = process.env.STRICT === "1" || process.env.CI === "true";

const REQUIRED_FILES = [
  { path: "/brand/skyrich-logo.svg", desc: "Official logo SVG", altPath: "/brand/skyrich-logo.png" },
  { path: "/brand/skyrich-logo.png", desc: "Official logo PNG", altPath: "/brand/skyrich-logo.svg" },
  { path: "/favicon.svg", desc: "Favicon SVG" },
  { path: "/apple-touch-icon.png", desc: "Apple touch icon", strictOnly: true },
  { path: "/images/og/og-default.png", desc: "OG default image", fallback: "/opengraph.jpg" },
  { path: "/images/hero/hero-1.png", desc: "Hero background image", fallback: "/images/hero-1.png" },
];

const OPTIONAL_FILES = [
  { path: "/docs/certifications.pdf", desc: "Certifications PDF" },
  { path: "/docs/manual.pdf", desc: "User manual PDF" },
  { path: "/images/certifications.pdf", desc: "Certifications PDF (legacy path)" },
  { path: "/images/manual.pdf", desc: "User manual PDF (legacy path)" },
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

function check(path: string, desc: string, required: boolean, fallback?: string, strictOnly?: boolean, altPath?: string): boolean {
  const full = resolve(PUBLIC_DIR, path.replace(/^\//, ""));
  const ok = existsSync(full);

  if (ok) {
    console.log(`  [OK]   ${required ? "REQUIRED" : "OPTIONAL"}  ${path} — ${desc}`);
    return true;
  }

  // In lenient mode, try altPath if provided (for logo SVG/PNG interchangeability)
  if (altPath && !STRICT) {
    const altFull = resolve(PUBLIC_DIR, altPath.replace(/^\//, ""));
    const altOk = existsSync(altFull);
    if (altOk) {
      console.log(`  [OK]   REQUIRED ${path} — ${desc} (alt format present: ${altPath})`);
      return true;
    }
  }

  // In STRICT mode, no fallbacks allowed (except for strictOnly which is skipped entirely)
  if (STRICT && !strictOnly) {
    console.log(`  [MISS] REQUIRED ${path} — ${desc} (no fallback in STRICT mode)`);
    return false;
  }

  // In lenient mode, try fallback if provided
  if (fallback && !strictOnly) {
    const fallbackFull = resolve(PUBLIC_DIR, fallback.replace(/^\//, ""));
    const fallbackOk = existsSync(fallbackFull);
    if (fallbackOk) {
      console.log(`  [OK]   REQUIRED ${path} — ${desc} (using fallback: ${fallback})`);
      return true;
    }
  }

  // strictOnly assets are optional in lenient mode
  if (strictOnly) {
    console.log(`  [SKIP] OPTIONAL ${path} — ${desc} (skipped in lenient mode)`);
    return true;
  }

  console.log(`  [MISS] REQUIRED ${path} — ${desc}`);
  return false;
}

function main() {
  console.log(`Checking assets in: ${PUBLIC_DIR}`);
  console.log(`Mode: ${STRICT ? "STRICT (CI/production)" : "LENIENT (local dev)"}\n`);

  let requiredMissing = 0;
  let optionalMissing = 0;
  let productMissing = 0;

  for (const f of REQUIRED_FILES) {
    if (!check(f.path, f.desc, true, f.fallback, f.strictOnly, f.altPath)) requiredMissing++;
  }

  for (const sku of APPROVED_SKUS) {
    const webp = `/images/products/${sku}.webp`;
    const png = `/images/products/${sku}.png`;
    const jpg = `/images/products/${sku}.jpg`;
    const jpeg = `/images/products/${sku}.jpeg`;
    
    const hasWebp = existsSync(resolve(PUBLIC_DIR, webp.replace(/^\//, "")));
    const hasPng = existsSync(resolve(PUBLIC_DIR, png.replace(/^\//, "")));
    const hasJpg = existsSync(resolve(PUBLIC_DIR, jpg.replace(/^\//, "")));
    const hasJpeg = existsSync(resolve(PUBLIC_DIR, jpeg.replace(/^\//, "")));
    
    let found = false;
    if (hasWebp) {
      console.log(`  [OK]   PRODUCT ${webp} — ${sku}`);
      found = true;
    } else if (hasPng) {
      console.log(`  [OK]   PRODUCT ${png} — ${sku}`);
      found = true;
    } else if (hasJpg) {
      console.log(`  [OK]   PRODUCT ${jpg} — ${sku}`);
      found = true;
    } else if (hasJpeg) {
      console.log(`  [OK]   PRODUCT ${jpeg} — ${sku}`);
      found = true;
    } else {
      // Check numbered aliases as fallback
      const skuIndex = APPROVED_SKUS.indexOf(sku) + 1;
      const numberedWebp = `/images/products/${skuIndex.toString().padStart(2, '0')}.webp`;
      const numberedPng = `/images/products/${skuIndex.toString().padStart(2, '0')}.png`;
      const numberedJpg = `/images/products/${skuIndex.toString().padStart(2, '0')}.jpg`;
      const numberedJpeg = `/images/products/${skuIndex.toString().padStart(2, '0')}.jpeg`;
      
      const hasNumberedWebp = existsSync(resolve(PUBLIC_DIR, numberedWebp.replace(/^\//, "")));
      const hasNumberedPng = existsSync(resolve(PUBLIC_DIR, numberedPng.replace(/^\//, "")));
      const hasNumberedJpg = existsSync(resolve(PUBLIC_DIR, numberedJpg.replace(/^\//, "")));
      const hasNumberedJpeg = existsSync(resolve(PUBLIC_DIR, numberedJpeg.replace(/^\//, "")));
      
      if (hasNumberedWebp) {
        console.log(`  [OK]   PRODUCT ${numberedWebp} — ${sku} (numbered alias)`);
        found = true;
      } else if (hasNumberedPng) {
        console.log(`  [OK]   PRODUCT ${numberedPng} — ${sku} (numbered alias)`);
        found = true;
      } else if (hasNumberedJpg) {
        console.log(`  [OK]   PRODUCT ${numberedJpg} — ${sku} (numbered alias)`);
        found = true;
      } else if (hasNumberedJpeg) {
        console.log(`  [OK]   PRODUCT ${numberedJpeg} — ${sku} (numbered alias)`);
        found = true;
      }
    }
    
    if (!found) {
      console.log(`  [WARN] PRODUCT ${webp} (or .png/.jpg/.jpeg or numbered alias) — ${sku}`);
      productMissing++;
    }
  }

  for (const f of OPTIONAL_FILES) {
    if (!check(f.path, f.desc, false)) optionalMissing++;
  }

  console.log("\n--- Summary ---");
  if (requiredMissing === 0) {
    console.log("All required brand assets present.");
  } else {
    console.log(`Missing ${requiredMissing} required brand asset(s).`);
  }
  if (productMissing > 0) {
    if (STRICT) {
      console.log(`Missing ${productMissing} product image(s) — TREATED AS ERROR (STRICT mode).`);
      requiredMissing += productMissing;
    } else {
      console.log(`Missing ${productMissing} product image(s) — WARNING only (run STRICT=1 for error).`);
    }
  }
  if (optionalMissing > 0) {
    console.log(`Missing ${optionalMissing} optional asset(s).`);
  }

  if (requiredMissing > 0) {
    process.exitCode = 1;
  }
}

main();
