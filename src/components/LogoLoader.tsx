"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./LogoLoader.module.css";

type LogoLoaderProps = {
  logoSrc: string;
  companyName: string;
};

export default function LogoLoader({ logoSrc, companyName }: LogoLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minimumTime = reduceMotion ? 220 : 900;
    const startedAt = window.performance.now();

    const hide = () => {
      const elapsed = window.performance.now() - startedAt;
      window.setTimeout(() => setIsVisible(false), Math.max(0, minimumTime - elapsed));
    };

    if (document.readyState === "complete") {
      hide();
    } else {
      window.addEventListener("load", hide, { once: true });
    }

    const fallback = window.setTimeout(hide, 1800);

    return () => {
      window.removeEventListener("load", hide);
      window.clearTimeout(fallback);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className={styles.loader} aria-label="Cargando sitio">
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
