"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Quote,
  Sparkles,
  Star,
} from "lucide-react";
import styles from "./TestimonialsSection.module.css";
import type { TestimonialsData } from "@/sanity/types";
import { resolveImageWithUrl } from "@/sanity/image";
import { fallbackTestimonials } from "@/data/fallbacks";

type Props = { sanityData?: TestimonialsData };

type TestimonialDisplay = {
  names: string;
  event: string;
  quote: string;
  image?: string;
  rating: number;
};

const AUTO_ROTATE_MS = 5200;
const DRAG_THRESHOLD = 54;

function initialsFromName(name: string) {
  return name
    .split("&")
    .map((p) => p.trim().charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("");
}

function normalizeQuoteText(value?: string) {
  return (value || "")
    .replace(/\\u201c/gi, "“")
    .replace(/\\u201d/gi, "”")
    .replace(/\\u2018/gi, "‘")
    .replace(/\\u2019/gi, "’")
    .replace(/&ldquo;|&#8220;/gi, "“")
    .replace(/&rdquo;|&#8221;/gi, "”")
    .replace(/&lsquo;|&#8216;/gi, "‘")
    .replace(/&rsquo;|&#8217;/gi, "’")
    .trim()
    .replace(/^["“”]+/, "")
    .replace(/["“”]+$/, "");
}

function TestimonialPhoto({ src, names }: { src?: string; names: string }) {
  const [hasError, setHasError] = useState(false);
  const shouldShowImage = Boolean(src) && !hasError;

  if (!shouldShowImage) {
    return (
      <div
        className={styles.defaultAvatar}
        aria-label={`Foto pendiente de ${names}`}
      >
        <Camera size={18} />
        <span>{initialsFromName(names)}</span>
      </div>
    );
  }

  return (
    <Image
      src={src as string}
      alt=""
      fill
      sizes="(max-width: 640px) 92px, 108px"
      className={styles.avatar}
      onError={() => setHasError(true)}
    />
  );
}

export default function TestimonialsSection({ sanityData }: Props) {
  const d = sanityData;

  const backgroundImageUrl = d?.backgroundImageUrl?.trim();
  const bgImage =
    backgroundImageUrl ||
    resolveImageWithUrl(
      d?.backgroundImage,
      null,
      "/images/_miscelanea/velas.webp",
      "background",
    );
  const hasEditableBackground = Boolean(
    backgroundImageUrl || d?.backgroundImage,
  );

  const eyebrow = d?.eyebrow || "Historias reales";
  const titleText = d?.title || "Celebraciones que";
  const highlightWord = d?.highlightWord || "se recuerdan.";
  const storyLabel = d?.storyPanelLabel || "Ahora en pantalla";

  const testimonials: TestimonialDisplay[] = useMemo(() => {
    if (d?.testimonials?.length) {
      return d.testimonials
        .filter((t) => t.visible !== false)
        .map((t) => ({
          names: t.names || "",
          event: t.event || "",
          quote: t.quote || "",
          image:
            t.photo || t.photoUrl
              ? resolveImageWithUrl(t.photo, t.photoUrl, "", "avatar")
              : undefined,
          rating: t.rating ?? 5,
        }));
    }
    return fallbackTestimonials.map((t) => ({
      names: t.names,
      event: t.event,
      quote: t.quote,
      image: t.image,
      rating: t.rating,
    }));
  }, [d]);

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const dragRef = useRef({
    isDragging: false,
    pointerId: null as number | null,
    startX: 0,
    startScrollLeft: 0,
  });
  const scrollRafRef = useRef<number | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [displayedStoryIndex, setDisplayedStoryIndex] = useState(0);
  const [isStoryChanging, setIsStoryChanging] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const activeTestimonial =
    testimonials[displayedStoryIndex] || testimonials[0];
  const showArrows = testimonials.length > 1;

  const centerCard = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const scroller = scrollerRef.current;
      const card = cardRefs.current[index];
      if (!scroller || !card) return;
      const targetLeft =
        card.offsetLeft - (scroller.clientWidth - card.offsetWidth) / 2;
      scroller.scrollTo({ left: targetLeft, behavior });
    },
    [],
  );

  const goTo = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const next = (index + testimonials.length) % testimonials.length;
      setActiveIndex(next);
      centerCard(next, behavior);
    },
    [centerCard, testimonials.length],
  );

  const updateActiveFromScroll = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const viewportCenter = scroller.scrollLeft + scroller.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const d = Math.abs(
        card.offsetLeft + card.offsetWidth / 2 - viewportCenter,
      );
      if (d < closestDistance) {
        closestDistance = d;
        closestIndex = i;
      }
    });
    setActiveIndex(closestIndex);
  }, []);

  const snapToActive = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const viewportCenter = scroller.scrollLeft + scroller.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const d = Math.abs(
        card.offsetLeft + card.offsetWidth / 2 - viewportCenter,
      );
      if (d < closestDistance) {
        closestDistance = d;
        closestIndex = i;
      }
    });
    goTo(closestIndex, "smooth");
  }, [goTo]);

  // Story panel fade transition
  useEffect(() => {
    if (activeIndex === displayedStoryIndex) return;
    setIsStoryChanging(true);
    const timer = window.setTimeout(() => {
      setDisplayedStoryIndex(activeIndex);
      setIsStoryChanging(false);
    }, 170);
    return () => {
      clearTimeout(timer);
      setIsStoryChanging(false);
    };
  }, [activeIndex, displayedStoryIndex]);

  // Initial center
  useEffect(() => {
    const t = setTimeout(() => centerCard(0, "auto"), 80);
    return () => clearTimeout(t);
  }, [centerCard]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => {
      mediaQuery.removeEventListener("change", updatePreference);
    };
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (prefersReducedMotion || isPaused || isDragging || testimonials.length <= 1) return;
    const interval = setInterval(() => goTo(activeIndex + 1), AUTO_ROTATE_MS);
    return () => clearInterval(interval);
  }, [activeIndex, goTo, isDragging, isPaused, prefersReducedMotion, testimonials.length]);

  // Scroll listener
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const handleScroll = () => {
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
      scrollRafRef.current = requestAnimationFrame(updateActiveFromScroll);
    };
    const handleResize = () => centerCard(activeIndex, "auto");
    scroller.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    return () => {
      scroller.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
    };
  }, [activeIndex, centerCard, updateActiveFromScroll]);

  // Drag handlers
  const handleDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.isPrimary) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const target = e.currentTarget;
    dragRef.current = {
      isDragging: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startScrollLeft: target.scrollLeft,
    };
    setIsPaused(true);
    setIsDragging(true);
    try {
      target.setPointerCapture(e.pointerId);
    } catch {
      dragRef.current.pointerId = null;
    }
  };
  const handleDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.isDragging) return;
    if (
      dragRef.current.pointerId !== null &&
      dragRef.current.pointerId !== e.pointerId
    ) {
      return;
    }
    e.preventDefault();
    e.currentTarget.scrollLeft =
      dragRef.current.startScrollLeft - (e.clientX - dragRef.current.startX);
  };
  const handleDragEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.isDragging) return;
    if (
      dragRef.current.pointerId !== null &&
      dragRef.current.pointerId !== e.pointerId
    ) {
      return;
    }
    const deltaX = e.clientX - dragRef.current.startX;
    dragRef.current.isDragging = false;
    dragRef.current.pointerId = null;
    setIsDragging(false);
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {}
    if (Math.abs(deltaX) > DRAG_THRESHOLD) {
      goTo(activeIndex + (deltaX < 0 ? 1 : -1));
    } else {
      snapToActive();
    }
    setTimeout(() => setIsPaused(false), 380);
  };

  if (d?.visible === false || testimonials.length === 0) return null;

  return (
    <section
      id="testimonios"
      className={styles.testimonialsSection}
      style={
        {
          "--testimonials-bg-opacity": hasEditableBackground ? 0.32 : 0.18,
        } as React.CSSProperties
      }
    >
      <div
        className={styles.sanityBackgroundImage}
        style={{ backgroundImage: `url("${bgImage}")` } as React.CSSProperties}
        aria-hidden="true"
      />
      <div className={styles.noiseLayer} aria-hidden="true" />
      <div className={styles.meshOne} aria-hidden="true" />
      <div className={styles.meshTwo} aria-hidden="true" />
      <div className={styles.meshThree} aria-hidden="true" />
      <div className={styles.orbitalLine} aria-hidden="true" />
      <div className={styles.sparkles} aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>

      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headingBlock}>
            <span className={styles.eyebrow}>
              <Sparkles size={14} />
              {eyebrow}
            </span>
            <h2 className={styles.title}>
              <span>{titleText}</span>
              <em>{highlightWord}</em>
            </h2>
          </div>

          <aside
            className={`${styles.storyPanel} ${isStoryChanging ? styles.storyPanelChanging : ""}`}
            aria-label="Resumen del testimonio activo"
          >
            <span className={styles.storyLabel}>{storyLabel}</span>
            <strong>{activeTestimonial?.names}</strong>
            <p>{activeTestimonial?.event}</p>
          </aside>
        </div>

        <div
          className={`${styles.carouselWrap} ${isDragging ? styles.isDragging : ""}`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            if (!dragRef.current.isDragging) setIsPaused(false);
          }}
        >
          {showArrows && (
            <button
              type="button"
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Ver testimonio anterior"
            >
              <ArrowLeft size={18} />
            </button>
          )}

          <div
            ref={scrollerRef}
            className={styles.scroller}
            onPointerDown={handleDragStart}
            onPointerMove={handleDragMove}
            onPointerUp={handleDragEnd}
            onPointerCancel={handleDragEnd}
            onLostPointerCapture={handleDragEnd}
            role="list"
            aria-label="Testimonios de clientes"
          >
            {testimonials.map((t, index) => {
              const isActive = index === activeIndex;
              return (
                <article
                  key={t.names}
                  ref={(node) => {
                    cardRefs.current[index] = node;
                  }}
                  tabIndex={0}
                  onFocus={() => goTo(index)}
                  className={`${styles.card} ${isActive ? styles.activeCard : ""}`}
                  role="listitem"
                  aria-current={isActive ? "true" : undefined}
                >
                  <div className={styles.borderBeam} aria-hidden="true" />
                  <div className={styles.cardGlow} aria-hidden="true" />

                  <div className={styles.cardTop}>
                    <div className={styles.avatarShell}>
                      <TestimonialPhoto src={t.image} names={t.names} />
                    </div>
                    <div
                      className={styles.stars}
                      role="img"
                      aria-label={`Calificación de ${t.rating} estrellas`}
                    >
                      {" "}
                      {Array.from({ length: t.rating }).map((_, si) => (
                        <Star key={si} size={14} fill="currentColor" />
                      ))}
                    </div>
                  </div>

                  <div className={styles.quoteIcon} aria-hidden="true">
                    <Quote size={28} />
                  </div>

                  <p
                    className={styles.quote}
                  >{`“${normalizeQuoteText(t.quote)}”`}</p>

                  <footer className={styles.cardFooter}>
                    <div className={styles.nameBlock}>
                      <span className={styles.nameLine} aria-hidden="true" />
                      <h3>{t.names}</h3>
                      <p>{t.event}</p>
                    </div>
                  </footer>
                </article>
              );
            })}
          </div>

          {showArrows && (
            <button
              type="button"
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Ver siguiente testimonio"
            >
              <ArrowRight size={18} />
            </button>
          )}
        </div>

        {testimonials.length > 1 && (
          <div className={styles.dots} aria-label="Seleccionar testimonio">
            {testimonials.map((t, i) => (
              <button
                key={t.names}
                type="button"
                className={i === activeIndex ? styles.activeDot : ""}
                onClick={() => goTo(i)}
                aria-label={`Ver testimonio de ${t.names}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
