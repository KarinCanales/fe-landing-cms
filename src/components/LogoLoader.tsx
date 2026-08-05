"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./LogoLoader.module.css";

type LogoLoaderProps = {
  logoSrc: string;
  companyName: string;
};

type LoaderMode = "initial" | "route" | null;

declare global {
  interface Window {
    karinShowRouteLoader?: (href?: string) => void;
  }
}

function isRealInternalRoute(href?: string) {
  if (!href) return false;

  try {
    const targetUrl = new URL(href, window.location.href);
    const currentUrl = new URL(window.location.href);

    if (targetUrl.origin !== currentUrl.origin) return false;
    if (targetUrl.pathname === currentUrl.pathname && targetUrl.search === currentUrl.search) {
      return false;
    }

    // Hashes in the current home page are section scrolls, not page transitions.
    // From /catalogo or /links back to /#inicio, they are real route transitions
    // and should show the Karin loader.
    if (targetUrl.pathname === "/" && targetUrl.hash && currentUrl.pathname === "/") {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export default function LogoLoader({ logoSrc, companyName }: LogoLoaderProps) {
  const pathname = usePathname();
  const [loaderMode, setLoaderMode] = useState<LoaderMode>("initial");
  const loaderModeRef = useRef<LoaderMode>("initial");
  const hideTimerRef = useRef(0);
  const fallbackTimerRef = useRef(0);
  const startedAtRef = useRef(0);
  const minimumVisibleMsRef = useRef(0);

  const clearTimers = useCallback(() => {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = 0;
    }

    if (fallbackTimerRef.current) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = 0;
    }
  }, []);

  const hideAfterMinimum = useCallback(() => {
    const elapsed = window.performance.now() - startedAtRef.current;
    const remaining = Math.max(0, minimumVisibleMsRef.current - elapsed);

    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
    }

    hideTimerRef.current = window.setTimeout(() => {
      loaderModeRef.current = null;
      setLoaderMode(null);
      hideTimerRef.current = 0;
    }, remaining);
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    minimumVisibleMsRef.current = reduceMotion ? 220 : 900;
    startedAtRef.current = window.performance.now();

    const hideInitialLoader = () => {
      if (loaderModeRef.current !== "initial") return;
      hideAfterMinimum();
    };

    if (document.readyState === "complete") {
      hideInitialLoader();
    } else {
      window.addEventListener("load", hideInitialLoader, { once: true });
    }

    fallbackTimerRef.current = window.setTimeout(hideInitialLoader, 1800);

    return () => {
      window.removeEventListener("load", hideInitialLoader);
      clearTimers();
    };
  }, [clearTimers, hideAfterMinimum]);

  useEffect(() => {
    const showRouteLoader = (href?: string) => {
      if (!isRealInternalRoute(href)) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      clearTimers();
      loaderModeRef.current = "route";
      minimumVisibleMsRef.current = reduceMotion ? 220 : 520;
      startedAtRef.current = window.performance.now();
      setLoaderMode("route");

      fallbackTimerRef.current = window.setTimeout(() => {
        if (loaderModeRef.current === "route") {
          hideAfterMinimum();
        }
      }, 2200);
    };

    window.karinShowRouteLoader = showRouteLoader;

    return () => {
      if (window.karinShowRouteLoader === showRouteLoader) {
        delete window.karinShowRouteLoader;
      }
    };
  }, [clearTimers, hideAfterMinimum]);

  useEffect(() => {
    if (loaderModeRef.current !== "route") return;

    window.requestAnimationFrame(() => {
      hideAfterMinimum();
    });
  }, [pathname, hideAfterMinimum]);

  if (!loaderMode) return null;

  return (
    <div
      className={styles.loader}
      data-loader-mode={loaderMode}
      aria-label={loaderMode === "initial" ? "Cargando sitio" : "Cargando página"}
      aria-live="polite"
    >
      <div className={styles.mark}>
        <Image
          src={logoSrc}
          alt={`Logo de ${companyName}`}
          width={96}
          height={96}
          priority
          className={styles.logo}
        />
      </div>
      <span className={styles.ring} aria-hidden="true" />
    </div>
  );
}
