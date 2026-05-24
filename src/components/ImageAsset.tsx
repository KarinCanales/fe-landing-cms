/* eslint-disable @next/next/no-img-element */
import React from 'react';
import type { ImageValue } from '@/lib/types';

type ImageAssetProps = {
  image?: ImageValue;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
};

export default function ImageAsset({ image, alt, className, loading = 'lazy' }: ImageAssetProps) {
  if (!image) {
    return null;
  }

  if (typeof image === 'string') {
    return <img src={image} alt={alt} className={className} loading={loading} decoding="async" />;
  }

  const { src, alt: imageAlt, width, height } = image;

  return (
    <img
      src={src}
      alt={imageAlt || alt}
      className={className}
      loading={loading}
      decoding="async"
      width={width}
      height={height}
    />
  );
}
