import type { CSSProperties } from 'react';
import {
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
} from 'lucide-react';
import styles from './FooterSection.module.css';
import { resolveImageWithUrl } from '@/sanity/image';
import type { FooterData, ServicesData, SiteSettingsData, SocialLink } from '@/sanity/types';
import {
  fallbackNavigationLinks,
  fallbackServiceLinks,
  WHATSAPP_URL,
  CONTACT_EMAIL,
  QUOTE_EMAIL,
} from '@/data/fallbacks';

type Props = {
  sanityData?: FooterData;
  sanitySettings?: SiteSettingsData;
  sanityServices?: ServicesData;
};

type FooterDataWithBackgroundAliases = NonNullable<FooterData> & {
  backgroundImageUrl?: string;
  footerBackgroundImage?: unknown;
  background?: unknown;
  backgroundPhoto?: unknown;
};

function getFooterBackgroundUrl(data?: FooterData) {
  const footerData = data as FooterDataWithBackgroundAliases | null | undefined;

  if (!footerData) return '';

  const source =
    footerData.backgroundImage ||
    footerData.footerBackgroundImage ||
    footerData.background ||
    footerData.backgroundPhoto ||
    footerData.backgroundImageUrl;

  return resolveImageWithUrl(source as never, footerData.backgroundImageUrl, '', 'background');
}

function formatPhoneDisplay(value?: string | null) {
  const rawValue = value?.trim();
  if (!rawValue) return '';
  if (rawValue.startsWith('http://') || rawValue.startsWith('https://')) {
    try {
      const url = new URL(rawValue);
      return url.pathname.replace('/', '') || url.searchParams.get('phone') || rawValue;
    } catch {
      return rawValue;
    }
  }
  return rawValue;
}

function normalizeWhatsappUrl(value?: string | null) {
  const rawValue = value?.trim();

  if (!rawValue) return "";

  if (rawValue.startsWith("http://") || rawValue.startsWith("https://")) {
    return rawValue;
  }

  const cleanPhone = rawValue.replace(/\D/g, "");

  if (!cleanPhone || cleanPhone.length < 8) {
    return "";
  }

  return `https://wa.me/${cleanPhone}`;
}

function cleanText(value?: string | null) {
  const text = value?.trim();
  return text ? text : undefined;
}

