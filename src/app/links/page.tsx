import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import styles from './page.module.css';
import LinksCard from './LinksCard';
import { fallbackLinksPage } from '@/data/fallbacks';
import { resolveImageWithUrl } from '@/sanity/image';
import { fetchLinksPageData, fetchSiteSettings, SHOULD_BYPASS_SANITY_CACHE } from '@/sanity/fetch';
import type { LinksPageData, LinksPageLink } from '@/sanity/types';
import { connection } from 'next/server';

export const revalidate = 60;

function cleanText(value?: string | null) {
  const text = value?.trim();
  return text || '';
}

function normalizePhoneHref(value?: string | null) {
  const cleanPhone = value?.replace(/\D/g, '') || '';
  return cleanPhone.length >= 8 ? `tel:+${cleanPhone}` : '';
}

function getLinkHref(link: LinksPageLink) {
  const url = cleanText(link.url);
  if (url) return url;

  if (link.type === 'email' && link.email) return `mailto:${link.email}`;
  if (link.type === 'phone' && link.phone) return normalizePhoneHref(link.phone);
  if (link.type === 'whatsapp' && link.phone) return `https://wa.me/${link.phone.replace(/\D/g, '')}`;

  return '';
}

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

function getQrUrl(href: string) {
  if (!href) return '';
  if (/^(https?:|mailto:|tel:)/i.test(href)) return href;

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://karincadenaseventos.com').replace(/\/$/, '');
  return href.startsWith('/') ? `${siteUrl}${href}` : `${siteUrl}/${href}`;
}

function sortLinks(links: LinksPageLink[]) {
  return links
    .map((link, index) => ({link, index}))
    .sort((a, b) => {
      const orderA = Number.isFinite(a.link.order) ? Number(a.link.order) : a.index + 1000;
      const orderB = Number.isFinite(b.link.order) ? Number(b.link.order) : b.index + 1000;
      return orderA - orderB;
    })
    .map(({link}) => link);
}

function getVisibleLinks(data?: LinksPageData) {
  const sourceLinks = data?.links?.length ? data.links : fallbackLinksPage.links;
  return sortLinks(sourceLinks).filter((link) => link.active !== false && cleanText(link.name) && getLinkHref(link));
}

export async function generateMetadata(): Promise<Metadata> {
  const [linksPage, settings] = await Promise.all([fetchLinksPageData(), fetchSiteSettings()]);
  const title = linksPage?.title || fallbackLinksPage.title;
  const description = linksPage?.subtitle || fallbackLinksPage.subtitle;

  return {
    title: `${title} | Links`,
    description,
    openGraph: {
      title: `${title} | Links`,
      description,
      images: settings?.seo?.ogImageUrl ? [{url: settings.seo.ogImageUrl}] : undefined,
    },
  };
}

export default async function LinksPage() {
  if (SHOULD_BYPASS_SANITY_CACHE) {
    await connection();
  }

  const [linksPage, settings] = await Promise.all([fetchLinksPageData(), fetchSiteSettings()]);
  const title = linksPage?.title || fallbackLinksPage.title;
  const subtitle = linksPage?.subtitle || fallbackLinksPage.subtitle;
  const visibleLinks = getVisibleLinks(linksPage);
  const companyName = settings?.companyName || 'Karin Cadenas Bodas & Eventos';
  const logoSrc = resolveImageWithUrl(
    settings?.logo,
    settings?.logoUrl,
    '/images/_logo/logo.webp',
    'logo',
  );

  return (
    <main className={styles.linksPage}>
      <div className={styles.backgroundPhoto} aria-hidden="true">
        <Image
          src="/images/1-hero/hero.webp"
          alt=""
          fill
          sizes="100vw"
          priority
        />
      </div>
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.linksOrbitalField} aria-hidden="true">
        <span className={styles.linksGlow} />
        <span className={styles.linksOrbit}>
          <span className={styles.linksOrbitDot} />
        </span>
        <span className={styles.linksOrbitInner} />
        <span className={styles.linksOrbitCore} />
        <span className={styles.linksParticles}>
          {Array.from({length: 10}).map((_, index) => (
            <i key={index} />
          ))}
        </span>
      </div>

      <section className={styles.shell} aria-labelledby="links-title">
        <Link className={styles.homeLink} href="/" aria-label="Volver al sitio principal de Karin Eventos">
          Sitio web
        </Link>

        <header className={styles.header}>
          <div className={styles.brandMark}>
            {logoSrc ? (
              <Image
                src={logoSrc}
                alt={`Logo de ${companyName}`}
                width={92}
                height={92}
                priority
                className={styles.logoImage}
              />
            ) : (
              <span className={styles.logoFallback}>KC</span>
            )}
          </div>
          <p className={styles.eyebrow}>{companyName}</p>
          <h1 id="links-title">{title}</h1>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        </header>

        <div className={styles.linksStack}>
          {visibleLinks.map((link) => {
            const href = getLinkHref(link);
            return (
              <LinksCard
                key={link._key || `${link.name}-${href}`}
                link={link}
                href={href}
                qrUrl={getQrUrl(href)}
                isExternal={isExternalHref(href)}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}
