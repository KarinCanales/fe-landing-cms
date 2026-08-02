'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ImageOff,
  Minimize2,
  Minus,
  Play,
  Plus,
  Sparkles,
  X,
} from 'lucide-react';
import styles from './CatalogSection.module.css';
import type { CatalogData, CatalogItem } from '@/sanity/types';
import { resolveImageWithUrl } from '@/sanity/image';
import { fallbackCatalogItems } from '@/data/fallbacks';

type Props = { sanityData?: CatalogData };

type CatalogMedia =
  | { type: 'image'; src: string; alt: string }
  | {
      type: 'youtube';
      src: string;
      id: string;
      embedUrl: string;
      poster?: string;
      alt: string;
    };

type GalleryEntry = {
  itemIndex: number;
  mediaIndex: number;
  title: string;
  category: string;
  description: string;
  media?: CatalogMedia;
};

type Pan = { x: number; y: number };

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  initialX: number;
  initialY: number;
} | null;

type FlexibleCatalogItem = CatalogItem & {
  youtubeLink?: string;
  videoLink?: string;
  url?: string;
  link?: string;
  posterImage?: CatalogItem['coverImage'];
  posterAlt?: string;
  legacyVideoAssetUrl?: string;
};

function normalizeUrl(value?: string | null) {
  return typeof value === 'string' ? value.trim() : '';
}

function isYouTubeUrl(value?: string | null) {
  const cleanUrl = normalizeUrl(value);
  return /(?:youtube\.com|youtu\.be|youtube-nocookie\.com)/i.test(cleanUrl);
}

function getYouTubeId(url?: string | null) {
  const cleanUrl = normalizeUrl(url);

  if (!cleanUrl) return '';

  try {
    const parsed = new URL(cleanUrl);
    const hostname = parsed.hostname.replace(/^www\./, '').replace(/^m\./, '');
    const parts = parsed.pathname.split('/').filter(Boolean);

    if (hostname === 'youtu.be') {
      return parts[0] || '';
    }

    if (hostname === 'youtube.com' || hostname === 'youtube-nocookie.com') {
      if (parsed.pathname === '/watch') return parsed.searchParams.get('v') || '';
      if (parts[0] === 'shorts') return parts[1] || '';
      if (parts[0] === 'embed') return parts[1] || '';
      if (parts[0] === 'live') return parts[1] || '';
      if (parts[0] === 'v') return parts[1] || '';
    }
  } catch {
    const match = cleanUrl.match(
      /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|shorts\/|embed\/|live\/|v\/)|v=)([A-Za-z0-9_-]{6,})/,
    );

    return match?.[1] || '';
  }

  const fallbackMatch = cleanUrl.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([A-Za-z0-9_-]{6,})/);
  return fallbackMatch?.[1] || '';
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
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : undefined;
}

function getCatalogYoutubeUrl(item: FlexibleCatalogItem) {
  const candidates = [
    item.youtubeUrl,
    item.videoUrl,
    item.youtubeLink,
    item.videoLink,
    item.url,
    item.link,
  ];

  return candidates.find((candidate) => isYouTubeUrl(candidate)) || '';
}

function getNormalizedMediaType(item: FlexibleCatalogItem) {
  return String(item.mediaType || '').trim().toLowerCase();
}

function shouldTreatAsYoutube(item: FlexibleCatalogItem) {
  const mediaType = getNormalizedMediaType(item);
  return Boolean(getCatalogYoutubeUrl(item)) || mediaType === 'youtube' || mediaType === 'video';
}

function getCatalogImage(item: FlexibleCatalogItem) {
  return item.image || item.thumbnail;
}

function getVideoPosterImage(item: FlexibleCatalogItem) {
  return item.coverImage || item.posterImage || item.thumbnail;
}

function getFocusableElements(container: HTMLElement | null) {
  if (!container) return [];

  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), iframe, input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute('disabled'));
}

