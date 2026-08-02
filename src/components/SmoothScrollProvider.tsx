"use client";

import Lenis from "lenis";
import type { ReactNode } from "react";
import { useEffect } from "react";

type LenisInstance = InstanceType<typeof Lenis>;

declare global {
  interface Window {
    karinLenis?: LenisInstance;
  }
}

type SmoothScrollProviderProps = {
  children: ReactNode;
};

export default function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: LenisInstance | null = null;
    let frame = 0;

    const stopLenis = () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }

      if (lenis) {
        lenis.destroy();

        if (window.karinLenis === lenis) {
          delete window.karinLenis;
        }

        lenis = null;
      }
    };

    const startLenis = () => {
      if (lenis) return;

      lenis = new Lenis({
        lerp: 0.18,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 1.15,
        touchMultiplier: 1.05,
        infinite: false,
        anchors: {
          offset: -96,
        },
      });

      window.karinLenis = lenis;

      const raf = (time: number) => {
        lenis?.raf(time);
        frame = window.requestAnimationFrame(raf);
      };

      frame = window.requestAnimationFrame(raf);
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

    syncMotionPreference();
    motionQuery.addEventListener("change", syncMotionPreference);

    return () => {
      motionQuery.removeEventListener("change", syncMotionPreference);
      document.documentElement.classList.remove("reduced-motion-scroll");
      stopLenis();
    };
  }, []);

  return children;
}
