import Image from 'next/image';
import type { Metadata } from 'next';
import { connection } from 'next/server';
import CatalogPageClient from './CatalogPageClient';
import styles from './page.module.css';
import NavbarSection from '@/components/NavbarSection';
import { fallbackCatalogItems } from '@/data/fallbacks';
import { SITE_NAME } from '@/lib/site';
import { resolveImageWithUrl } from '@/sanity/image';
import {
  fetchCatalogPageData,
  fetchSiteSettings,
  SHOULD_BYPASS_SANITY_CACHE,
} from '@/sanity/fetch';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [catalog, settings] = await Promise.all([
    fetchCatalogPageData(),
    fetchSiteSettings(),
  ]);

  const title = catalog?.title
    ? `${catalog.title} ${catalog.highlightWord || ''}`.trim()
    : 'Catálogo completo';
  const description =
    catalog?.supportText ||
    'Explora el catálogo completo de fotos y videos de Karin Cadenas Bodas & Eventos.';

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      images: settings?.seo?.ogImageUrl ? [{ url: settings.seo.ogImageUrl }] : undefined,
    },
  };
}

export default async function CatalogPage() {
  if (SHOULD_BYPASS_SANITY_CACHE) {
    await connection();
  }

  const [catalog, settings] = await Promise.all([
    fetchCatalogPageData(),
    fetchSiteSettings(),
  ]);

  const backgroundImage = resolveImageWithUrl(
    catalog?.backgroundImage,
    catalog?.backgroundImageUrl,
    '/images/_miscelanea/velas.webp',
    'background',
  );

  const companyName = settings?.companyName || 'Karin Cadenas Bodas & Eventos';
  const logoSrc = resolveImageWithUrl(
    settings?.logo,
    settings?.logoUrl,
    '/images/_logo/logo.webp',
    'logo',
  );

  return (
    <>
      <NavbarSection sanitySettings={settings} />
      <main className={styles.catalogPage}>
        <div className={styles.backgroundPhoto} aria-hidden="true">
          <Image src={backgroundImage} alt="" fill sizes="100vw" priority />
        </div>
        <div className={styles.overlay} aria-hidden="true" />

        <header className={styles.header}>
          <div className={styles.brandMark}>
            <Image
              src={logoSrc}
              alt={`Logo de ${companyName}`}
              width={76}
              height={76}
              priority
              className={styles.logoImage}
            />
          </div>
          <p className={styles.eyebrow}>{catalog?.eyebrow || 'Catálogo completo'}</p>
          <h1>
            {catalog?.title || 'Momentos, montajes'}
            <em>{catalog?.highlightWord || ' y detalles.'}</em>
          </h1>
          <p className={styles.subtitle}>
            {catalog?.supportText ||
              'Una selección amplia de fotos y videos para recorrer el estilo, la composición y el cuidado visual de cada celebración.'}
          </p>
          <p className={styles.description}>
            Filtra por categoría y abre cada pieza para verla en detalle.
          </p>
        </header>

        <CatalogPageClient catalog={catalog} fallbackItems={fallbackCatalogItems} />
      </main>
    </>
  );
}