export default function CatalogSection({ sanityData }: Props) {
  const d = sanityData;

  const eyebrow = d?.eyebrow || 'Catálogo visual';
  const titleText = d?.title || 'Un archivo visual de';
  const highlightWord = d?.highlightWord || 'momentos y detalles.';
  const supportText =
    d?.supportText ||
    'Explora montajes, texturas, mesas, ambientes y piezas visuales. Cada elemento puede ser una foto subida al panel o un video enlazado desde YouTube.';
  const backgroundImage = resolveImageWithUrl(d?.backgroundImage, d?.backgroundImageUrl, '', 'background');

  const galleryEntries: GalleryEntry[] = useMemo(() => {
    if (!d?.items?.length) {
      return fallbackCatalogItems.map((item, idx) => ({
        itemIndex: idx,
        mediaIndex: 0,
        title: item.title,
        category: item.category,
        description: item.description,
        media: {
          type: 'image' as const,
          src: item.imageSrc,
          alt: item.imageAlt,
        },
      }));
    }

    return d.items
      .filter((item) => item.visible !== false)
      .slice()
      .map((rawItem, idx) => {
        const item = rawItem as FlexibleCatalogItem;
        let media: CatalogMedia | undefined;
        const isYoutube = shouldTreatAsYoutube(item);

        if (isYoutube) {
          const youtubeUrl = getCatalogYoutubeUrl(item);
          const youtubeId = getYouTubeId(youtubeUrl);
          const coverFromSanity = getVideoPosterImage(item) ? resolveImageWithUrl(getVideoPosterImage(item), item.coverImageUrl || item.posterImageUrl || item.thumbnailUrl, '', 'thumbnail') : '';

          media = {
            type: 'youtube',
            src: youtubeUrl,
            id: youtubeId,
            embedUrl: getYouTubeEmbedUrl(youtubeUrl),
            poster: coverFromSanity || getYouTubePoster(youtubeUrl),
            alt: item.coverAlt || item.posterAlt || item.thumbnailAlt || item.title || 'Video de YouTube del catálogo',
          };
        } else {
          const image = getCatalogImage(item);

          if (image) {
            media = {
              type: 'image',
              src: resolveImageWithUrl(image, item.imageUrl || item.thumbnailUrl, '/images/5-catalogo/1.webp', 'card'),
              alt: item.imageAlt || item.thumbnailAlt || item.title || 'Foto del catálogo',
            };
          }
        }

        return {
          itemIndex: idx,
          mediaIndex: 0,
          title: item.title || '',
          category: item.category || '',
          description: item.description || '',
          media,
        };
      });
  }, [d]);

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Pan>({ x: 0, y: 0 });
  const [dragState, setDragState] = useState<DragState>(null);
  const [isImmersive, setIsImmersive] = useState(true);
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const modalPanelRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  const visibleEntries = galleryEntries.slice(0, 6);

  const selectedEntry = selectedIdx !== null ? galleryEntries[selectedIdx] ?? null : null;
  const selectedMedia = selectedEntry?.media;
  const isModalOpen = selectedIdx !== null;

  const resetImagePosition = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setDragState(null);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedIdx(null);
    setIsImmersive(false);
    setIsMediaLoading(false);
    resetImagePosition();
  }, [resetImagePosition]);

  useEffect(() => {
    if (!isModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    const previouslyFocused =
      lastFocusedElementRef.current || (document.activeElement as HTMLElement | null);
    document.body.style.overflow = 'hidden';

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
        return;
      }

      if (event.key === 'Tab') {
        const focusable = getFocusableElements(modalPanelRef.current);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!first || !last) return;

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
          return;
        }

        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }

      if (event.key === 'ArrowRight') {
        resetImagePosition();
        setIsMediaLoading(true);
        setSelectedIdx((current) => (current !== null ? (current + 1) % galleryEntries.length : current));
      }

      if (event.key === 'ArrowLeft') {
        resetImagePosition();
        setIsMediaLoading(true);
        setSelectedIdx((current) =>
          current !== null ? (current - 1 + galleryEntries.length) % galleryEntries.length : current,
        );
      }
    };

    window.addEventListener('keydown', handleKey);
    window.requestAnimationFrame(() => {
      getFocusableElements(modalPanelRef.current)[0]?.focus();
    });

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKey);
      previouslyFocused?.focus?.();
      lastFocusedElementRef.current = null;
    };
  }, [closeModal, galleryEntries.length, isModalOpen, resetImagePosition]);

  const openModal = (index: number) => {
    lastFocusedElementRef.current = document.activeElement as HTMLElement | null;
    resetImagePosition();
    setIsImmersive(true);
    setIsMediaLoading(true);
    setSelectedIdx(index);
  };

  const goToEntry = (direction: 'prev' | 'next') => {
    resetImagePosition();
    setIsMediaLoading(true);
    setSelectedIdx((current) => {
      if (current === null) return current;

      return direction === 'next'
        ? (current + 1) % galleryEntries.length
        : (current - 1 + galleryEntries.length) % galleryEntries.length;
    });
  };

  const closeImmersiveViewer = () => {
    closeModal();
  };

  const handleBackdropClick = () => {
    closeModal();
  };

  const handleEmptyStageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;

    closeModal();
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!selectedMedia || selectedMedia.type !== 'image' || zoom <= 1) return;

    event.preventDefault();
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      return;
    }
    setDragState({
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      initialX: pan.x,
      initialY: pan.y,
    });
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    setPan({
      x: dragState.initialX + event.clientX - dragState.startX,
      y: dragState.initialY + event.clientY - dragState.startY,
    });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragState?.pointerId === event.pointerId) {
      try {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
      } catch {}
      setDragState(null);
    }
  };

  const updateZoom = (nextZoom: number) => {
    const normalizedZoom = Math.min(2.8, Math.max(1, +nextZoom.toFixed(2)));
    setZoom(normalizedZoom);

    if (normalizedZoom <= 1) {
      setPan({ x: 0, y: 0 });
      setDragState(null);
    }
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!selectedMedia || selectedMedia.type !== 'image') return;

    event.preventDefault();
    const nextZoom = event.deltaY < 0 ? zoom + 0.16 : zoom - 0.16;
    updateZoom(nextZoom);
  };

  if (d?.visible === false) return null;

  return (
    <>
      <section
        id="catalogo"
        className={styles.catalogSection}
        style={
          backgroundImage
            ? ({ '--catalog-bg-image': `url(${backgroundImage})` } as React.CSSProperties)
            : undefined
        }
      >
        <div className={styles.mediaBackdrop} aria-hidden="true" />
        <div className={styles.catalogAura} aria-hidden="true" />
        <div className={styles.catalogGrain} aria-hidden="true" />
        <div className={styles.orbitalFrame} aria-hidden="true" />
        <div className={styles.floatingPetals} aria-hidden="true">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} />
          ))}
        </div>

        <div className={styles.container}>
          <div className={styles.headingRow}>
            <div className={styles.headingBlock}>
              <span className={styles.eyebrow}>
                <Sparkles size={14} />
                {eyebrow}
              </span>
              <h2 className={styles.title}>
                {titleText} <em>{highlightWord}</em>
              </h2>
            </div>

            <aside className={styles.infoCard}>
              <span className={styles.infoPill}>Selección Karin</span>
              <p>{supportText}</p>
            </aside>
          </div>

          <div className={styles.galleryShell}>
            <div className={styles.galleryIntro}>
              <span>Galería curada</span>
              <p>{galleryEntries.length} piezas disponibles</p>
            </div>

            <motion.div className={styles.gallery}>
              {visibleEntries.map((entry, galleryIndex) => {
                const media = entry.media;

                return (
                  <motion.button
                    key={`${entry.itemIndex}-${entry.mediaIndex}-${entry.title}`}
                    type="button"
                    className={styles.card}
                    onClick={() => openModal(galleryIndex)}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.24 }}
                    transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
                    aria-label={`Abrir ${entry.title}`}
                  >
                    {media ? (
                      <>
                        {media.type === 'image' ? (
                          <Image
                            src={media.src}
                            alt={media.alt}
                            fill
                            className={styles.cardImage}
                            quality={72}
                            sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
                          />
                        ) : media.poster ? (
                          <Image
                            className={`${styles.cardImage} ${styles.youtubePoster}`}
                            src={media.poster}
                            alt={media.alt}
                            fill
                            quality={64}
                            sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
                          />
                        ) : (
                          <div className={styles.placeholder}>
                            <div className={styles.placeholderBadge}>
                              <Play size={16} fill="currentColor" /> Video de YouTube
                            </div>
                            <div className={styles.placeholderOrb} aria-hidden="true" />
                          </div>
                        )}

                        {media.type === 'youtube' && (
                          <span className={styles.videoPill}>
                            <Play size={13} fill="currentColor" /> YouTube
                          </span>
                        )}

                        <div className={styles.imageShade} aria-hidden="true" />
                      </>
                    ) : (
                      <div className={styles.placeholder}>
                        <div className={styles.placeholderBadge}>
                          <ImageOff size={16} /> Imagen por definir
                        </div>
                        <div className={styles.placeholderOrb} aria-hidden="true" />
                      </div>
                    )}

                    <div className={styles.cardContent}>
                      <h3>{entry.title}</h3>
                      {entry.description ? <p>{entry.description}</p> : null}
                      <div className={styles.cardFooter}>
                        <span
                          className={styles.cta}
                        >
                          Ver galería <ArrowUpRight size={16} />
                        </span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>

            {galleryEntries.length > 0 && (
              <Link
                className={styles.showMoreButton}
                href="/catalogo"
              >
                Ver más
                <ArrowUpRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedEntry && (
          <motion.div
            className={`${styles.modalBackdrop} ${isImmersive ? styles.modalBackdropImmersive : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          >
            <motion.div
              ref={modalPanelRef}
              className={`${styles.modalPanel} ${isImmersive ? styles.modalPanelImmersive : ''}`}
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 18 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="catalog-dialog-title"
              aria-describedby="catalog-dialog-description"
              tabIndex={-1}
            >
              <div className={styles.modalTopbar}>
                {isImmersive ? (
                  <>
                    <div className={styles.immersiveTitle}>
                      <span>{selectedEntry.category}</span>
                      <h3 id="catalog-dialog-title">{selectedEntry.title}</h3>
                    </div>
                    <button type="button" className={styles.iconButton} onClick={closeModal} aria-label="Cerrar galería">
                      <X size={20} />
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <span>{selectedEntry.category}</span>
                      <h3 id="catalog-dialog-title">{selectedEntry.title}</h3>
                    </div>
                    <button type="button" className={styles.iconButton} onClick={closeModal} aria-label="Cerrar galería">
                      <X size={20} />
                    </button>
                  </>
                )}
              </div>

              <div className={styles.modalStage} onClick={handleEmptyStageClick}>
                {galleryEntries.length > 1 && (
                  <button
                    type="button"
                    className={`${styles.modalArrow} ${styles.modalArrowLeft}`}
                    onClick={() => goToEntry('prev')}
                    aria-label="Ver medio anterior"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}

                <div className={styles.modalMediaWrap} onClick={handleEmptyStageClick}>
                  {isMediaLoading && selectedMedia?.type === 'image' && (
                    <div className={styles.modalLoader}>
                      <div className={styles.spinner} />
                    </div>
                  )}

                  {selectedMedia ? (
                    selectedMedia.type === 'image' ? (
                      <div
                        className={`${styles.zoomLayer} ${zoom > 1 ? styles.zoomLayerDraggable : ''} ${
                          dragState ? styles.zoomLayerDragging : ''
                        }`}
                        style={{
                          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                          opacity: isMediaLoading ? 0 : 1,
                          transition: 'opacity 200ms ease',
                        }}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                        onWheel={handleWheel}
                      >
                        <Image
                          key={selectedMedia.src}
                          src={selectedMedia.src}
                          alt={selectedMedia.alt}
                          fill
                          className={styles.modalImage}
                          sizes="100vw"
                          priority
                          quality={80}
                          onLoad={() => setIsMediaLoading(false)}
                        />
                      </div>
                    ) : selectedMedia.embedUrl ? (
                      <div className={styles.youtubeFrameShell} onLoad={() => setIsMediaLoading(false)}>
                        <iframe
                          key={selectedMedia.embedUrl}
                          className={styles.youtubeFrame}
                          src={selectedMedia.embedUrl}
                          title={selectedEntry.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                          onLoad={() => setIsMediaLoading(false)}
                        />
                      </div>
                    ) : (
                      <div className={styles.youtubeMissing}>
                        {selectedMedia.poster ? (
                          <Image
                            src={selectedMedia.poster}
                            alt=""
                            fill
                            className={styles.youtubeMissingImage}
                            sizes="100vw"
                            quality={70}
                          />
                        ) : null}
                        <div className={styles.youtubeMissingMessage}>
                          <Play size={30} fill="currentColor" />
                          <span>Falta pegar un enlace válido de YouTube en este elemento.</span>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className={styles.modalPlaceholder}>
                      <ImageOff size={34} />
                      <span>Imagen o video por definir</span>
                    </div>
                  )}
                </div>

                {galleryEntries.length > 1 && (
                  <button
                    type="button"
                    className={`${styles.modalArrow} ${styles.modalArrowRight}`}
                    onClick={() => goToEntry('next')}
                    aria-label="Ver siguiente medio"
                  >
                    <ArrowRight size={20} />
                  </button>
                )}
              </div>

              <div className={styles.modalBottom}>
                <p id="catalog-dialog-description">{selectedEntry.description}</p>
                <div className={styles.zoomControls}>
                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={() => updateZoom(zoom - 0.2)}
                    disabled={!selectedMedia || selectedMedia.type !== 'image' || zoom <= 1}
                    aria-label="Alejar imagen"
                  >
                    <Minus size={18} />
                  </button>
                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={closeImmersiveViewer}
                    disabled={!selectedMedia}
                    aria-label="Cerrar vista amplia"
                  >
                    <Minimize2 size={18} />
                  </button>
                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={() => updateZoom(zoom + 0.2)}
                    disabled={!selectedMedia || selectedMedia.type !== 'image' || zoom >= 2.8}
                    aria-label="Acercar imagen"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div className={styles.thumbnails}>
                {galleryEntries.map((entry, index) => (
                  <button
                    key={`${entry.itemIndex}-${entry.mediaIndex}-${entry.title}`}
                    type="button"
                    className={index === selectedIdx ? styles.activeThumb : ''}
                    onClick={() => {
                      resetImagePosition();
                      setIsMediaLoading(true);
                      setSelectedIdx(index);
                    }}
                    aria-label={`Ver ${entry.media?.type === 'youtube' ? 'video' : 'imagen'} de ${entry.title}`}
                  >
                    {entry.media?.type === 'image' ? (
                      <Image src={entry.media.src} alt="" fill className={styles.thumbImage} sizes="96px" quality={60} />
                    ) : entry.media?.type === 'youtube' ? (
                      <>
                        {entry.media.poster ? (
                          <Image
                            src={entry.media.poster}
                            alt=""
                            fill
                            className={`${styles.thumbImage} ${styles.youtubeThumbImage}`}
                            sizes="96px"
                            quality={50}
                          />
                        ) : (
                          <span className={styles.videoThumbFallback}>
                            <Play size={16} fill="currentColor" />
                          </span>
                        )}
                        <span className={styles.thumbVideoIcon}>
                          <Play size={12} fill="currentColor" />
                        </span>
                      </>
                    ) : (
                      <span className={styles.videoThumbFallback}>
                        <ImageOff size={16} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
