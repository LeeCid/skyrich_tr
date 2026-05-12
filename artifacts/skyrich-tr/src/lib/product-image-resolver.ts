import { PRODUCT_IMAGE_MANIFEST, SKU_WITHOUT_CANONICAL_IMAGE } from "./product-image-manifest";

interface ProductImageResolverOptions {
  modelCode: string;
  orderNumber?: number;
  imageUrl?: string | null;
}

const PLACEHOLDER_PATTERNS = [
  '/images/battery-lithium.png',
  '/images/battery-placeholder.png',
  '/placeholder.png',
];

function isPlaceholder(url: string): boolean {
  return PLACEHOLDER_PATTERNS.some(pattern => url.includes(pattern));
}

function getCanonicalImagePath(modelCode: string, extension: string): string {
  return `/images/products/${modelCode}${extension}`;
}

function getNumberedImagePath(orderNumber: number, extension: string): string {
  return `/images/products/${orderNumber.toString().padStart(2, '0')}${extension}`;
}

function getNumberedAliasFromManifest(sku: string): string | null {
  const entry = PRODUCT_IMAGE_MANIFEST.find(e => e.sku === sku);
  if (!entry) return null;
  
  // Extract the numbered alias from the original file (e.g., "1.png" -> "01.png")
  const match = entry.originalFile.match(/^(\d+)\.\w+$/);
  if (!match) return null;
  
  const number = parseInt(match[1], 10);
  const extension = entry.originalFile.substring(entry.originalFile.lastIndexOf('.'));
  return getNumberedImagePath(number, extension);
}

export function resolveProductImage(options: ProductImageResolverOptions): string {
  const { modelCode, orderNumber, imageUrl } = options;
  const extensions = ['.webp', '.png', '.jpg', '.jpeg'];

  // 1. Check admin imageUrl if valid and not placeholder
  if (imageUrl && !isPlaceholder(imageUrl)) {
    return imageUrl;
  }

  // 2. Check canonical modelCode images
  for (const ext of extensions) {
    const canonicalPath = getCanonicalImagePath(modelCode, ext);
    // In browser, we can't check file existence directly
    // We assume canonical images exist based on mapping script
    if (ext === '.png') {
      return canonicalPath;
    }
  }

  // 3. Check numbered aliases from manifest (NOT guessed from orderNumber)
  const numberedAlias = getNumberedAliasFromManifest(modelCode);
  if (numberedAlias) {
    return numberedAlias;
  }

  // 4. Fallback to battery-lithium.png
  return '/images/battery-lithium.png';
}

export function hasVerifiedImage(modelCode: string): boolean {
  // SKU has verified image if it's in the manifest or has canonical image
  const inManifest = PRODUCT_IMAGE_MANIFEST.some(e => e.sku === modelCode);
  const hasCanonical = !SKU_WITHOUT_CANONICAL_IMAGE.includes(modelCode);
  return inManifest || hasCanonical;
}
