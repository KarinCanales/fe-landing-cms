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
  LINKS_PAGE_QUERY,
} from './queries';
import type {
  CatalogData,
  HeroData,
  HomePageData,
  LinksPageData,
  SiteSettingsData,
} from './types';

const DEFAULT_REVALIDATE_SECONDS = 60;

function getRevalidateSeconds() {
  const value = Number(process.env.SANITY_REVALIDATE_SECONDS);

  if (Number.isFinite(value) && value >= 0) {
    return value;
  }

  return DEFAULT_REVALIDATE_SECONDS;
}

export const SHOULD_BYPASS_SANITY_CACHE = process.env.SANITY_DISABLE_CACHE === 'true';

const SANITY_REVALIDATE_SECONDS = SHOULD_BYPASS_SANITY_CACHE ? 0 : getRevalidateSeconds();

type FetchTag =
  | 'siteSettings'
  | 'navbarSettings'
  | 'heroSection'
  | 'benefitsSection'
  | 'servicesSection'
  | 'catalogSection'
  | 'testimonialsSection'
  | 'contactSection'
  | 'footerSection'
  | 'linksPage';

function getFetchOptions(tag: FetchTag) {
  if (SHOULD_BYPASS_SANITY_CACHE || SANITY_REVALIDATE_SECONDS === 0) {
    return {
      cache: 'no-store',
    } as const;
  }

  return {
    next: {
      revalidate: SANITY_REVALIDATE_SECONDS,
      tags: ['sanity', tag],
    },
  } as const;
}

async function safeFetch<T>(query: string, tag: FetchTag): Promise<T | null> {
  if (!isSanityConfigured) return null;

  try {
    const result = await sanityClient.fetch<T>(query, {}, getFetchOptions(tag) as never);

    return result ?? null;
  } catch (err) {
    const message = err instanceof Error ? `${err.name}: ${err.message}` : 'Unknown error';
    console.warn(`[Sanity] Query failed for ${tag}, using fallback. ${message}`);
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
          href: normalizeCmsHref(hero.ctaSecondary.href, '/catalogo'),
        }
      : hero.ctaSecondary,
  };
}

export async function fetchSiteSettings(): Promise<SiteSettingsData> {
  return safeFetch<NonNullable<SiteSettingsData>>(SITE_SETTINGS_QUERY, 'siteSettings');
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
    safeFetch(SITE_SETTINGS_QUERY, 'siteSettings'),
    safeFetch(NAVBAR_QUERY, 'navbarSettings'),
    safeFetch(HERO_QUERY, 'heroSection'),
    safeFetch(BENEFITS_QUERY, 'benefitsSection'),
    safeFetch(SERVICES_QUERY, 'servicesSection'),
    safeFetch(CATALOG_QUERY, 'catalogSection'),
    safeFetch(TESTIMONIALS_QUERY, 'testimonialsSection'),
    safeFetch(CONTACT_QUERY, 'contactSection'),
    safeFetch(FOOTER_QUERY, 'footerSection'),
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

export async function fetchLinksPageData(): Promise<LinksPageData> {
  return safeFetch<NonNullable<LinksPageData>>(LINKS_PAGE_QUERY, 'linksPage');
}

export async function fetchCatalogPageData(): Promise<CatalogData> {
  return safeFetch<NonNullable<CatalogData>>(CATALOG_QUERY, 'catalogSection');
}
