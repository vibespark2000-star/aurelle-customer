"use client";

import React, { useEffect, useRef, useState } from "react";
import Image, { ImageProps } from "next/image";

/**
 * next/image with a designed fallback. Content images come from the CMS and
 * can go dead (e.g. a removed Unsplash photo); instead of an empty box we
 * show a plain navy panel with an optional label.
 */
export const SmartImage: React.FC<ImageProps & { fallbackLabel?: string }> = ({
  fallbackLabel,
  className = "",
  alt,
  ...props
}) => {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // An image that failed before hydration never fires React's onError.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed || !props.src) {
    return (
      <div
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        className="absolute inset-0 flex items-center justify-center overflow-hidden bg-surface-sunken"
      >
        {fallbackLabel && (
          <span
            className="relative select-none font-display text-[64px] font-extrabold uppercase leading-none tracking-tight text-ink/10"
            aria-hidden="true"
          >
            {fallbackLabel.slice(0, 2)}
          </span>
        )}
      </div>
    );
  }

  return <Image ref={ref} alt={alt} className={className} onError={() => setFailed(true)} {...props} />;
};
