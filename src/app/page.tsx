import BenefitsSection from '@/components/BenefitsSection';
import CatalogSection from '@/components/CatalogSection';
import ContactFormSection from '@/components/ContactSection';
import FooterSection from '@/components/FooterSection';
import HeroSection from '@/components/HeroSection';
import NavbarSection from '@/components/NavbarSection';
import ServicesSection from '@/components/ServiceSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import { buildHomeJsonLd, buildHomeMetadata, stringifyJsonLd } from '@/lib/seo';
import { fetchHomePageData, fetchSiteSettings } from '@/sanity/fetch';
import type { Metadata } from 'next';

/**
 * Producción: usa ISR para evitar render/fetch en cada visita.
 * Las ediciones de Sanity pueden tardar hasta 5 min en reflejarse si no hay webhook.
 */
export const revalidate = process.env.NODE_ENV === 'production' ? 300 : 0;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSiteSettings();
  return buildHomeMetadata(settings);
}

export default async function Home() {
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
        <BenefitsSection sanityData={data.benefits} />
        <ServicesSection sanityData={data.services} />
        <TestimonialsSection sanityData={data.testimonials} />
        <CatalogSection sanityData={data.catalog} />
        <ContactFormSection
          sanityData={data.contact}
          sanitySettings={data.settings}
          sanityServices={data.services}
        />
        <FooterSection
          sanityData={data.footer}
          sanitySettings={data.settings}
          sanityServices={data.services}
        />
      </main>
    </>
  );
}
