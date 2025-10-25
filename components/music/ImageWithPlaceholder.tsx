'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
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
  quality?: number;
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
  quality = 85,
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
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 to-gray-300"
          />
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="h-full w-full"
      >
        <Image
          src={src}
          alt={alt}
          fill={fill}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          quality={quality}
          className={className}
          onLoad={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
        />
      </motion.div>
    </>
  );
}
