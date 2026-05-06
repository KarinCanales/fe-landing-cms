import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { sanityClient, isSanityConfigured } from "./client";

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export type ImagePreset =
  | "hero"
  | "background"
  | "card"
  | "thumbnail"
  | "avatar"
  | "logo"
  | "og";

type ImagePresetConfig = {
  width: number;
  height?: number;
  quality: number;
  fit?: "crop" | "max" | "clip";
};

const IMAGE_PRESETS: Record<ImagePreset, ImagePresetConfig> = {
  hero: {
    width: 1200,
    quality: 66,
    fit: "max",
  },
  background: {
    width: 1100,
    quality: 62,
    fit: "max",
  },
  card: {
    width: 680,
    quality: 66,
    fit: "max",
  },
  thumbnail: {
    width: 360,
    quality: 62,
    fit: "max",
  },
  avatar: {
    width: 160,
    height: 160,
    quality: 68,
    fit: "crop",
  },
  logo: {
    width: 220,
    quality: 70,
    fit: "max",
  },
  og: {
    width: 1200,
    height: 630,
    quality: 76,
    fit: "crop",
  },
};

function isExternalUrl(value: string) {
  return value.startsWith("http://") || value.startsWith("https://");
}

function isLocalUrl(value: string) {
  return value.startsWith("/") || value.startsWith("data:") || value.startsWith("blob:");
}

function looksLikeSanityImageObject(source: unknown) {
  if (!source || typeof source !== "object") return false;

  const value = source as {
    asset?: unknown;
    _ref?: unknown;
    _type?: unknown;
  };

  return Boolean(value.asset || value._ref || value._type === "image");
}

export function optimizedSanityImage(
  source: SanityImageSource | string | null | undefined,
  preset: ImagePreset = "card",
) {
  if (!source) return "";

  if (typeof source === "string") {
    return source;
  }

  if (!isSanityConfigured || !looksLikeSanityImageObject(source)) {
    return "";
  }

  const config = IMAGE_PRESETS[preset];

  try {
    let image = urlFor(source)
      .width(config.width)
      .quality(config.quality)
      .auto("format");

    if (config.height) {
      image = image.height(config.height);
    }

    if (config.fit) {
      image = image.fit(config.fit);
    }

    return image.url();
  } catch {
    return "";
  }
}

/**
 * Compatibilidad con los componentes existentes.
 *
 * Antes varios componentes importaban `resolveImage(source, fallback)`.
 * Esta función conserva esa API, pero ahora devuelve imágenes de Sanity optimizadas.
 */
export function resolveImage(
  source: SanityImageSource | string | null | undefined,
  fallback = "",
  preset: ImagePreset = "card",
) {
  if (!source) return fallback;

  if (typeof source === "string") {
    if (isExternalUrl(source) || isLocalUrl(source)) {
      return source;
    }

    return fallback;
  }

  return optimizedSanityImage(source, preset) || fallback;
}


export function resolveImageWithUrl(
  source: SanityImageSource | string | null | undefined,
  sourceUrl?: string | null,
  fallback = "",
  preset: ImagePreset = "card",
) {
  return resolveImage(source, sourceUrl || fallback, preset);
}

export function resolveBackgroundImage(
  source: SanityImageSource | string | null | undefined,
  fallback = "",
) {
  return resolveImage(source, fallback, "background");
}

export function resolveCardImage(
  source: SanityImageSource | string | null | undefined,
  fallback = "",
) {
  return resolveImage(source, fallback, "card");
}

export function resolveThumbnailImage(
  source: SanityImageSource | string | null | undefined,
  fallback = "",
) {
  return resolveImage(source, fallback, "thumbnail");
}

export function resolveAvatarImage(
  source: SanityImageSource | string | null | undefined,
  fallback = "",
) {
  return resolveImage(source, fallback, "avatar");
}

export function resolveLogoImage(
  source: SanityImageSource | string | null | undefined,
  fallback = "",
) {
  return resolveImage(source, fallback, "logo");
}

export function resolveOgImage(
  source: SanityImageSource | string | null | undefined,
  fallback = "",
) {
  return resolveImage(source, fallback, "og");
}

export function optimizedSanityBackground(
  source: SanityImageSource | string | null | undefined,
) {
  return optimizedSanityImage(source, "background");
}

export function optimizedSanityCard(
  source: SanityImageSource | string | null | undefined,
) {
  return optimizedSanityImage(source, "card");
}

export function optimizedSanityThumbnail(
  source: SanityImageSource | string | null | undefined,
) {
  return optimizedSanityImage(source, "thumbnail");
}

export function optimizedSanityAvatar(
  source: SanityImageSource | string | null | undefined,
) {
  return optimizedSanityImage(source, "avatar");
}

export function optimizedSanityLogo(
  source: SanityImageSource | string | null | undefined,
) {
  return optimizedSanityImage(source, "logo");
}

export function optimizedSanityOgImage(
  source: SanityImageSource | string | null | undefined,
) {
  return optimizedSanityImage(source, "og");
}
