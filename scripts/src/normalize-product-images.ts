import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Approved SKU order
const APPROVED_SKUS = [
  'HJTX9-FP',
  'HJTX14H-FP',
  'HJTZ10S-FP',
  'HJTZ14S-FPZ',
  'HJTZ14S-FP',
  'HJ51913-FP',
  'HJTX20HQ-FP',
  'HJTZ7S-FPZ',
  'HJTX20CH-FP',
  'HJ13L-FPZ',
  'HJT9B-FP',
  'HJT7B-FPZ',
];

// Image extensions to accept
const IMAGE_EXTENSIONS = ['.webp', '.png', '.jpg', '.jpeg'];

// Paths
const ARTIFACTS_DIR = path.resolve(__dirname, '../../artifacts');
const PUBLIC_DIR = path.join(ARTIFACTS_DIR, 'skyrich-tr', 'public');
const PRODUCTS_DIR = path.join(PUBLIC_DIR, 'images', 'products');
const NORMALIZED_DIR = path.join(PRODUCTS_DIR, 'normalized');

// Normalization settings
const TRIM_THRESHOLD = 10; // Pixel threshold for white/near-white detection
const PADDING_PERCENT = 0.08; // 8% padding after trim
const OUTPUT_QUALITY = 95; // WebP quality
const OUTPUT_FORMAT = 'webp';

interface NormalizationManifestEntry {
  sku: string;
  originalPath: string;
  normalizedPath: string;
  originalSize: { width: number; height: number };
  normalizedSize: { width: number; height: number };
  trimApplied: { top: number; right: number; bottom: number; left: number };
  paddingApplied: number;
  success: boolean;
  error?: string;
}

function getExtension(filename: string): string {
  return path.parse(filename).ext.toLowerCase();
}

async function normalizeProductImages() {
  console.log('=== Product Image Normalization ===\n');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(NORMALIZED_DIR)) {
    fs.mkdirSync(NORMALIZED_DIR, { recursive: true });
    console.log(`Created output directory: ${NORMALIZED_DIR}`);
  }

  const manifest: NormalizationManifestEntry[] = [];

  for (const sku of APPROVED_SKUS) {
    console.log(`\nProcessing: ${sku}`);

    // Find canonical image for this SKU
    const canonicalExtensions = IMAGE_EXTENSIONS;
    let sourcePath: string | null = null;

    for (const ext of canonicalExtensions) {
      const testPath = path.join(PRODUCTS_DIR, `${sku}${ext}`);
      if (fs.existsSync(testPath)) {
        sourcePath = testPath;
        break;
      }
    }

    if (!sourcePath) {
      console.warn(`  No canonical image found for ${sku}`);
      manifest.push({
        sku,
        originalPath: '',
        normalizedPath: '',
        originalSize: { width: 0, height: 0 },
        normalizedSize: { width: 0, height: 0 },
        trimApplied: { top: 0, right: 0, bottom: 0, left: 0 },
        paddingApplied: 0,
        success: false,
        error: 'No canonical image found',
      });
      continue;
    }

    console.log(`  Source: ${sourcePath}`);

    try {
      // Get original metadata
      const metadata = await sharp(sourcePath).metadata();
      const originalSize = { width: metadata.width || 0, height: metadata.height || 0 };
      console.log(`  Original size: ${originalSize.width}x${originalSize.height}`);

      // Trim white/near-white margins
      const trimResult = await sharp(sourcePath)
        .trim({
          threshold: TRIM_THRESHOLD,
          background: '#FFFFFF',
        })
        .toBuffer({ resolveWithObject: true });

      const trimmedMetadata = trimResult.info;
      console.log(`  Trimmed size: ${trimmedMetadata.width}x${trimmedMetadata.height}`);

      // Calculate padding
      const paddingX = Math.round(trimmedMetadata.width * PADDING_PERCENT);
      const paddingY = Math.round(trimmedMetadata.height * PADDING_PERCENT);
      console.log(`  Padding: ${paddingX}px horizontal, ${paddingY}px vertical`);

      // Add padding and resize
      const finalWidth = trimmedMetadata.width + (paddingX * 2);
      const finalHeight = trimmedMetadata.height + (paddingY * 2);

      const normalizedBuffer = await sharp(trimmed.data)
        .extend({
          top: paddingY,
          bottom: paddingY,
          left: paddingX,
          right: paddingX,
          background: '#FFFFFF',
        })
        .webp({ quality: OUTPUT_QUALITY })
        .toBuffer();

      const outputPath = path.join(NORMALIZED_DIR, `${sku}.${OUTPUT_FORMAT}`);
      fs.writeFileSync(outputPath, normalizedBuffer);

      const normalizedSize = { width: finalWidth, height: finalHeight };

      console.log(`  Normalized size: ${finalWidth}x${finalHeight}`);
      console.log(`  Output: ${outputPath}`);

      // Calculate trim applied (approximate)
      const trimApplied = {
        top: Math.round((originalSize.height - trimmedMetadata.height) / 2),
        bottom: Math.round((originalSize.height - trimmedMetadata.height) / 2),
        left: Math.round((originalSize.width - trimmedMetadata.width) / 2),
        right: Math.round((originalSize.width - trimmedMetadata.width) / 2),
      };

      manifest.push({
        sku,
        originalPath: sourcePath,
        normalizedPath: outputPath,
        originalSize,
        normalizedSize,
        trimApplied,
        paddingApplied: paddingX,
        success: true,
      });

      console.log(`  ✓ Normalized successfully`);

    } catch (error) {
      console.error(`  ✗ Error: ${error}`);
      manifest.push({
        sku,
        originalPath: sourcePath || '',
        normalizedPath: '',
        originalSize: { width: 0, height: 0 },
        normalizedSize: { width: 0, height: 0 },
        trimApplied: { top: 0, right: 0, bottom: 0, left: 0 },
        paddingApplied: 0,
        success: false,
        error: String(error),
      });
    }
  }

  // Write manifest
  const manifestPath = path.join(PRODUCTS_DIR, 'product-image-normalization-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest written to: ${manifestPath}`);

  console.log('\n=== Summary ===');
  const successful = manifest.filter(m => m.success);
  const failed = manifest.filter(m => !m.success);
  console.log(`Successful: ${successful.length}/${manifest.length}`);
  console.log(`Failed: ${failed.length}/${manifest.length}`);

  if (failed.length > 0) {
    console.log('\nFailed SKUs:');
    failed.forEach(m => {
      console.log(`  ${m.sku}: ${m.error}`);
    });
  }
}

normalizeProductImages();
