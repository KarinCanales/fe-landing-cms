"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const HOME_NEEDS_RECOVERY_KEY = "karin-home-needs-recovery";

function hasBlockingOverlay() {
  return Boolean(
    document.querySelector(
      '[role="dialog"], [aria-modal="true"], nav[aria-label="Navegación móvil"]',
    ),
  );
}

function dispatchHomeRecovery() {
  window.karinResumeLenis?.();

  if (!hasBlockingOverlay()) {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    document.documentElement.classList.remove("lenis-stopped");
  }

  window.dispatchEvent(new Event("resize"));
  window.dispatchEvent(new CustomEvent("karin:home-route-restored"));
  window.dispatchEvent(new CustomEvent("karin:back-forward-recovery"));
}

export default function RouteRecoveryProvider() {
  const pathname = usePathname();
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    const previousPath = previousPathRef.current;

    if (pathname !== "/") {
      window.sessionStorage.setItem(HOME_NEEDS_RECOVERY_KEY, "1");
      previousPathRef.current = pathname;
      return;
    }

    const shouldRecover =
      window.sessionStorage.getItem(HOME_NEEDS_RECOVERY_KEY) === "1" ||
      Boolean(previousPath && previousPath !== "/");

    previousPathRef.current = pathname;

    if (!shouldRecover) return;

    window.sessionStorage.removeItem(HOME_NEEDS_RECOVERY_KEY);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        dispatchHomeRecovery();
      });
    });
  }, [pathname]);

  return null;
}
