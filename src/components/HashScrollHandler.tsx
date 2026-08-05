"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  consumePendingHomeAnchor,
  getHomeAnchorIdFromHref,
  savePendingHomeAnchor,
  scheduleHomeAnchorScroll,
} from "@/lib/hashScroll";

export default function HashScrollHandler() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname !== "/") return;

    const id =
      consumePendingHomeAnchor() || getHomeAnchorIdFromHref(window.location.href);

    if (id) {
      if (window.location.hash !== `#${id}`) {
        window.history.replaceState(null, "", `/#${id}`);
      }

      scheduleHomeAnchorScroll(id, { delayMs: 620 });
    }
  }, [pathname]);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.pathname !== "/") return;

      const id = getHomeAnchorIdFromHref(window.location.href);

      if (id) {
        scheduleHomeAnchorScroll(id);
      }
    };

    const handleBackForwardRecovery = () => {
      if (window.location.pathname !== "/") return;

      const id = getHomeAnchorIdFromHref(window.location.href);

      if (id) {
        scheduleHomeAnchorScroll(id);
      }
    };

    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      const link =
        target instanceof Element
          ? target.closest<HTMLAnchorElement>("a[href]")
          : null;

      if (!link || link.target || link.hasAttribute("download")) return;

      const id = getHomeAnchorIdFromHref(link.href);

      if (!id) return;

      event.preventDefault();

      if (window.location.pathname === "/") {
        window.history.pushState(null, "", `/#${id}`);
        window.dispatchEvent(new Event("hashchange"));
        return;
      }

      window.karinShowRouteLoader?.(link.href);
      savePendingHomeAnchor(id);
      router.push("/", { scroll: false });
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("karin:back-forward-recovery", handleBackForwardRecovery);
    document.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("karin:back-forward-recovery", handleBackForwardRecovery);
      document.removeEventListener("click", handleClick);
    };
  }, [router]);

  return null;
}
