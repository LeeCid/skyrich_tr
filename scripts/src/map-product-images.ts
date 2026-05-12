import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

// Paths - use absolute path to artifacts directory
const ARTIFACTS_DIR = path.resolve(__dirname, '../../artifacts');
const PUBLIC_DIR = path.join(ARTIFACTS_DIR, 'skyrich-tr', 'public');
const PRODUCTS_DIR = path.join(PUBLIC_DIR, 'images', 'products');
const RAW_DIR = path.join(PRODUCTS_DIR, 'raw');

function naturalSort(a: string, b: string): number {
  const numA = parseInt(a.replace(/\D/g, ''), 10);
  const numB = parseInt(b.replace(/\D/g, ''), 10);
  if (isNaN(numA) || isNaN(numB)) {
    return a.localeCompare(b);
  }
  return numA - numB;
}

function isCanonicalFilename(filename: string): boolean {
  const baseName = path.parse(filename).name;
  return APPROVED_SKUS.some(sku => baseName === sku);
}

function getExtension(filename: string): string {
  return path.parse(filename).ext.toLowerCase();
}

function getSourceFolder(): string {
  if (fs.existsSync(RAW_DIR)) {
    return RAW_DIR;
  }
  return PRODUCTS_DIR;
}

function mapProductImages() {
  const sourceFolder = getSourceFolder();
  console.log(`Scanning source folder: ${sourceFolder}`);

  if (!fs.existsSync(sourceFolder)) {
    console.error('Source folder does not exist');
    return;
  }

  const files = fs.readdirSync(sourceFolder);
  console.log(`Found ${files.length} files in source folder`);

  // Filter for image files and exclude canonical files
  const imageFiles = files
    .filter(f => IMAGE_EXTENSIONS.includes(getExtension(f)))
    .filter(f => !isCanonicalFilename(f))
    .sort(naturalSort);

  console.log(`Found ${imageFiles.length} non-canonical image files`);
  console.log('Files:', imageFiles);

  // Create output directory if it doesn't exist
  if (!fs.existsSync(PRODUCTS_DIR)) {
    fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
  }

  const manifest: Array<{
    originalFile: string;
    canonicalFile: string;
    sku: string;
    order: number;
  }> = [];

  // Map first 12 images to SKUs
  const imagesToMap = imageFiles.slice(0, 12);
  
  if (imagesToMap.length < 12) {
    console.warn(`Warning: Only ${imagesToMap.length} images found, but 12 SKUs to map`);
  }

  if (imageFiles.length > 12) {
    console.warn(`Warning: ${imageFiles.length - 12} extra images will not be mapped automatically`);
    console.warn('Extra files:', imageFiles.slice(12));
  }

  imagesToMap.forEach((file, index) => {
    const sku = APPROVED_SKUS[index];
    if (!sku) {
      console.warn(`No SKU for index ${index}, skipping ${file}`);
      return;
    }

    const sourcePath = path.join(sourceFolder, file);
    const ext = getExtension(file);
    
    // Determine output format
    const outputFormat = process.env.IMAGE_OUTPUT_FORMAT || ext;
    const canonicalFilename = `${sku}${outputFormat}`;
    const canonicalPath = path.join(PRODUCTS_DIR, canonicalFilename);
    const numberedFilename = `${(index + 1).toString().padStart(2, '0')}${outputFormat}`;
    const numberedPath = path.join(PRODUCTS_DIR, numberedFilename);

    // Copy to canonical filename
    if (!fs.existsSync(canonicalPath)) {
      fs.copyFileSync(sourcePath, canonicalPath);
      console.log(`✓ Copied ${file} -> ${canonicalFilename}`);
    } else {
      console.log(`- Skipped ${canonicalFilename} (already exists)`);
    }

    // Copy to numbered alias
    if (!fs.existsSync(numberedPath)) {
      fs.copyFileSync(sourcePath, numberedPath);
      console.log(`✓ Copied ${file} -> ${numberedFilename}`);
    } else {
      console.log(`- Skipped ${numberedFilename} (already exists)`);
    }

    manifest.push({
      originalFile: file,
      canonicalFile: canonicalFilename,
      sku,
      order: index + 1,
    });
  });

  // Write manifest
  const manifestPath = path.join(PRODUCTS_DIR, 'product-image-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest written to: ${manifestPath}`);

  console.log('\n=== Summary ===');
  console.log(`Mapped ${manifest.length} images`);
  manifest.forEach(m => {
    console.log(`  ${m.order}. ${m.sku}: ${m.originalFile} -> ${m.canonicalFile}`);
  });
}

mapProductImages();
