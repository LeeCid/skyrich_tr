import { useState } from "react";

interface LogoProps {
  variant?: "navLarge" | "navMobile" | "footer";
  className?: string;
  imageClassName?: string;
  textClassName?: string;
  alt?: string;
  fallbackToText?: boolean;
  preferredFormat?: "svg" | "png";
}

/**
 * Asset-aware Logo component.
 *
 * Tries /brand/skyrich-logo.svg first (or PNG if preferredFormat="png"),
 * then the other format on error.
 * Falls back to a clean text mark if both fail.
 *
 * The official SVG is a full distributor banner (2172×724, 3:1 aspect ratio)
 * with Chinese text, Skyrich branding, and Turkish distributor shield.
 *
 * Variants:
 * - navLarge: Desktop navbar (larger, 80-84px height, 460-520px width)
 * - navMobile: Mobile navbar (smaller, 54-62px height, 300-360px width)
 * - footer: Footer (medium, 40px height, 220px width)
 *
 * Uses deterministic onError fallback instead of pre-probing, so assets
 * added after the component mounts will work on refresh.
 *
 * Usage:
 *   <Logo variant="navLarge" className="h-20 max-w-[480px]" />
 *   <Logo variant="navMobile" className="h-14 max-w-[320px]" />
 *   <Logo variant="footer" className="h-10 max-w-[220px]" />
 */
export function Logo({
  variant = "navLarge",
  className = "",
  imageClassName = "",
  textClassName = "",
  alt = "Skyrich Power",
  fallbackToText = true,
  preferredFormat = "svg",
}: LogoProps) {
  const [showFallback, setShowFallback] = useState(false);

  if (showFallback) {
    if (!fallbackToText) {
      return (
        <span className={`inline-block ${textClassName || className}`}>
          {alt}
        </span>
      );
    }
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="font-mono text-2xl font-bold tracking-tighter text-primary">SKYRICH</span>
        <span className="text-sm font-semibold tracking-widest text-muted-foreground hidden sm:inline-block">POWER</span>
      </div>
    );
  }

  const initialSrc = preferredFormat === "png" 
    ? "/brand/skyrich-logo.png" 
    : "/brand/skyrich-logo.svg";
  const fallbackSrc = preferredFormat === "png"
    ? "/brand/skyrich-logo.svg"
    : "/brand/skyrich-logo.png";

  return (
    <img
      src={initialSrc}
      alt={alt}
      className={`object-contain ${imageClassName || className}`}
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src !== fallbackSrc) {
          img.src = fallbackSrc;
        } else {
          setShowFallback(true);
        }
      }}
    />
  );
}
