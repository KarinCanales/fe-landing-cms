"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Menu,
  MessageCircle,
  Sparkles,
  X,
} from "lucide-react";
import styles from "./NavbarSection.module.css";
import type { NavbarData, SiteSettingsData } from "@/sanity/types";
import { fallbackNavLinks, WHATSAPP_URL } from "@/data/fallbacks";
import { resolveImageWithUrl } from "@/sanity/image";
import {
  getHomeAnchorIdFromHref,
  savePendingHomeAnchor,
} from "@/lib/hashScroll";

type NavbarProps = {
  sanityNavbar?: NavbarData;
  sanitySettings?: SiteSettingsData;
};

type NavTheme = "dark" | "light" | "botanical" | "warm";

const DEFAULT_SECTION_THEMES: Record<string, NavTheme> = {
  inicio: "dark",
  beneficios: "light",
  servicios: "dark",
  catalogo: "dark",
  testimonios: "light",
  contacto: "light",
  footer: "dark",
};

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

function normalizeColorMode(value?: string | null): "neutral" | "adaptive" {
  const normalizedValue = String(value || "adaptive").toLowerCase();

  if (normalizedValue === "neutral") return "neutral";

  return "adaptive";
}

function getNavbarBrandCopy(companyName?: string | null, companySubtitle?: string | null) {
  const rawName = (companyName || 'Karin Cadenas').trim();
  const normalized = rawName
    .replace(/\s*\|\s*/g, ' ')
    .replace(/\bBODAS\s*&\s*EVENTOS\b/gi, '')
    .replace(/\bBODAS\s+Y\s+EVENTOS\b/gi, '')
    .replace(/\bEVENTOS\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return {
    title: normalized || 'Karin Cadenas',
    subtitle: (companySubtitle || 'Bodas & Eventos').trim(),
  };
}

function buildSectionThemeMap(sanityNavbar?: NavbarData) {
  const map: Record<string, NavTheme> = { ...DEFAULT_SECTION_THEMES };

  if (sanityNavbar?.sectionThemes?.length) {
    for (const entry of sanityNavbar.sectionThemes) {
      if (entry?.sectionId && entry?.theme) {
        map[entry.sectionId] = entry.theme;
      }
    }
  }

  return map;
}

function getFocusableElements(container: HTMLElement | null) {
  if (!container) return [];

  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute("disabled"));
}

