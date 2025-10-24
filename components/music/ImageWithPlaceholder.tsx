'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';

interface ImageWithPlaceholderProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

export function ImageWithPlaceholder({
  src,
  alt,
  fill,
  width,
  height,
  sizes,
  priority,
  className,
}: ImageWithPlaceholderProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100">
        <ImageOff className="h-12 w-12 text-gray-400" />
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className={className}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
    </>
  );
}
