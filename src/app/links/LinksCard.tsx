'use client';

import {useId, useState} from 'react';
import {ArrowUpRight, ChevronDown, Mail, Phone, QrCode, Star} from 'lucide-react';
import styles from './page.module.css';
import {renderIcon} from '@/sanity/icons';
import type {LinksPageLink} from '@/sanity/types';

type LinksCardProps = {
  link: LinksPageLink;
  href: string;
  qrUrl: string;
  isExternal: boolean;
};

function normalizePhoneHref(value?: string | null) {
  const cleanPhone = value?.replace(/\D/g, '') || '';
  return cleanPhone.length >= 8 ? `tel:+${cleanPhone}` : '';
}

export default function LinksCard({link, href, qrUrl, isExternal}: LinksCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const panelId = useId();
  const hasQr = Boolean(qrUrl);
  const hasDetails = Boolean(link.expandableText || link.email || link.phone || hasQr);

  const contactItems = [
    link.email ? {label: link.email, href: `mailto:${link.email}`, icon: Mail} : null,
    link.phone ? {label: link.phone, href: normalizePhoneHref(link.phone), icon: Phone} : null,
  ].filter(Boolean) as Array<{label: string; href: string; icon: typeof Mail}>;

  return (
    <article className={`${styles.linkCard} ${link.featured ? styles.featured : ''}`}>
      <div className={styles.linkMain}>
        <span className={styles.iconWrap} aria-hidden="true">
          {renderIcon(link.icon || 'link', {size: 22, strokeWidth: 1.9})}
        </span>

        <div className={styles.linkCopy}>
          <div className={styles.linkTitleRow}>
            <strong>{link.name}</strong>
            {link.featured ? (
              <span className={styles.featuredBadge}>
                <Star size={13} fill="currentColor" />
                Destacado
              </span>
            ) : null}
          </div>
          {link.description ? <p className={styles.description}>{link.description}</p> : null}
        </div>

        <div className={styles.cardActions}>
          {hasDetails ? (
            <button
              type="button"
              className={styles.expandButton}
              aria-expanded={isExpanded}
              aria-controls={panelId}
              onClick={() => setIsExpanded((current) => !current)}
            >
              <ChevronDown size={18} />
              <span>{isExpanded ? 'Cerrar' : 'Ver más'}</span>
            </button>
          ) : null}
          <a
            className={styles.openButton}
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            aria-label={`Abrir ${link.name}`}
          >
            <ArrowUpRight size={19} />
          </a>
        </div>
      </div>

      <div
        id={panelId}
        className={`${styles.expandPanel} ${isExpanded ? styles.expandPanelOpen : ''}`}
        aria-hidden={!isExpanded}
      >
        <div className={styles.expandPanelInner}>
          {link.expandableText ? <p className={styles.expandText}>{link.expandableText}</p> : null}

          {contactItems.length ? (
            <div className={styles.contactRow}>
              {contactItems.map((item) => {
                const ContactIcon = item.icon;
                return item.href ? (
                  <a key={item.label} href={item.href} className={styles.contactChip}>
                    <ContactIcon size={14} />
                    {item.label}
                  </a>
                ) : null;
              })}
            </div>
          ) : null}

          {hasQr ? (
            <div className={styles.qrBlock}>
              <div className={styles.qrLabel}>
                <QrCode size={14} />
                Escanear enlace
              </div>
              {/* QR externo dinamico: evita ampliar next.config con un host solo para esta imagen. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.qrImage}
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=12&data=${encodeURIComponent(qrUrl)}`}
                alt={`QR para ${link.name}`}
                width="180"
                height="180"
                loading="lazy"
              />
            </div>
          ) : null}

          <a
            className={styles.expandedOpenButton}
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
          >
            Abrir enlace
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </article>
  );
}