export default function NavbarSection({
  sanityNavbar,
  sanitySettings,
}: NavbarProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<NavTheme>("dark");
  const [currentSection, setCurrentSection] = useState("inicio");
  const [currentPath, setCurrentPath] = useState("/");
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const mobilePanelRef = useRef<HTMLElement | null>(null);

  // Menú fijo: no se edita desde Sanity para evitar romper la navegación.
  const navLinks = useMemo(() => {
    return fallbackNavLinks
      .filter((link) => link.enabled !== false)
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, []);

  const colorMode = normalizeColorMode(sanityNavbar?.colorMode);

  const sectionThemeMap = useMemo(
    () => buildSectionThemeMap(sanityNavbar),
    [sanityNavbar],
  );

  // CTA fijo: siempre usa el WhatsApp principal configurado en Datos generales.
  const whatsappUrl = normalizeWhatsappUrl(sanitySettings?.whatsapp) || WHATSAPP_URL;

  const whatsappLabel = "WhatsApp";

  const whatsappLabelLong = "Escribir por WhatsApp";

  const brandCopy = getNavbarBrandCopy(sanitySettings?.companyName, sanitySettings?.companySubtitle);

  const logoSrc = resolveImageWithUrl(
    sanitySettings?.logo,
    sanitySettings?.logoUrl,
    "/images/_logo/logo.webp",
    "logo",
  );

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setHasMounted(true);
      setCurrentPath(window.location.pathname || "/");
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    let frame = 0;

    const updateScrollState = () => {
      window.cancelAnimationFrame(frame);

      frame = window.requestAnimationFrame(() => {
        setHasScrolled(window.scrollY > 18);
      });
    };

    updateScrollState();

    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  useEffect(() => {
    let frame = 0;

    const updateAdaptiveTheme = () => {
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>(
          "section[data-section-id], section[id], footer[id]",
        ),
      );

      if (!sections.length) return;

      const navbarHeight =
        document.querySelector<HTMLElement>(`.${styles.navbar}`)?.offsetHeight ??
        82;

      const probeY = Math.min(navbarHeight + 34, window.innerHeight * 0.28);

      let activeId = sections[0].id;
      let closestDistance = Number.POSITIVE_INFINITY;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        const sectionId = section.dataset.sectionId || section.id;

        if (rect.top <= probeY && rect.bottom >= probeY) {
          activeId = sectionId;
          closestDistance = 0;
          break;
        }

        const distance = Math.abs(rect.top - probeY);

        if (distance < closestDistance) {
          closestDistance = distance;
          activeId = sectionId;
        }
      }

      setCurrentSection(activeId);
      setCurrentTheme(
        colorMode === "adaptive" ? sectionThemeMap[activeId] || "dark" : "dark",
      );
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateAdaptiveTheme);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        scheduleUpdate();
      }
    };

    scheduleUpdate();

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);
    window.addEventListener("pageshow", scheduleUpdate);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);
      window.removeEventListener("pageshow", scheduleUpdate);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [colorMode, sectionThemeMap]);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const menuButton = menuButtonRef.current;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusableElements(mobilePanelRef.current);
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
    };

    window.requestAnimationFrame(() => {
      getFocusableElements(mobilePanelRef.current)[0]?.focus();
    });

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      (previouslyFocused || menuButton)?.focus?.();
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  const scrollToSection = (
    event: MouseEvent<HTMLAnchorElement>,
    href?: string | null,
    afterScroll?: () => void,
  ) => {
    if (!href) {
      afterScroll?.();
      return;
    }

    const targetId = getHomeAnchorIdFromHref(href);

    if (!targetId) {
      afterScroll?.();
      return;
    }

    if (window.location.pathname !== "/") {
      event.preventDefault();
      savePendingHomeAnchor(targetId);
      router.push("/", { scroll: false });
      afterScroll?.();
      return;
    }

    event.preventDefault();
    window.history.pushState(null, "", `/#${targetId}`);
    window.dispatchEvent(new Event("hashchange"));
    afterScroll?.();
  };

  const themeClass =
    hasMounted && colorMode === "adaptive"
      ? styles[`theme-${currentTheme}`] || ""
      : "";

  return (
    <>
      <header
        data-site-navbar
        className={`${styles.navbar} ${
          hasMounted && hasScrolled ? styles.navbarScrolled : ""
        } ${themeClass}`}
      >
        <div className={styles.shell}>
          <Link href="/#inicio" className={styles.brand} aria-label="Ir al inicio">
            <span className={styles.logoMark}>
              <Image
                src={logoSrc}
                alt={brandCopy.title}
                width={64}
                height={64}
                priority
                className={styles.logoImage}
              />
            </span>

            <span className={styles.brandText}>
              <strong>{brandCopy.title}</strong>
              <small>{brandCopy.subtitle}</small>
            </span>
          </Link>

          <nav className={styles.desktopNav} aria-label="Navegación principal">
            {navLinks.map((link) => (
              <a
                key={`${link.href}-${link.label}`}
                href={link.href}
                onClick={(event) => scrollToSection(event, link.href)}
                aria-current={
                  (link.href === currentPath && link.href.startsWith("/") && !link.href.includes("#")) ||
                  (currentPath === "/" &&
                    (link.href === `/#${currentSection}` ||
                      (link.href === "/#inicio" && currentSection === "inicio")))
                    ? "location"
                    : undefined
                }
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className={styles.actions}>
            <a
              className={styles.whatsappButton}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.buttonContent}>
                <MessageCircle size={17} />
                <span>{whatsappLabel}</span>
                <ArrowUpRight size={15} />
              </span>
            </a>

            <button
              ref={menuButtonRef}
              type="button"
              className={styles.menuButton}
              onClick={() => setIsOpen((current) => !current)}
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.mobileOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
          >
            <motion.nav
              ref={mobilePanelRef}
              id="mobile-navigation"
              className={styles.mobilePanel}
              initial={{ opacity: 0, y: -18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              aria-label="Navegación móvil"
              onClick={(event) => event.stopPropagation()}
            >
              <div className={styles.mobileHeader}>
                <span>
                  <Sparkles size={15} />
                  Explorar {brandCopy.title}
                </span>

                <button
                  type="button"
                  onClick={closeMenu}
                  aria-label="Cerrar menú"
                >
                  <X size={20} />
                </button>
              </div>

              <div className={styles.mobileLinks}>
                {navLinks.map((link, index) => (
                  <motion.a
                    key={`${link.href}-${link.label}`}
                    href={link.href}
                    onClick={(event) => scrollToSection(event, link.href, closeMenu)}
                    aria-current={
                      (link.href === currentPath && link.href.startsWith("/") && !link.href.includes("#")) ||
                      (currentPath === "/" &&
                        (link.href === `/#${currentSection}` ||
                          (link.href === "/#inicio" && currentSection === "inicio")))
                        ? "location"
                        : undefined
                    }
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.22,
                      delay: 0.04 + index * 0.035,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <span>0{index + 1}</span>
                    {link.label}
                  </motion.a>
                ))}
              </div>

              <a
                className={styles.mobileCta}
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
              >
                <span className={styles.buttonContent}>
                  <MessageCircle size={18} />
                  <span>{whatsappLabelLong}</span>
                  <ArrowUpRight size={16} />
                </span>
              </a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
