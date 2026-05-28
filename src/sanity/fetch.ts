import { sanityClient, isSanityConfigured } from './client';
import { normalizeCmsHref } from '@/lib/links';
import {
  SITE_SETTINGS_QUERY,
  NAVBAR_QUERY,
  HERO_QUERY,
  BENEFITS_QUERY,
  SERVICES_QUERY,
  CATALOG_QUERY,
  TESTIMONIALS_QUERY,
  CONTACT_QUERY,
  FOOTER_QUERY,
} from './queries';
import type { HeroData, HomePageData, SiteSettingsData } from './types';

const SANITY_REVALIDATE_SECONDS = process.env.NODE_ENV === 'production' ? 300 : 0;

async function safeFetch<T>(query: string): Promise<T | null> {
  if (!isSanityConfigured) return null;

  try {
    const result = await sanityClient.fetch<T>(query, {}, {
      next: { revalidate: SANITY_REVALIDATE_SECONDS },
      ...(SANITY_REVALIDATE_SECONDS === 0 ? { cache: 'no-store' } : null),
    } as never);

    return result ?? null;
  } catch (err) {
    const message = err instanceof Error ? `${err.name}: ${err.message}` : 'Unknown error';
    console.warn(`[Sanity] Query failed, using fallback. ${message}`);
    return null;
  }
}

function normalizeHeroData(hero: HeroData): HeroData {
  if (!hero) return hero;

  return {
    ...hero,
    ctaPrimary: hero.ctaPrimary
      ? {
          ...hero.ctaPrimary,
          href: normalizeCmsHref(hero.ctaPrimary.href, '#contacto'),
        }
      : hero.ctaPrimary,
    ctaSecondary: hero.ctaSecondary
      ? {
          ...hero.ctaSecondary,
          href: normalizeCmsHref(hero.ctaSecondary.href, '#catalogo'),
        }
      : hero.ctaSecondary,
  };
}

export async function fetchSiteSettings(): Promise<SiteSettingsData> {
  return safeFetch<NonNullable<SiteSettingsData>>(SITE_SETTINGS_QUERY);
}

export async function fetchHomePageData(): Promise<HomePageData> {
  const [
    settings,
    navbar,
    hero,
    benefits,
    services,
    catalog,
    testimonials,
    contact,
    footer,
  ] = await Promise.all([
    safeFetch(SITE_SETTINGS_QUERY),
    safeFetch(NAVBAR_QUERY),
    safeFetch(HERO_QUERY),
    safeFetch(BENEFITS_QUERY),
    safeFetch(SERVICES_QUERY),
    safeFetch(CATALOG_QUERY),
    safeFetch(TESTIMONIALS_QUERY),
    safeFetch(CONTACT_QUERY),
    safeFetch(FOOTER_QUERY),
  ]);

  return {
    settings,
    navbar,
    hero: normalizeHeroData(hero as HeroData),
    benefits,
    services,
    catalog,
    testimonials,
    contact,
    footer,
  } as HomePageData;
}
