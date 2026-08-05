"use client";

import { useEffect, useRef, useState } from "react";
import BenefitsSection from "@/components/BenefitsSection";
import CatalogSection from "@/components/CatalogSection";
import ContactFormSection from "@/components/ContactSection";
import FooterSection from "@/components/FooterSection";
import HeroSection from "@/components/HeroSection";
import SectionFade from "@/components/SectionFade";
import ServicesSection from "@/components/ServiceSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import type { HomePageData } from "@/sanity/types";

type HomeClientSectionsProps = {
  data: HomePageData;
};

export default function HomeClientSections({ data }: HomeClientSectionsProps) {
  const [recoveryKey, setRecoveryKey] = useState(0);
  const lastRecoveryAtRef = useRef(0);

  useEffect(() => {
    const recover = () => {
      const now = window.performance.now();

      if (now - lastRecoveryAtRef.current < 80) return;

      lastRecoveryAtRef.current = now;
      setRecoveryKey((current) => current + 1);

      window.requestAnimationFrame(() => {
        window.karinResumeLenis?.();
        window.dispatchEvent(new Event("resize"));
      });
    };

    window.addEventListener("karin:home-route-restored", recover);
    window.addEventListener("karin:back-forward-recovery", recover);

    return () => {
      window.removeEventListener("karin:home-route-restored", recover);
      window.removeEventListener("karin:back-forward-recovery", recover);
    };
  }, []);

  return (
    <>
      <HeroSection
        key={`hero-${recoveryKey}`}
        sanityData={data.hero}
        sanitySettings={data.settings}
      />
      <SectionFade variant="darkToLight" />
      <BenefitsSection
        key={`benefits-${recoveryKey}`}
        sanityData={data.benefits}
      />
      <SectionFade variant="lightToDark" />
      <ServicesSection
        key={`services-${recoveryKey}`}
        sanityData={data.services}
      />
      <SectionFade variant="darkToLight" />
      <TestimonialsSection
        key={`testimonials-${recoveryKey}`}
        sanityData={data.testimonials}
      />
      <SectionFade variant="lightToDark" />
      <CatalogSection
        key={`catalog-${recoveryKey}`}
        sanityData={data.catalog}
      />
      <SectionFade variant="darkToWarm" />
      <ContactFormSection
        key={`contact-${recoveryKey}`}
        sanityData={data.contact}
        sanitySettings={data.settings}
        sanityServices={data.services}
      />
      <SectionFade variant="warmToDark" />
      <FooterSection
        key={`footer-${recoveryKey}`}
        sanityData={data.footer}
        sanitySettings={data.settings}
        sanityServices={data.services}
      />
    </>
  );
}
