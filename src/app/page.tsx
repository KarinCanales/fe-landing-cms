import HomeClientSections from '@/components/HomeClientSections';
import NavbarSection from '@/components/NavbarSection';
import { buildHomeJsonLd, buildHomeMetadata, stringifyJsonLd } from '@/lib/seo';
import { fetchHomePageData, fetchSiteSettings, SHOULD_BYPASS_SANITY_CACHE } from '@/sanity/fetch';
import { connection } from 'next/server';
import type { Metadata } from 'next';

/**
 * ISR corto para producción. Los cambios de Sanity deben invalidarse con
 * /api/revalidate mediante webhook. Para pruebas locales con datos siempre
 * frescos, usa SANITY_DISABLE_CACHE=true.
 */
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSiteSettings();
  return buildHomeMetadata(settings);
}

export default async function Home() {
  if (SHOULD_BYPASS_SANITY_CACHE) {
    await connection();
  }

  const data = await fetchHomePageData();
  const jsonLd = buildHomeJsonLd(data);

  return (
    <>
      <a className="skipLink" href="#contenido-principal">
        Saltar al contenido principal
      </a>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(jsonLd) }}
      />
      <main id="contenido-principal">
        <NavbarSection
          sanityNavbar={data.navbar}
          sanitySettings={data.settings}
        />
        <HomeClientSections data={data} />
      </main>
    </>
  );
}
