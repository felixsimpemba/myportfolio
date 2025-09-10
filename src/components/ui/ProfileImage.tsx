'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';

interface ProfileImageProps {
  src?: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackText?: string;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  fallbackText
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // If no src or image failed to load, show fallback
  if (!src || imageError) {
    return (
      <div 
        className={`bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        {fallbackText ? (
          <span className="text-2xl font-bold text-slate-600 dark:text-slate-300">
            {fallbackText.charAt(0).toUpperCase()}
          </span>
        ) : (
          <User className="h-8 w-8 text-slate-500 dark:text-slate-400" />
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {imageLoading && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg flex items-center justify-center">
          <User className="h-8 w-8 text-slate-400" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`rounded-lg object-cover transition-opacity duration-300 ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageError(true);
          setImageLoading(false);
        }}
        unoptimized={src.startsWith('blob:') || src.startsWith('data:')}
      />
    </div>
  );
};
