'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ImageOff,
  Play,
  Sparkles,
  X,
} from 'lucide-react';
import styles from './page.module.css';
import { resolveImageWithUrl } from '@/sanity/image';
import type { CatalogData, CatalogItem } from '@/sanity/types';

type FallbackCatalogItem = {
  title: string;
  category?: string;
  description?: string;
  imageSrc: string;
  imageAlt: string;
  visible?: boolean;
};

type CatalogMedia =
  | { type: 'image'; src: string; alt: string }
  | { type: 'youtube'; src: string; embedUrl: string; poster?: string; alt: string }
  | { type: 'video'; src: string; poster?: string; alt: string };

type CatalogEntry = {
  key: string;
  title: string;
  category: string;
  description: string;
  media?: CatalogMedia;
};

type CatalogPageClientProps = {
  catalog?: CatalogData;
  fallbackItems: FallbackCatalogItem[];
};

const OTHER_CATEGORY = 'Otros';
const ALL_CATEGORY = 'Todos';

function cleanText(value?: string | null) {
  return value?.trim() || '';
}

function normalizeCategory(value?: string | null) {
  return cleanText(value) || OTHER_CATEGORY;
}

function isYouTubeUrl(value?: string | null) {
  return /(?:youtube\.com|youtu\.be|youtube-nocookie\.com)/i.test(cleanText(value));
}

function getYouTubeId(url?: string | null) {
  const cleanUrl = cleanText(url);
  if (!cleanUrl) return '';

  try {
    const parsed = new URL(cleanUrl);
    const hostname = parsed.hostname.replace(/^www\./, '').replace(/^m\./, '');
    const parts = parsed.pathname.split('/').filter(Boolean);

    if (hostname === 'youtu.be') return parts[0] || '';

    if (hostname === 'youtube.com' || hostname === 'youtube-nocookie.com') {
      if (parsed.pathname === '/watch') return parsed.searchParams.get('v') || '';
      if (['shorts', 'embed', 'live', 'v'].includes(parts[0])) return parts[1] || '';
    }
  } catch {
    const match = cleanUrl.match(
      /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|shorts\/|embed\/|live\/|v\/)|v=)([A-Za-z0-9_-]{6,})/,
    );
    return match?.[1] || '';
  }

  return '';
}

function getYouTubeEmbedUrl(url?: string | null) {
  const id = getYouTubeId(url);
  if (!id) return '';

  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  });

  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

function getYouTubePoster(url?: string | null) {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
}

function getCatalogYoutubeUrl(item: CatalogItem) {
  return [item.youtubeUrl, item.videoUrl, item.youtubeLink, item.videoLink, item.url, item.link].find(
    (candidate) => isYouTubeUrl(candidate),
  ) || '';
}

function getCatalogImage(item: CatalogItem) {
  return item.image || item.thumbnail;
}

function getVideoPosterImage(item: CatalogItem) {
  return item.coverImage || item.posterImage || item.thumbnail;
}

function buildCatalogEntries(catalog?: CatalogData, fallbackItems: FallbackCatalogItem[] = []) {
  if (catalog?.visible === false) return [];

  if (!catalog?.items?.length) {
    return fallbackItems
      .filter((item) => item.visible !== false)
      .map<CatalogEntry>((item, index) => ({
        key: `fallback-${index}-${item.title}`,
        title: item.title,
        category: normalizeCategory(item.category),
        description: item.description || '',
        media: {
          type: 'image',
          src: item.imageSrc,
          alt: item.imageAlt || item.title,
        },
      }));
  }

  return catalog.items
    .filter((item) => item.visible !== false)
    .map<CatalogEntry>((item, index) => {
      const mediaType = cleanText(item.mediaType).toLowerCase();
      const youtubeUrl = getCatalogYoutubeUrl(item);
      const legacyVideoUrl = cleanText(item.legacyVideoAssetUrl);
      const isYoutube = Boolean(youtubeUrl) || mediaType === 'youtube';
      const isVideo = !isYoutube && (mediaType === 'video' || Boolean(legacyVideoUrl));
      const posterImage = getVideoPosterImage(item);
      const poster = resolveImageWithUrl(
        posterImage,
        item.coverImageUrl || item.posterImageUrl || item.thumbnailUrl,
        '',
        'thumbnail',
      );

      let media: CatalogMedia | undefined;

      if (isYoutube) {
        media = {
          type: 'youtube',
          src: youtubeUrl,
          embedUrl: getYouTubeEmbedUrl(youtubeUrl),
          poster: poster || getYouTubePoster(youtubeUrl),
          alt: item.coverAlt || item.posterAlt || item.thumbnailAlt || item.title || 'Video del catálogo',
        };
      } else if (isVideo && legacyVideoUrl) {
        media = {
          type: 'video',
          src: legacyVideoUrl,
          poster,
          alt: item.coverAlt || item.posterAlt || item.thumbnailAlt || item.title || 'Video del catálogo',
        };
      } else {
        const image = getCatalogImage(item);
        const imageSrc = resolveImageWithUrl(
          image,
          item.imageUrl || item.thumbnailUrl,
          '',
          'card',
        );

        if (imageSrc) {
          media = {
            type: 'image',
            src: imageSrc,
            alt: item.imageAlt || item.thumbnailAlt || item.title || 'Foto del catálogo',
          };
        }
      }

      return {
        key: item._key || `catalog-${index}-${item.title || 'item'}`,
        title: item.title || 'Contenido del catálogo',
        category: normalizeCategory(item.category),
        description: item.description || '',
        media,
      };
    });
}

