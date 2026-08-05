"use client";

import { useEffect } from "react";

type WindowWithRecovery = Window & {
  karinResumeLenis?: () => void;
};

function isBackForwardNavigation() {
  const [navigationEntry] = performance.getEntriesByType(
    "navigation",
  ) as PerformanceNavigationTiming[];

  return navigationEntry?.type === "back_forward";
}

function hasBlockingOverlay() {
  return Boolean(
    document.querySelector(
      '[role="dialog"], [aria-modal="true"], nav[aria-label="Navegación móvil"]',
    ),
  );
}

function recoverPageState() {
  (window as WindowWithRecovery).karinResumeLenis?.();

  if (!hasBlockingOverlay()) {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    document.documentElement.classList.remove("lenis-stopped");
  }

  window.dispatchEvent(new Event("resize"));
}

export default function BackForwardRecovery() {
  useEffect(() => {
    let sawPopState = false;

    const scheduleRecovery = () => {
      recoverPageState();

      window.requestAnimationFrame(() => {
        recoverPageState();
      });
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      if (!event.persisted && !sawPopState && !isBackForwardNavigation()) {
        return;
      }

      sawPopState = false;
      scheduleRecovery();
    };

    const handlePopState = () => {
      sawPopState = true;
      window.requestAnimationFrame(scheduleRecovery);
    };

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return null;
}