function Instagram({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="18" height="18" x="3" y="3" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Facebook({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.7 21v-7.7h2.6l.4-3h-3V8.4c0-.9.3-1.5 1.6-1.5H17V4.2c-.8-.1-1.6-.2-2.4-.2-2.4 0-4.1 1.5-4.1 4.2v2.1H7.8v3h2.7V21h3.2Z" />
    </svg>
  );
}

function SocialIcon({ name, size = 19 }: { name?: string; size?: number }) {
  if (name === 'instagram') return <Instagram size={size} />;
  if (name === 'facebook') return <Facebook size={size} />;
  return <MessageCircle size={size} />;
}

export default function FooterSection({ sanityData, sanitySettings, sanityServices }: Props) {
  const d = sanityData;
  const s = sanitySettings;
  const currentYear = new Date().getFullYear();

  // CTA: el destino se mantiene fijo hacia Contacto para centralizar la cotización.
  const ctaEyebrow = d?.ctaEyebrow || 'Hagamos que tu celebración se sienta inolvidable';
  const ctaTitleText = d?.ctaTitle || 'Cada detalle puede contar una historia.';
  const ctaHighlight = d?.ctaHighlightWord || ' Empecemos por la tuya.';
  const ctaButtonLabel = d?.ctaButtonLabel || 'Cotiza ahora';
  const ctaButtonLink = '#contacto';

  const navColumnTitle = cleanText(d?.navColumnTitle) || 'Explorar';
  const servicesColumnTitle = cleanText(d?.servicesColumnTitle) || 'Servicios';
  const contactTitle = cleanText(d?.contactTitle) || 'Contacto';

  // Navegación fija del footer.
  const navLinks = [{ title: navColumnTitle, links: fallbackNavigationLinks, visible: true, order: 0 }];

  // Servicios: se toman de la misma lista editable de Servicios.
  const serviceLinks = sanityServices?.services?.length
    ? sanityServices.services
      .filter((service) => service.visible !== false && service.title)
      .map((service) => ({ text: service.title || '', link: '#servicios', visible: true }))
    : fallbackServiceLinks.map((text) => ({ text, link: '#servicios', visible: true }));

  // Contacto: todo viene desde Datos generales del sitio.
  const contactPhone = formatPhoneDisplay(s?.whatsapp) || '922459810';
  const contactEmail = s?.email || CONTACT_EMAIL;
  const quoteEmail = s?.quoteEmail || QUOTE_EMAIL;
  const contactLocation = s?.location || 'Lima, Perú';
  const contactSchedule = s?.schedule || 'Lunes a viernes 9am a 7pm. Sábados previa coordinación.';
  const phoneUrl = normalizeWhatsappUrl(s?.whatsapp) || WHATSAPP_URL;

  // Socials: se toman solo de Datos generales.
  const socialLinks: SocialLink[] = s?.socialLinks?.length
    ? s.socialLinks.filter((l) => l.visible !== false)
    : [
      {
        name: 'Instagram',
        url: '#',
        icon: 'Instagram',
        borderColor: '#d2ab80',
        visible: true,
      },
    ];

  const brandText = cleanText(d?.brandText) || 'Bodas, eventos, catering y decoración con una mirada cálida, elegante y profundamente cuidada.';
  const footerBgImage = getFooterBackgroundUrl(d);
  const companyName = s?.companyName || 'KARIN CADENAS BODAS & EVENTOS';
  const footerLogo = resolveImageWithUrl(s?.logo, s?.logoUrl, '', 'logo');
  const logoInitial = companyName.trim().charAt(0).toUpperCase() || 'K';
  // Legal del footer debe venir del documento Footer, no de Datos generales,
  // para evitar que aparezca texto viejo/lorem del siteSettings.
  const legalText = cleanText(d?.legalText) || `© ${currentYear} ${companyName}. Todos los derechos reservados.`;
  const madeWithLine = cleanText(d?.madeWithLine) || 'Hecho con amor y cariño 💚 para celebraciones memorables.';
  const backToTopLabel = cleanText(d?.backToTopLabel) || 'Volver arriba';

  return (
    <footer
      id="footer"
      className={`${styles.footer} ${footerBgImage ? styles.footerWithImage : ''}`}
      style={
        footerBgImage
          ? ({ '--footer-bg-image': `url("${footerBgImage}")` } as CSSProperties)
          : undefined
      }
    >
      {footerBgImage ? (
        <div
          className={styles.sanityBackgroundImage}
          style={{ backgroundImage: `url("${footerBgImage}")` }}
          aria-hidden="true"
        />
      ) : null}
      <div className={styles.aurora} aria-hidden="true">
        <span className={`${styles.auroraBand} ${styles.auroraOne}`} />
        <span className={`${styles.auroraBand} ${styles.auroraTwo}`} />
        <span className={`${styles.auroraBand} ${styles.auroraThree}`} />
        <span className={`${styles.auroraBand} ${styles.auroraFour}`} />
      </div>
      <div className={styles.velvetLayer} aria-hidden="true" />
      <div className={styles.lightLine} aria-hidden="true" />
      <div className={`${styles.orbitalMark} ${styles.orbitalMarkOne}`} aria-hidden="true"><span /></div>
      <div className={`${styles.orbitalMark} ${styles.orbitalMarkTwo}`} aria-hidden="true"><span /></div>
      <div className={styles.floatingMotifs} aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => <span key={i} />)}
      </div>

      <div className={styles.container}>
        {/* CTA panel */}
        <section className={styles.ctaPanel} aria-labelledby="footer-cta-title">
          <div className={styles.ctaGlow} aria-hidden="true" />
          <div className={styles.ctaCopy}>
            <span className={styles.eyebrow}>
              <Sparkles size={15} />
              {ctaEyebrow}
            </span>
            <h2 id="footer-cta-title">
              {ctaTitleText}
              <em>{ctaHighlight}</em>
            </h2>
          </div>
          <a className={styles.primaryCta} href={ctaButtonLink} aria-label={ctaButtonLabel}>
            <MessageCircle size={19} />
            {ctaButtonLabel}
            <ArrowUpRight size={17} />
          </a>
        </section>

        {/* Main footer grid */}
        <div className={styles.footerMain}>
          <div className={styles.brandBlock}>
            <a href="#inicio" className={styles.logo} aria-label="Ir al inicio">
              <span className={`${styles.logoMark} ${footerLogo ? styles.logoMarkImage : ''}`}>
                {footerLogo ? (
                  <img
                    src={footerLogo}
                    alt={`Logo de ${companyName}`}
                    className={styles.logoImage}
                    loading="lazy"
                  />
                ) : (
                  logoInitial
                )}
              </span>
              <strong>{companyName}</strong>
            </a>
            <p>{brandText}</p>
            <div className={styles.socialLinks} aria-label="Redes sociales">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.name}
                  className={styles.socialItem}
                  style={social.borderColor ? { '--social-border-color': social.borderColor } as CSSProperties : undefined}
                >
                  <SocialIcon name={social.icon || social.name} size={19} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation columns */}
          {navLinks.map((col) => (
            <nav key={col.title} className={styles.footerColumn} aria-label={`Navegación: ${col.title}`}>
              <h3>{col.title}</h3>
              <ul>
                {(col.links || []).map((link) => (
                  <li key={link.href || link.label}>
                    <a href={link.href || '#'}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Services column */}
          <div className={styles.footerColumn}>
            <h3>{servicesColumnTitle}</h3>
            <ul>
              {serviceLinks.map((svc) => (
                <li key={svc.text}>
                  <a href={svc.link || '#servicios'}>{svc.text}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <address className={styles.contactCard}>
            <h3>{contactTitle}</h3>
            <a href={phoneUrl} target="_blank" rel="noreferrer">
              <Phone size={17} /><span>{contactPhone}</span>
            </a>
            <a href={`mailto:${contactEmail}`}>
              <Mail size={17} /><span>{contactEmail}</span>
            </a>
            {quoteEmail && quoteEmail !== contactEmail ? (
              <a href={`mailto:${quoteEmail}`}>
                <Mail size={17} /><span>Cotizaciones: {quoteEmail}</span>
              </a>
            ) : null}
            <span><MapPin size={17} /><span>{contactLocation}</span></span>
            <span><Clock3 size={17} /><span>{contactSchedule}</span></span>
          </address>
        </div>

        {/* Bottom bar */}
        <div className={styles.footerBottom}>
          <p>{legalText}</p>
          {madeWithLine ? (
            <p className={styles.madeWith}>{madeWithLine}</p>
          ) : null}
          <a className={styles.backToTop} href="#inicio" aria-label="Volver al inicio">
            {backToTopLabel}
            <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
    </footer>
  );
}
