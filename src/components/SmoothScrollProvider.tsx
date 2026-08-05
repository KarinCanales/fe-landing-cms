"use client";

import Lenis from "lenis";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
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

export default function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  const pathname = usePathname();
  const lenisRef = useRef<LenisInstance | null>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const stopLenis = () => {
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
    };

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
        lerp: 0.18,
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
      if (motionQuery.matches) return;

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
      if (motionQuery.matches) return;
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
      document.documentElement.classList.remove("reduced-motion-scroll");
      stopLenis();
    };
  }, []);

  useEffect(() => {
    window.requestAnimationFrame(() => {
      window.karinResumeLenis?.();
      window.karinLenis?.resize();
    });
  }, [pathname]);

  return children;
}
