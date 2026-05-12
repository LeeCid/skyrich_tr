import { resolveProductImage } from "@/lib/product-image-resolver";

interface ProductImageStageProps {
  modelCode: string;
  orderNumber: number;
  imageUrl?: string | null | undefined;
  alt: string;
  variant?: "compactCard" | "featuredCard" | "detailHero" | "fallback";
  className?: string;
  maxHeight?: string;
}

const variantStyles = {
  compactCard: {
    container: "relative w-full h-full flex items-center justify-center overflow-hidden",
    image: "w-full h-full object-contain",
    scale: 1.0,
  },
  featuredCard: {
    container: "relative w-full h-full flex items-center justify-center overflow-hidden",
    image: "w-full h-full object-contain",
    scale: 1.0,
  },
  detailHero: {
    container: "relative w-full flex items-center justify-center overflow-hidden",
    image: "w-full h-auto object-contain",
    scale: 1.0,
  },
  fallback: {
    container: "relative w-full h-full flex items-center justify-center overflow-hidden",
    image: "w-full h-full object-contain",
    scale: 1.0,
  },
};

export function ProductImageStage({
  modelCode,
  orderNumber,
  imageUrl,
  alt,
  variant = "compactCard",
  className = "",
  maxHeight,
}: ProductImageStageProps) {
  const displayImage = resolveProductImage({
    modelCode,
    orderNumber,
    imageUrl,
  });
  const fallbackImage = "/images/battery-lithium.png";

  const styles = variantStyles[variant];

  return (
    <div className={styles.container}>
      <img
        src={displayImage}
        alt={alt}
        className={`${styles.image} ${className}`}
        style={{ maxHeight: maxHeight || undefined }}
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src !== fallbackImage) {
            target.src = fallbackImage;
          }
        }}
      />
    </div>
  );
}
