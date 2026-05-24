export const SITE_NAME = "Karin Cadenas Bodas & Eventos";
export const SITE_TITLE =
  "Karin Cadenas Bodas & Eventos | Wedding planner en Lima";
export const SITE_DESCRIPTION =
  "Diseño, planificación, catering y ambientación de bodas y eventos premium en Lima, Perú, con coordinación cuidada y estética elegante.";

const RAW_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://karincadenaseventos.com";

export const SITE_URL = RAW_SITE_URL.replace(/\/+$/, "");
export const SITE_LANGUAGE = "es";
export const SITE_LOCALE = "es_PE";
export const SITE_THEME_COLOR = "#1c3b3a";
export const DEFAULT_SOCIAL_IMAGE = "/images/social/karin-cadenas-social.png";
export const DEFAULT_SOCIAL_IMAGE_ALT =
  "Karin Cadenas Bodas & Eventos, wedding planner y eventos premium en Lima";

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}
