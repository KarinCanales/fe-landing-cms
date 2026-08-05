"use client";

import Lenis from "lenis";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type LenisInstance = InstanceType<typeof Lenis>;

declare global {
  interface Window {
    karinLenis?: LenisInstance;
    karinResumeLenis?: () => void;
  }
}

type SmoothScrollProviderProps = {
  children: ReactNode;
};

const STUDIO_ROUTE = "/studio";

function isStudioPath(pathname: string | null) {
  return pathname === STUDIO_ROUTE || pathname?.startsWith(`${STUDIO_ROUTE}/`);
}

function clearLenisDocumentState() {
  document.documentElement.classList.remove(
    "lenis",
    "lenis-smooth",
    "lenis-scrolling",
    "lenis-stopped",
    "reduced-motion-scroll",
  );

  document.body.classList.remove(
    "lenis",
    "lenis-smooth",
    "lenis-scrolling",
    "lenis-stopped",
  );

  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
}

export default function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  const pathname = usePathname();
  const lenisRef = useRef<LenisInstance | null>(null);
  const frameRef = useRef(0);
  const isStudioRoute = isStudioPath(pathname);

  const stopLenis = useCallback(() => {
    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    }

    if (lenisRef.current) {
      lenisRef.current.destroy();

      if (window.karinLenis === lenisRef.current) {
        delete window.karinLenis;
      }

      lenisRef.current = null;
    }

    clearLenisDocumentState();
  }, []);

  useEffect(() => {
    if (isStudioRoute) {
      if (window.karinResumeLenis) {
        delete window.karinResumeLenis;
      }

      stopLenis();
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const startRaf = (restart = false) => {
      if (restart && frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }

      if (frameRef.current) return;

      const raf = (time: number) => {
        lenisRef.current?.raf(time);
        frameRef.current = window.requestAnimationFrame(raf);
      };

      frameRef.current = window.requestAnimationFrame(raf);
    };

    const startLenis = (restartFrame = false) => {
      if (lenisRef.current) {
        window.karinLenis = lenisRef.current;
        lenisRef.current.start();
        lenisRef.current.resize();
        startRaf(restartFrame);
        return;
      }

      lenisRef.current = new Lenis({
        lerp: 0.06,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 1.15,
        touchMultiplier: 1.05,
        infinite: false,
        anchors: false,
      });

      window.karinLenis = lenisRef.current;
      startRaf();
    };

    const resumeLenis = () => {
      if (motionQuery.matches || isStudioPath(window.location.pathname)) return;

      startLenis(true);
    };

    const syncMotionPreference = () => {
      if (motionQuery.matches) {
        document.documentElement.classList.add("reduced-motion-scroll");
        stopLenis();
        return;
      }

      document.documentElement.classList.remove("reduced-motion-scroll");
      startLenis();
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      if (motionQuery.matches || isStudioPath(window.location.pathname)) return;
      const [navigationEntry] = performance.getEntriesByType(
        "navigation",
      ) as PerformanceNavigationTiming[];

      if (!event.persisted && navigationEntry?.type !== "back_forward") return;

      resumeLenis();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        resumeLenis();
      }
    };

    syncMotionPreference();
    window.karinResumeLenis = resumeLenis;
    motionQuery.addEventListener("change", syncMotionPreference);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("karin:back-forward-recovery", resumeLenis);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      motionQuery.removeEventListener("change", syncMotionPreference);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("karin:back-forward-recovery", resumeLenis);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (window.karinResumeLenis === resumeLenis) {
        delete window.karinResumeLenis;
      }
      stopLenis();
    };
  }, [isStudioRoute, stopLenis]);

  useEffect(() => {
    if (isStudioRoute) {
      stopLenis();
      return;
    }

    window.requestAnimationFrame(() => {
      window.karinResumeLenis?.();
      window.karinLenis?.resize();
    });
  }, [isStudioRoute, pathname, stopLenis]);

  return children;
}
