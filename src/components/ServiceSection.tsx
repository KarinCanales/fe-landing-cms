"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, CalendarCheck, Flower2, Sparkles } from "lucide-react";
import styles from "./ServicesSection.module.css";
import type { ServicesData } from "@/sanity/types";
import { resolveImageWithUrl } from "@/sanity/image";
import { resolveIcon } from "@/sanity/icons";
import { fallbackServices } from "@/data/fallbacks";

type Props = { sanityData?: ServicesData };

type ServiceDisplay = {
  title: string;
  eyebrow: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  tags: string[];
};

export default function ServicesSection({ sanityData }: Props) {
  const d = sanityData;
  const [activeIndex, setActiveIndex] = useState(0);

  const bgImage = resolveImageWithUrl(d?.backgroundImage, d?.backgroundImageUrl, "/images/_miscelanea/velas.webp", "background");

  const eyebrow = d?.eyebrow || "Servicios Karin";
  const titleText = d?.title || "Nuestros";
  const highlightWord = d?.highlightWord || "Servicios";

  const leadText =
    d?.leadCard?.text ||
    "Una experiencia integral para eventos con carácter, estética cuidada y ejecución sin fricciones.";
  const LeadIcon = resolveIcon(d?.leadCard?.icon, CalendarCheck);
  const showLead = d?.leadCard?.visible !== false;

  const footerText =
    d?.footerCard?.text ||
    "Catering, bodas, organización y ambientación trabajando como una sola experiencia.";
  const FooterIcon = resolveIcon(d?.footerCard?.icon, Flower2);
  const showFooter = d?.footerCard?.visible !== false;

  const services: ServiceDisplay[] = useMemo(() => {
    if (d?.services?.length) {
      return d.services
        .filter((s) => s.visible !== false)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((s) => ({
          title: s.title || "",
          eyebrow: s.eyebrow || "",
          description: s.description || "",
          imageSrc: resolveImageWithUrl(s.image, s.imageUrl, "/images/3-servicios/catering-premium.webp", "card"),
          imageAlt: s.imageAlt || s.title || "",
          tags: s.tags || [],
        }));
    }
    return fallbackServices.map((s) => ({
      title: s.title,
      eyebrow: s.eyebrow,
      description: s.description,
      imageSrc: s.image,
      imageAlt: s.alt,
      tags: s.tags,
    }));
  }, [d?.services]);

  if (d?.visible === false) return null;

  // Dynamic accordion sizing
  const serviceCount = services.length;
  const accordionStyle: React.CSSProperties = {
    '--service-count': serviceCount,
  } as React.CSSProperties;

  const sectionStyle: React.CSSProperties = {
    "--services-bg-image": `url("${bgImage}")`,
  } as React.CSSProperties;

  return (
    <section id="servicios" className={styles.servicesSection} style={sectionStyle}>
      <div className={styles.ambientGlowOne} aria-hidden="true" />
      <div className={styles.ambientGlowTwo} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.eyebrow}>
              <Sparkles size={15} />
              {eyebrow}
            </span>

            <h2 className={styles.title}>
              {titleText} <em>{highlightWord}</em>
            </h2>
          </div>

          {showLead && (
            <p className={styles.lead}>
              <span className={styles.leadIcon} aria-hidden="true">
                <LeadIcon size={18} />
              </span>
              <span>{leadText}</span>
            </p>
          )}
        </div>

        <div
          className={styles.servicesAccordion}
          style={accordionStyle}
          aria-label="Servicios principales"
        >
          {services.map((service, index) => {
            const isActive = activeIndex === index;

            return (
              <button
                key={service.title}
                type="button"
                className={`${styles.serviceCard} ${isActive ? styles.isActive : ""}`}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                aria-label={`Ver servicio: ${service.title}`}
              >
                <Image
                  src={service.imageSrc}
                  alt={service.imageAlt}
                  fill
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  quality={72}
                  sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 38vw"
                  className={styles.serviceImage}
                />

                <span className={styles.imageVeil} aria-hidden="true" />
                <span className={styles.borderGlow} aria-hidden="true" />

                <span className={styles.cardNumber}>0{index + 1}</span>

                <span className={styles.compactTitle}>
                  <span>{service.title}</span>
                </span>

                <span className={styles.cardContent}>
                  <span className={styles.cardEyebrow}>
                    <Sparkles size={14} />
                    {service.eyebrow}
                  </span>

                  <span className={styles.cardTitle}>{service.title}</span>
                  <span className={styles.cardDescription}>
                    {service.description}
                  </span>

                  <span className={styles.tagRow}>
                    {service.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {showFooter && (
          <div className={styles.footerRow}>
            <p className={styles.footerText}>
              <span className={styles.footerIcon} aria-hidden="true">
                <FooterIcon size={18} />
              </span>
              <span>{footerText}</span>
            </p>

            <a className={styles.ctaButton} href="#contacto">
              Cotiza Ahora
              <ArrowUpRight size={18} />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
