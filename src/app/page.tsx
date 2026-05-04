import BenefitsSection from '@/components/BenefitsSection';
import CatalogSection from '@/components/CatalogSection';
import ContactFormSection from '@/components/ContactSection';
import FooterSection from '@/components/FooterSection';
import HeroSection from '@/components/HeroSection';
import NavbarSection from '@/components/NavbarSection';
import ServicesSection from '@/components/ServiceSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import { fetchHomePageData } from '@/sanity/fetch';

/**
 * Mientras el cliente edita desde Sanity, no conviene que Next sirva una
 * versión estática vieja de la página. Esto hace que cada refresh lea Sanity.
 */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const data = await fetchHomePageData();

  return (
    <main>
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
      />
      <FooterSection
        sanityData={data.footer}
        sanitySettings={data.settings}
      />
    </main>
  );
}
