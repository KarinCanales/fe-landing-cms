"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";

declare global {
  interface Window {
    karinShowRouteLoader?: (href?: string) => void;
  }
}

type SiteNavLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  ariaCurrent?: "page" | "step" | "location" | "date" | "time" | true;
  ariaLabel?: string;
  onHomeAnchorClick?: (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => void;
  onNavigate?: () => void;
};

function isExternalHref(href: string) {
  return /^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(href);
}

function isProtocolHref(href: string) {
  return /^(?:mailto|tel|sms|whatsapp):/i.test(href);
}

function isHomeAnchorHref(href: string) {
  return href.startsWith("/#");
}

function isInternalRouteHref(href: string) {
  return href.startsWith("/") && !isHomeAnchorHref(href);
}

function shouldStartRouteLoader(
  event: MouseEvent<HTMLAnchorElement>,
  href: string,
) {
  if (event.defaultPrevented) return false;
  if (event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
    return false;

  try {
    const targetUrl = new URL(href, window.location.href);
    const currentUrl = new URL(window.location.href);

    if (targetUrl.origin !== currentUrl.origin) return false;
    return (
      targetUrl.pathname !== currentUrl.pathname ||
      targetUrl.search !== currentUrl.search
    );
  } catch {
    return false;
  }
}

export default function SiteNavLink({
  href,
  children,
  className,
  ariaCurrent,
  ariaLabel,
  onHomeAnchorClick,
  onNavigate,
}: SiteNavLinkProps) {
  if (isInternalRouteHref(href)) {
    return (
      <Link
        href={href}
        className={className}
        aria-current={ariaCurrent}
        aria-label={ariaLabel}
        onClick={(event) => {
          if (shouldStartRouteLoader(event, href)) {
            window.karinShowRouteLoader?.(href);
          }

          onNavigate?.();
        }}
      >
        {children}
      </Link>
    );
  }

  if (isHomeAnchorHref(href)) {
    return (
      <a
        href={href}
        className={className}
        aria-current={ariaCurrent}
        aria-label={ariaLabel}
        onClick={(event) => {
          if (shouldStartRouteLoader(event, href)) {
            window.karinShowRouteLoader?.(href);
          }

          onHomeAnchorClick?.(event, href);
          onNavigate?.();
        }}
      >
        {children}
      </a>
    );
  }

  const isExternal = isExternalHref(href);

  return (
    <a
      href={href}
      className={className}
      aria-current={ariaCurrent}
      aria-label={ariaLabel}
      target={isExternal && !isProtocolHref(href) ? "_blank" : undefined}
      rel={
        isExternal && !isProtocolHref(href) ? "noopener noreferrer" : undefined
      }
      onClick={onNavigate}
    >
      {children}
    </a>
  );
}
