"use client";

import Image from "next/image";
import type { MouseEvent } from "react";
import { useEffect, useMemo, useState } from "react";
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

export default function NavbarSection({
  sanityNavbar,
  sanitySettings,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<NavTheme>("dark");

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

  const logoSrc = resolveImageWithUrl(
    sanitySettings?.logo,
    sanitySettings?.logoUrl,
    "/images/_logo/logo2.webp",
    "logo",
  );

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setHasMounted(true);
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
    if (colorMode !== "adaptive") {
      setCurrentTheme("dark");
      return;
    }

    let frame = 0;

    const updateAdaptiveTheme = () => {
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("section[id], footer[id]"),
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

        if (rect.top <= probeY && rect.bottom >= probeY) {
          activeId = section.id;
          closestDistance = 0;
          break;
        }

        const distance = Math.abs(rect.top - probeY);

        if (distance < closestDistance) {
          closestDistance = distance;
          activeId = section.id;
        }
      }

      setCurrentTheme(sectionThemeMap[activeId] || "dark");
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

    const initialTimer = window.setTimeout(scheduleUpdate, 260);

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);
    window.addEventListener("pageshow", scheduleUpdate);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearTimeout(initialTimer);
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

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  const scrollToSection = (
    event: MouseEvent<HTMLAnchorElement>,
    href?: string | null,
    afterScroll?: () => void,
  ) => {
    if (!href?.startsWith("#")) {
      afterScroll?.();
      return;
    }

    event.preventDefault();

    const targetId = decodeURIComponent(href.slice(1));

    if (!targetId) {
      afterScroll?.();
      return;
    }

    if (targetId === "inicio") {
      window.history.replaceState(null, "", "#inicio");
      window.scrollTo({ top: 0, behavior: "smooth" });
      afterScroll?.();
      return;
    }

    const target = document.getElementById(targetId);

    if (!target) {
      window.history.replaceState(null, "", href);
      afterScroll?.();
      return;
    }

    // Importante: para las secciones grandes, el ancla debe llegar al inicio
    // real de la sección. Si restamos la altura de la navbar, queda una franja
    // de la sección anterior arriba y parece que el scroll se quedó corto.
    const targetTop = window.scrollY + target.getBoundingClientRect().top + 1;

    window.history.replaceState(null, "", href);
    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: "smooth",
    });

    afterScroll?.();
  };

  const themeClass =
    hasMounted && colorMode === "adaptive"
      ? styles[`theme-${currentTheme}`] || ""
      : "";

  return (
    <>
      <header
        className={`${styles.navbar} ${
          hasMounted && hasScrolled ? styles.navbarScrolled : ""
        } ${themeClass}`}
      >
        <div className={styles.shell}>
          <a href="#inicio" className={styles.brand} aria-label="Ir al inicio">
            <span className={styles.logoMark}>
              <Image
                src={logoSrc}
                alt={sanitySettings?.companyName || "Karin Eventos"}
                width={64}
                height={64}
                priority
                className={styles.logoImage}
              />
            </span>

            <span className={styles.brandText}>
              <strong>{sanitySettings?.companyName || "Karin"}</strong>
              <small>
                {sanitySettings?.companySubtitle || "Eventos & experiencias"}
              </small>
            </span>
          </a>

          <nav className={styles.desktopNav} aria-label="Navegación principal">
            {navLinks.map((link) => (
              <a
                key={`${link.href}-${link.label}`}
                href={link.href}
                onClick={(event) => scrollToSection(event, link.href)}
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
              rel="noreferrer"
            >
              <span className={styles.buttonContent}>
                <MessageCircle size={17} />
                <span>{whatsappLabel}</span>
                <ArrowUpRight size={15} />
              </span>
            </a>

            <button
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
                  Explorar {sanitySettings?.companyName || "Karin"}
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
                rel="noreferrer"
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
