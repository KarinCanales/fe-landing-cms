"use client";

import type { CSSProperties } from "react";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Flower2, Sparkles } from "lucide-react";
import styles from "./BenefitsSection.module.css";
import type { BenefitsData } from "@/sanity/types";
import { resolveIcon } from "@/sanity/icons";
import { fallbackBenefitCards, fallbackStats } from "@/data/fallbacks";
import { resolveImageWithUrl } from "@/sanity/image";

type Props = { sanityData?: BenefitsData };

const dustParticles = [
  { top: "9%", left: "9%", delay: "-1.2s", duration: "12s" },
  { top: "14%", left: "28%", delay: "-5.8s", duration: "15s" },
  { top: "18%", left: "68%", delay: "-9.2s", duration: "13s" },
  { top: "25%", left: "88%", delay: "-3.2s", duration: "17s" },
  { top: "34%", left: "16%", delay: "-7.4s", duration: "14s" },
  { top: "43%", left: "42%", delay: "-10.1s", duration: "18s" },
  { top: "52%", left: "74%", delay: "-4.6s", duration: "15s" },
  { top: "62%", left: "5%", delay: "-8.4s", duration: "16s" },
  { top: "70%", left: "34%", delay: "-2.8s", duration: "13s" },
  { top: "78%", left: "61%", delay: "-6.6s", duration: "17s" },
  { top: "86%", left: "86%", delay: "-11.2s", duration: "14s" },
  { top: "92%", left: "22%", delay: "-4.9s", duration: "19s" },
  { top: "12%", left: "96%", delay: "-13.2s", duration: "18s" },
  { top: "68%", left: "96%", delay: "-12.4s", duration: "15s" },
];

const meteorStreaks = [
  { top: "9%", left: "24%", delay: "-2.6s", duration: "9.5s", size: "82px" },
  { top: "17%", left: "62%", delay: "-6.8s", duration: "11s", size: "112px" },
  { top: "28%", left: "88%", delay: "-1.1s", duration: "10.5s", size: "76px" },
  { top: "44%", left: "42%", delay: "-8.4s", duration: "12s", size: "98px" },
  { top: "57%", left: "76%", delay: "-4.2s", duration: "10s", size: "86px" },
  { top: "74%", left: "28%", delay: "-10.4s", duration: "13s", size: "104px" },
  { top: "82%", left: "92%", delay: "-12.4s", duration: "12.5s", size: "72px" },
];

function AmbientDust() {
  return (
    <div className={styles.dustField} aria-hidden="true">
      {dustParticles.map((particle, index) => (
        <span
          key={index}
          className={styles.dustParticle}
          style={
            {
              "--dust-top": particle.top,
              "--dust-left": particle.left,
              "--dust-delay": particle.delay,
              "--dust-duration": particle.duration,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

function MeteorField() {
  return (
    <div className={styles.meteorField} aria-hidden="true">
      {meteorStreaks.map((meteor, index) => (
        <span
          key={index}
          className={styles.meteorStreak}
          style={
            {
              "--meteor-top": meteor.top,
              "--meteor-left": meteor.left,
              "--meteor-delay": meteor.delay,
              "--meteor-duration": meteor.duration,
              "--meteor-size": meteor.size,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

function OrbitalAccent() {
  return (
    <div className={styles.orbitalField} aria-hidden="true">
      <span className={`${styles.orbitRing} ${styles.orbitRingOuter}`} />
      <span className={`${styles.orbitRing} ${styles.orbitRingInner}`} />
      <span className={styles.orbitDot} />
    </div>
  );
}

export default function BenefitsSection({ sanityData }: Props) {
  const d = sanityData;

  const bgImage = resolveImageWithUrl(
    d?.backgroundImage,
    d?.backgroundImageUrl,
    "/images/2-beneficios/img-beneficios.webp",
    "background",
  );

  const eyebrow = d?.eyebrow || "Excelencia garantizada";
  const titleText = d?.title || "Beneficios para tu";
  const highlightWord = d?.highlightWord || "celebración.";
  const description =
    d?.description ||
    "Elevamos cada aspecto de tu celebración mediante un estándar de servicio impecable, una coordinación precisa y una mirada editorial única.";

  const cards = useMemo(() => {
    const raw = d?.cards?.length
      ? d.cards.filter((card) => card.visible !== false)
      : fallbackBenefitCards;

    return raw.map((card, index) => ({
      Icon: resolveIcon(card.icon),
      eyebrow: card.eyebrow || "Detalle Karin",
      title: card.title || "Beneficio especial",
      desc: card.description || "Una experiencia cuidada para que cada etapa se sienta impecable.",
      size: card.size || (index === 0 ? "lg" : "sm"),
    }));
  }, [d]);

  const stats = useMemo(() => {
    const raw = d?.stats?.length
      ? d.stats.filter((stat) => stat.visible !== false)
      : fallbackStats;

    return raw.map((stat) => ({ value: stat.value || "", label: stat.label || "" }));
  }, [d]);

  if (d?.visible === false) return null;

  const sectionStyle = {
    "--benefits-bg-image": `url("${bgImage}")`,
  } as CSSProperties;

  return (
    <section
      className={styles.benefits}
      data-section-id="beneficios"
      style={sectionStyle}
    >
      <div
        className={styles.sanityBackgroundImage}
        style={{ backgroundImage: `url("${bgImage}")` } as CSSProperties}
        aria-hidden="true"
      />
      <div className={styles.colorVeil} aria-hidden="true" />
      <div className={styles.diagonalLines} aria-hidden="true" />
      <div className={styles.gridTexture} aria-hidden="true" />
      <AmbientDust />
      <MeteorField />
      <OrbitalAccent />
      <div className={styles.blurOrbOne} aria-hidden="true" />
      <div className={styles.blurOrbTwo} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.layout}>
          <motion.div
            className={styles.copy}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              id="beneficios"
              data-scroll-anchor
              className="scrollAnchor"
              aria-hidden="true"
            />

            <span className={styles.kicker}>
              <Sparkles size={15} />
              {eyebrow}
            </span>

            <h2>
              {titleText} <em>{highlightWord}</em>
            </h2>

            <p>{description}</p>

            <div className={styles.copyLine} aria-hidden="true">
              <span />
              <Flower2 size={16} />
            </div>
          </motion.div>

          <div className={styles.cardsPanel}>
            <div className={styles.cardsGrid}>
              {cards.map((item, index) => {
                const Icon = item.Icon;
                return (
                  <motion.article
                    key={`${item.title}-${index}`}
                    className={`${styles.card} ${
                      item.size === "lg" ? styles.cardLarge : ""
                    } ${item.size === "md" ? styles.cardWide : ""}`}
                    initial={false}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.62,
                      delay: index * 0.045,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <div className={styles.cardShine} aria-hidden="true" />
                    <div className={styles.cardTop}>
                      <div className={styles.iconBox}>
                        <Icon size={23} />
                      </div>
                      <span>{item.eyebrow}</span>
                    </div>
                    <div className={styles.cardBody}>
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                    <div className={styles.cardLine} aria-hidden="true">
                      <span />
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>

        <motion.div
          className={styles.stats}
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {stats.map((stat) => (
            <div key={`${stat.value}-${stat.label}`} className={styles.stat}>
              <span>{stat.value}</span>
              <small>{stat.label}</small>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
