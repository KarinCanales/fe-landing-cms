import { sanityClient, isSanityConfigured } from './client';
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
import type { HomePageData } from './types';

async function safeFetch<T>(query: string): Promise<T | null> {
  if (!isSanityConfigured) return null;

  try {
    const result = await sanityClient.fetch<T>(
      query,
      {},
      {
        cache: 'no-store',
        next: { revalidate: 0 },
      } as never,
    );

    return result ?? null;
  } catch (err) {
    console.warn('[Sanity] Query failed, using fallback:', err);
    return null;
  }
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
    hero,
    benefits,
    services,
    catalog,
    testimonials,
    contact,
    footer,
  } as HomePageData;
}
