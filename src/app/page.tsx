import BenefitsSection from '@/components/BenefitsSection';
import CatalogSection from '@/components/CatalogSection';
import ContactFormSection from '@/components/ContactSection';
import FooterSection from '@/components/FooterSection';
import HeroSection from '@/components/HeroSection';
import NavbarSection from '@/components/NavbarSection';
import SectionFade from '@/components/SectionFade';
import ServicesSection from '@/components/ServiceSection';
import TestimonialsSection from '@/components/TestimonialsSection';
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
        <HeroSection sanityData={data.hero} sanitySettings={data.settings} />
        <SectionFade variant="darkToLight" />
        <BenefitsSection sanityData={data.benefits} />
        <SectionFade variant="lightToDark" />
        <ServicesSection sanityData={data.services} />
        <SectionFade variant="darkToLight" />
        <TestimonialsSection sanityData={data.testimonials} />
        <SectionFade variant="lightToDark" />
        <CatalogSection sanityData={data.catalog} />
        <SectionFade variant="darkToWarm" />
        <ContactFormSection
          sanityData={data.contact}
          sanitySettings={data.settings}
          sanityServices={data.services}
        />
        <SectionFade variant="warmToDark" />
        <FooterSection
          sanityData={data.footer}
          sanitySettings={data.settings}
          sanityServices={data.services}
        />
      </main>
    </>
  );
}
