"use client";

type LenisLike = {
  scrollTo: (
    target: number | string | HTMLElement,
    options?: { duration?: number; offset?: number; immediate?: boolean },
  ) => void;
};

type ScrollOptions = {
  immediate?: boolean;
};

type ScheduleOptions = {
  delayMs?: number;
};

const HOME_ANCHOR_IDS = new Set([
  "inicio",
  "beneficios",
  "servicios",
  "testimonios",
  "catalogo",
  "contacto",
]);

const DESKTOP_NAV_OFFSET = 92;
const MOBILE_NAV_OFFSET = 84;
const PENDING_HOME_ANCHOR_KEY = "karinPendingHomeAnchor";
let scheduledScrollTimer = 0;

const ANCHOR_OFFSET_ADJUSTMENTS: Record<string, number> = {
  beneficios: 28,
};

function getWindowWithLenis() {
  return window as Window & { karinLenis?: LenisLike };
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function getSiteNavOffset() {
  const fallbackOffset =
    window.matchMedia("(max-width: 680px)").matches
      ? MOBILE_NAV_OFFSET
      : DESKTOP_NAV_OFFSET;
  const navbar = document.querySelector<HTMLElement>("[data-site-navbar]");

  if (!navbar) {
    return fallbackOffset;
  }

  const rect = navbar.getBoundingClientRect();

  return Math.max(
    fallbackOffset,
    Math.ceil(Math.max(rect.bottom, rect.height) + 10),
  );
}

function getAnchorOffset(id: string) {
  return getSiteNavOffset() + (ANCHOR_OFFSET_ADJUSTMENTS[id] ?? 0);
}

export function getHomeAnchorIdFromHref(href: string) {
  if (!href) return "";

  try {
    const url = new URL(href, window.location.href);

    if (url.origin !== window.location.origin || url.pathname !== "/") {
      return "";
    }

    const id = decodeURIComponent(url.hash.replace(/^#/, ""));

    return HOME_ANCHOR_IDS.has(id) ? id : "";
  } catch {
    return "";
  }
}

export function savePendingHomeAnchor(id: string) {
  if (!HOME_ANCHOR_IDS.has(id)) return;

  window.sessionStorage.setItem(PENDING_HOME_ANCHOR_KEY, id);
}

export function consumePendingHomeAnchor() {
  const id = window.sessionStorage.getItem(PENDING_HOME_ANCHOR_KEY) || "";

  window.sessionStorage.removeItem(PENDING_HOME_ANCHOR_KEY);

  return HOME_ANCHOR_IDS.has(id) ? id : "";
}

export function scrollToHomeAnchor(id: string, options: ScrollOptions = {}) {
  if (!HOME_ANCHOR_IDS.has(id)) return false;

  const target = document.getElementById(id);

  if (!target) return false;

  const top =
    id === "inicio"
      ? 0
      : Math.max(
        0,
          window.scrollY + target.getBoundingClientRect().top - getAnchorOffset(id),
        );

  const shouldReduceMotion = prefersReducedMotion();
  const lenis = getWindowWithLenis().karinLenis;

  if (lenis && !shouldReduceMotion) {
    lenis.scrollTo(top, {
      duration: options.immediate ? 0 : 0.8,
      immediate: options.immediate,
      offset: 0,
    });
    return true;
  }

  window.scrollTo({
    top,
    behavior: shouldReduceMotion || options.immediate ? "auto" : "smooth",
  });

  return true;
}

export function scheduleHomeAnchorScroll(id: string, options: ScheduleOptions = {}) {
  let attempts = 0;

  if (scheduledScrollTimer) {
    window.clearTimeout(scheduledScrollTimer);
    scheduledScrollTimer = 0;
  }

  const run = () => {
    attempts += 1;
    const didScroll = scrollToHomeAnchor(id);

    if (!didScroll && attempts < 12) {
      window.setTimeout(run, 80);
    }
  };

  const scheduleRun = () => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(run);
    });
  };

  scheduledScrollTimer = window.setTimeout(() => {
    scheduledScrollTimer = 0;
    scheduleRun();
  }, options.delayMs ?? 0);
}
