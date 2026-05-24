'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import styles from './HeroSection.module.css';
import type { HeroData, SiteSettingsData } from '@/sanity/types';
import { resolveIcon } from '@/sanity/icons';
import { resolveImageWithUrl } from '@/sanity/image';
import { normalizeCmsHref } from '@/lib/links';
import {
  fallbackFlipWords,
  fallbackHeroCards,
  fallbackFloatingNotes,
} from '@/data/fallbacks';

type HeroProps = {
  sanityData?: HeroData;
  sanitySettings?: SiteSettingsData;
};

const morphPath =
  'M328.5 73.3C371.6 111.8 398.7 172.1 383.6 220.6C368.5 269.1 311.2 305.9 256.5 337C201.8 368.1 149.7 393.7 105.5 376.8C61.3 359.9 25.1 300.5 29.1 246.1C33.1 191.7 77.3 142.3 120 103.4C162.7 64.5 203.9 36.1 242.5 35.1C281.1 34.1 285.4 34.8 328.5 73.3Z';

export default function Hero({ sanityData }: HeroProps) {
  const d = sanityData;

  const heroRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(heroRef, { amount: 0.25 });
  const reduceMotion = useReducedMotion();
  const [activeCard, setActiveCard] = useState(0);
  const [activeFlipWord, setActiveFlipWord] = useState(0);

  // Resolve CMS data with fallbacks
  const bgImage = resolveImageWithUrl(d?.backgroundImage, d?.backgroundImageUrl, '/images/_miscelanea/velas.webp', 'hero');
  const bgAlt = d?.backgroundAlt || 'Evento elegante decorado por Karin Cadenas Eventos';
  const eyebrow = d?.eyebrow || 'Wedding planner en Lima';
  const titleLine1 = d?.titleLine1 || 'Cada evento puede contar una historia.';
  const highlightWord =
    d?.highlightWord ||
    [d?.titleLine2, d?.titleLine3].filter(Boolean).join(' ') ||
    'Empecemos por la tuya.';
  const subtitle = d?.subtitle || 'Creamos celebraciones personalizadas con detalles sofisticados y coordinación impecable.';
  const flipWords = useMemo(() => {
    const words = (d?.flipWords?.length ? d.flipWords : fallbackFlipWords).filter(Boolean);
    return (words.length ? words : fallbackFlipWords).slice(0, 3);
  }, [d?.flipWords]);

  const ctaPrimaryLabel = d?.ctaPrimary?.label || 'Cotiza ahora';
  const primaryHref = normalizeCmsHref(d?.ctaPrimary?.href, '#contacto');

  const ctaSecondaryLabel = d?.ctaSecondary?.label || 'Ver portafolio';
  const ctaSecondaryHref = normalizeCmsHref(d?.ctaSecondary?.href, '#catalogo');

  const heroCards = useMemo(() => {
    const raw = d?.featureCards?.length
      ? d.featureCards.filter((c) => c.visible !== false)
      : fallbackHeroCards;
    return raw.map((c) => ({
      eyebrow: c.eyebrow || '',
      title: c.title || '',
      text: c.description || '',
      Icon: resolveIcon(c.icon),
      DividerIcon: Sparkles,
    }));
  }, [d]);

  const floatingNotes = useMemo(() => {
    const raw = d?.floatingNotes?.length
      ? d.floatingNotes.filter((n) => n.visible !== false)
      : fallbackFloatingNotes;
    return raw.map((n) => ({
      text: n.text || '',
      Icon: resolveIcon(n.icon),
    }));
  }, [d]);

  const particleIndexes = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);

  useEffect(() => {
    if (reduceMotion || !isInView) return;
    const timer = window.setInterval(() => {
      setActiveCard((c) => (c + 1) % heroCards.length);
    }, 5600);
    return () => window.clearInterval(timer);
  }, [isInView, reduceMotion, heroCards.length]);

  useEffect(() => {
    if (reduceMotion || flipWords.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveFlipWord((index) => (index + 1) % flipWords.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, [flipWords.length, reduceMotion]);

  const ambientClass = useMemo(() => {
    const pausedClass = reduceMotion || !isInView ? styles['hero-paused'] : '';
    return `${styles.hero} ${pausedClass}`;
  }, [isInView, reduceMotion]);

  const card = heroCards[activeCard] || heroCards[0];
  if (!card) return null;
  const CurrentIcon = card.Icon;
  const DividerIcon = card.DividerIcon;
  const activeFlipIndex = activeFlipWord % flipWords.length;
  const currentFlipWord = flipWords[activeFlipIndex] || flipWords[0] || '';

  return (
    <section ref={heroRef} className={ambientClass} id="inicio">
      <Image
        src={bgImage}
        alt={bgAlt}
        className={styles['hero-image']}
        fill
        priority
        sizes="100vw"
        quality={72}
      />

      <div className={styles['hero-overlay']} />

      <div className={styles['hero-mesh']} aria-hidden="true">
        <span className={`${styles['mesh-blob']} ${styles['blob-one']}`} />
        <span className={`${styles['mesh-blob']} ${styles['blob-two']}`} />
        <span className={`${styles['mesh-blob']} ${styles['blob-three']}`} />
      </div>

      <svg className={styles['hero-morph']} viewBox="0 0 420 420" aria-hidden="true">
        <path d={morphPath} />
      </svg>

      <svg
        className={`${styles['hero-morph']} ${styles['hero-morph-left']}`}
        viewBox="0 0 420 420"
        aria-hidden="true"
      >
        <path d={morphPath} />
      </svg>

      <div className={styles['hero-animated-lines']} aria-hidden="true">
        <span className={`${styles['hero-line']} ${styles['line-a']}`} />
        <span className={`${styles['hero-line']} ${styles['line-b']}`} />
        <span className={`${styles['hero-line']} ${styles['line-c']}`} />
      </div>

      <div className={styles['hero-particles']} aria-hidden="true">
        {particleIndexes.map((index) => (
          <span key={index} style={{ '--particle-index': index } as CSSProperties} />
        ))}
      </div>

      <div className={`${styles['hero-content']} ${styles.container}`}>
        <div className={styles['hero-copy']}>
          <div className={styles['hero-kicker']}>
            <Sparkles size={16} />
            {eyebrow}
          </div>

          <h1 className={styles['hero-title']}>
            <span>{titleLine1}</span>
            <span>
              <em>{highlightWord}</em>
            </span>
          </h1>

          <div
            className={styles['hero-flip-line']}
            aria-label={`Especialistas en ${flipWords.join(', ')}`}
          >
            Especialistas en&nbsp;
            <span className={styles['word-rotator']} aria-hidden="true">
              {reduceMotion ? (
                <span
                  className={`${styles['word-rotator-word']} ${
                    activeFlipIndex % 2 === 0 ? styles['word-vanilla'] : styles['word-pistachio']
                  }`}
                >
                  {currentFlipWord}
                </span>
              ) : (
                <AnimatePresence initial={false}>
                  <motion.span
                    key={`${activeFlipIndex}-${currentFlipWord}`}
                    className={`${styles['word-rotator-word']} ${
                      activeFlipIndex % 2 === 0 ? styles['word-vanilla'] : styles['word-pistachio']
                    }`}
                    initial={{ opacity: 0, y: '1.45em', rotateX: -24 }}
                    animate={{ opacity: 1, y: '0em', rotateX: 0 }}
                    exit={{ opacity: 0, y: '-1.45em', rotateX: 24 }}
                    transition={{
                      duration: 0.56,
                      ease: [0.45, 0, 0.2, 1],
                    }}
                  >
                    {currentFlipWord}
                  </motion.span>
                </AnimatePresence>
              )}
            </span>
          </div>

          <p className={styles['hero-subtitle']}>{subtitle}</p>

          <div className={styles['hero-actions']}>
            <a
              className={`${styles.button} ${styles.primary} ${styles['magnetic-button']}`}
              href={primaryHref}
              target={primaryHref.startsWith('http') ? '_blank' : undefined}
              rel={primaryHref.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {ctaPrimaryLabel} <ArrowRight size={18} />
            </a>

            <a className={`${styles.button} ${styles.secondary}`} href={ctaSecondaryHref}>
              {ctaSecondaryLabel}
            </a>
          </div>
        </div>

        <div className={styles['hero-stack']} aria-label="Resumen de servicios destacados">
          <div className={styles['hero-feature-shell']}>
            <AnimatePresence mode="wait">
              <motion.article
                key={activeCard}
                className={styles['hero-feature-card']}
                initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.985 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -8, scale: 0.985 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className={styles['hero-feature-top']}>
                  <div className={styles['hero-feature-icon']}>
                    <CurrentIcon size={22} />
                  </div>
                  <span className={styles['hero-feature-eyebrow']}>{card.eyebrow}</span>
                </div>

                <h2>{card.title}</h2>

                <div className={styles['hero-feature-divider']}>
                  <span className={styles['hero-feature-line-track']}>
                    <span
                      key={`progress-${activeCard}`}
                      className={styles['hero-feature-line-fill']}
                    />
                  </span>
                  <span className={styles['hero-feature-divider-icon']}>
                    <DividerIcon size={15} />
                  </span>
                </div>

                <p>{card.text}</p>
              </motion.article>
            </AnimatePresence>
          </div>

          <div className={styles['hero-floating-cards']} aria-hidden="true">
            {floatingNotes.slice(0, 2).map((note, i) => {
              const NoteIcon = note.Icon;
              return (
                <div
                  key={note.text}
                  className={`${styles['floating-note']} ${i === 0 ? styles['note-one'] : styles['note-two']}`}
                >
                  <NoteIcon size={18} />
                  <span>{note.text}</span>
                </div>
              );
            })}
          </div>

          <div className={styles['hero-stack-dots']} aria-label="Cambiar tarjeta destacada">
            {heroCards.map((c, index) => (
              <button
                key={c.title}
                type="button"
                onClick={() => setActiveCard(index)}
                className={index === activeCard ? styles.active : ''}
                aria-label={`Ver ${c.eyebrow}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles['scroll-cue']} aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