function getFocusableElements(container: HTMLElement | null) {
  if (!container) return [];

  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), iframe, video, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute('disabled'));
}

export default function CatalogPageClient({
  catalog,
  fallbackItems,
}: CatalogPageClientProps) {
  const entries = useMemo(
    () => buildCatalogEntries(catalog, fallbackItems),
    [catalog, fallbackItems],
  );
  const categories = useMemo(() => {
    const unique = Array.from(new Set(entries.map((entry) => entry.category)));
    return [ALL_CATEGORY, ...unique.sort((a, b) => a.localeCompare(b, 'es'))];
  }, [entries]);

  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const filteredEntries = useMemo(() => {
    if (activeCategory === ALL_CATEGORY) return entries;
    return entries.filter((entry) => entry.category === activeCategory);
  }, [activeCategory, entries]);

  const selectedEntry =
    selectedIndex !== null ? filteredEntries[selectedIndex] || null : null;

  const closeModal = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const openModal = (index: number) => {
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    setSelectedIndex(index);
  };

  const goTo = useCallback(
    (direction: 'prev' | 'next') => {
      setSelectedIndex((current) => {
        if (current === null || !filteredEntries.length) return current;
        return direction === 'next'
          ? (current + 1) % filteredEntries.length
          : (current - 1 + filteredEntries.length) % filteredEntries.length;
      });
    },
    [filteredEntries.length],
  );

  useEffect(() => {
    if (!selectedEntry) return;

    const originalOverflow = document.body.style.overflow;
    const previouslyFocused = lastFocusedRef.current || (document.activeElement as HTMLElement | null);
    document.body.style.overflow = 'hidden';

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
        return;
      }

      if (event.key === 'ArrowRight') {
        goTo('next');
        return;
      }

      if (event.key === 'ArrowLeft') {
        goTo('prev');
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = getFocusableElements(modalRef.current);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKey);
    window.requestAnimationFrame(() => getFocusableElements(modalRef.current)[0]?.focus());

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKey);
      previouslyFocused?.focus?.();
      lastFocusedRef.current = null;
    };
  }, [closeModal, goTo, selectedEntry]);

  return (
    <section className={styles.catalogShell} aria-label="Catálogo completo">
      <div className={styles.filterBar} aria-label="Filtrar catálogo por categoría">
        {categories.map((category) => {
          const isActive = category === activeCategory;
          const count = category === ALL_CATEGORY
            ? entries.length
            : entries.filter((entry) => entry.category === category).length;

          return (
            <button
              key={category}
              type="button"
              className={isActive ? styles.activeFilter : ''}
              onClick={() => {
                setSelectedIndex(null);
                setActiveCategory(category);
              }}
              aria-pressed={isActive}
            >
              <span>{category}</span>
              <small>{count}</small>
            </button>
          );
        })}
      </div>

      <div className={styles.galleryMeta}>
        <span>
          <Sparkles size={14} />
          {activeCategory}
        </span>
        <p>{filteredEntries.length} piezas visibles</p>
      </div>

      {entries.length ? (
        filteredEntries.length ? (
          <div className={styles.grid}>
            {filteredEntries.map((entry, index) => (
              <button
                key={entry.key}
                type="button"
                className={styles.card}
                onClick={() => openModal(index)}
                aria-label={`Abrir ${entry.title}`}
              >
                <div className={styles.mediaFrame}>
                  {entry.media?.type === 'image' ? (
                    <Image
                      src={entry.media.src}
                      alt={entry.media.alt}
                      fill
                      className={styles.cardImage}
                      sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 25vw"
                      quality={72}
                    />
                  ) : entry.media?.poster ? (
                    <Image
                      src={entry.media.poster}
                      alt={entry.media.alt}
                      fill
                      className={styles.cardImage}
                      sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 25vw"
                      quality={64}
                    />
                  ) : (
                    <div className={styles.placeholder}>
                      {entry.media?.type === 'video' || entry.media?.type === 'youtube' ? (
                        <Play size={22} fill="currentColor" />
                      ) : (
                        <ImageOff size={22} />
                      )}
                    </div>
                  )}
                  {entry.media?.type !== 'image' ? (
                    <span className={styles.videoBadge}>
                      <Play size={12} fill="currentColor" />
                      Video
                    </span>
                  ) : null}
                  <span className={styles.mediaShade} aria-hidden="true" />
                </div>
                <div className={styles.cardContent}>
                  <span>{entry.category}</span>
                  <h2>{entry.title}</h2>
                  {entry.description ? <p>{entry.description}</p> : null}
                  <div className={styles.cardFooter}>
                    <span className={styles.cardAction}>
                      Ver detalle <ArrowUpRight size={15} />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Sparkles size={22} />
            <h2>No hay piezas en esta categoría</h2>
            <p>Elige otra categoría para seguir explorando el catálogo.</p>
          </div>
        )
      ) : (
        <div className={styles.emptyState}>
          <ImageOff size={24} />
          <h2>Catálogo en preparación</h2>
          <p>Cuando se activen fotos o videos en Sanity, aparecerán aquí automáticamente.</p>
        </div>
      )}

      {selectedEntry ? (
        <div className={styles.modalBackdrop} onClick={closeModal}>
          <div
            ref={modalRef}
            className={styles.modalPanel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="catalog-modal-title"
            onClick={(event) => event.stopPropagation()}
            tabIndex={-1}
          >
            <div className={styles.modalTopbar}>
              <div>
                <span>{selectedEntry.category}</span>
                <h2 id="catalog-modal-title">{selectedEntry.title}</h2>
              </div>
              <button type="button" onClick={closeModal} aria-label="Cerrar">
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalStage}>
              {filteredEntries.length > 1 ? (
                <button
                  type="button"
                  className={`${styles.modalArrow} ${styles.modalArrowLeft}`}
                  onClick={() => goTo('prev')}
                  aria-label="Ver anterior"
                >
                  <ArrowLeft size={20} />
                </button>
              ) : null}

              {selectedEntry.media?.type === 'image' ? (
                <Image
                  key={selectedEntry.media.src}
                  src={selectedEntry.media.src}
                  alt={selectedEntry.media.alt}
                  fill
                  className={styles.modalImage}
                  sizes="100vw"
                  priority
                  quality={82}
                />
              ) : selectedEntry.media?.type === 'youtube' && selectedEntry.media.embedUrl ? (
                <iframe
                  key={selectedEntry.media.embedUrl}
                  className={styles.youtubeFrame}
                  src={selectedEntry.media.embedUrl}
                  title={selectedEntry.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : selectedEntry.media?.type === 'video' ? (
                <video
                  key={selectedEntry.media.src}
                  className={styles.modalVideo}
                  controls
                  preload="metadata"
                  poster={selectedEntry.media.poster}
                >
                  <source src={selectedEntry.media.src} />
                </video>
              ) : (
                <div className={styles.modalPlaceholder}>
                  <ImageOff size={34} />
                  <span>Medio por definir</span>
                </div>
              )}

              {filteredEntries.length > 1 ? (
                <button
                  type="button"
                  className={`${styles.modalArrow} ${styles.modalArrowRight}`}
                  onClick={() => goTo('next')}
                  aria-label="Ver siguiente"
                >
                  <ArrowRight size={20} />
                </button>
              ) : null}
            </div>

            <div className={styles.modalBottom}>
              {selectedEntry.description ? <p>{selectedEntry.description}</p> : <p>Selección visual de Karin Eventos.</p>}
              <div className={styles.thumbnails}>
                {filteredEntries.map((entry, index) => (
                  <button
                    key={`${entry.key}-thumb`}
                    type="button"
                    className={index === selectedIndex ? styles.activeThumb : ''}
                    onClick={() => setSelectedIndex(index)}
                    aria-label={`Ver ${entry.title}`}
                  >
                    {entry.media?.type === 'image' ? (
                      <Image src={entry.media.src} alt="" fill className={styles.thumbImage} sizes="72px" quality={52} />
                    ) : entry.media?.poster ? (
                      <Image src={entry.media.poster} alt="" fill className={styles.thumbImage} sizes="72px" quality={48} />
                    ) : (
                      <Play size={15} fill="currentColor" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
