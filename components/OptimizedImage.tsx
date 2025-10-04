"use client";

import Image, { ImageProps } from "next/image";

interface OptimizedImageProps extends Omit<ImageProps, "src" | "alt"> {
  src: string;
  alt: string;
  /** Show blur placeholder until image loads */
  blur?: boolean;
  /** Mark image as high-priority (use sparingly, e.g. hero images) */
  priorityLoad?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  blur = true,
  priorityLoad = false,
  ...props
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priorityLoad}
      placeholder={blur ? "blur" : "empty"}
      blurDataURL={
        blur
          ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB..." // a tiny transparent pixel
          : undefined
      }
      sizes="(max-width: 640px) 100vw,
             (max-width: 1024px) 90vw,
             800px"
      className="object-cover rounded-lg"
      {...props}
    />
  );
}
