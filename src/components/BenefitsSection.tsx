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

const meteorSettings = [
  { top: "6%", left: "6%", delay: "-1.2s", duration: "7.6s" },
  { top: "12%", left: "22%", delay: "-3.1s", duration: "8.4s" },
  { top: "18%", left: "48%", delay: "-5.2s", duration: "6.8s" },
  { top: "25%", left: "74%", delay: "-2.4s", duration: "9.2s" },
  { top: "34%", left: "12%", delay: "-6.8s", duration: "7.2s" },
  { top: "42%", left: "38%", delay: "-4.4s", duration: "8.8s" },
  { top: "50%", left: "66%", delay: "-0.8s", duration: "7.8s" },
  { top: "58%", left: "88%", delay: "-7.1s", duration: "9.6s" },
  { top: "68%", left: "18%", delay: "-2.9s", duration: "8.2s" },
  { top: "76%", left: "52%", delay: "-5.9s", duration: "7.4s" },
  { top: "84%", left: "80%", delay: "-8.2s", duration: "9s" },
  { top: "92%", left: "34%", delay: "-1.9s", duration: "8.6s" },
  { top: "9%", left: "92%", delay: "-4.9s", duration: "7s" },
  { top: "21%", left: "4%", delay: "-6.2s", duration: "9.4s" },
  { top: "30%", left: "58%", delay: "-3.8s", duration: "8s" },
  { top: "39%", left: "96%", delay: "-7.8s", duration: "9.8s" },
  { top: "47%", left: "26%", delay: "-2.1s", duration: "8.1s" },
  { top: "55%", left: "6%", delay: "-5.6s", duration: "7.7s" },
  { top: "63%", left: "74%", delay: "-3.4s", duration: "8.9s" },
  { top: "72%", left: "96%", delay: "-6.6s", duration: "9.1s" },
  { top: "80%", left: "44%", delay: "-1.4s", duration: "7.3s" },
  { top: "88%", left: "60%", delay: "-4.1s", duration: "8.5s" },
  { top: "15%", left: "68%", delay: "-8.7s", duration: "9.7s" },
  { top: "66%", left: "2%", delay: "-0.7s", duration: "7.9s" },
  { top: "5%", left: "14%", delay: "-9.4s", duration: "8.2s" },
  { top: "14%", left: "36%", delay: "-10.2s", duration: "7.4s" },
  { top: "23%", left: "84%", delay: "-11.1s", duration: "9.1s" },
  { top: "31%", left: "24%", delay: "-9.8s", duration: "8.7s" },
  { top: "46%", left: "92%", delay: "-10.7s", duration: "7.9s" },
  { top: "61%", left: "16%", delay: "-11.8s", duration: "8.5s" },
  { top: "73%", left: "42%", delay: "-9.1s", duration: "9.4s" },
  { top: "89%", left: "70%", delay: "-10.9s", duration: "7.6s" },
];

function Meteors() {
  return (
    <div className={styles.meteors} aria-hidden="true">
      {meteorSettings.map((m, i) => (
        <span
          key={i}
          className={styles.meteor}
          style={{
            "--meteor-top": m.top,
            "--meteor-left": m.left,
            "--meteor-delay": m.delay,
            "--meteor-duration": m.duration,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}

export default function BenefitsSection({ sanityData }: Props) {
  const d = sanityData;

  const bgImage = resolveImageWithUrl(d?.backgroundImage, d?.backgroundImageUrl, "/images/2-beneficios/img-beneficios.webp", "background");

  const eyebrow = d?.eyebrow || "Excelencia garantizada";
  const titleText = d?.title || "Tu tranquilidad es nuestro";
  const highlightWord = d?.highlightWord || "mayor lujo.";
  const description =
    d?.description ||
    "Elevamos cada aspecto de tu celebración mediante un estándar de servicio impecable, una coordinación precisa y una mirada editorial única.";

  const cards = useMemo(() => {
    const raw = d?.cards?.length
      ? d.cards.filter((c) => c.visible !== false)
      : fallbackBenefitCards;
    return raw.map((c) => ({
      Icon: resolveIcon(c.icon),
      eyebrow: c.eyebrow || "",
      title: c.title || "",
      desc: c.description || "",
      size: c.size || "sm",
    }));
  }, [d]);

  const stats = useMemo(() => {
    const raw = d?.stats?.length
      ? d.stats.filter((s) => s.visible !== false)
      : fallbackStats;
    return raw.map((s) => ({ value: s.value || "", label: s.label || "" }));
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
      <div className={styles.backgroundWash} aria-hidden="true" />
      <div className={styles.gridTexture} aria-hidden="true" />

      <Meteors />

      <div className={styles.orbOne} aria-hidden="true" />
      <div className={styles.orbTwo} aria-hidden="true" />
      <div className={styles.orbThree} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.layout}>
          <motion.div
            className={styles.copy}
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
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

          <div className={styles.cardsGrid}>
            {cards.map((item, index) => {
              const Icon = item.Icon;
              return (
                <motion.article
                  key={item.title}
                  className={`${styles.card} ${
                    item.size === "lg" ? styles.cardLarge : ""
                  } ${item.size === "md" ? styles.cardWide : ""}`}
                  initial={{ opacity: 0, y: 34, scale: 0.985 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    duration: 0.62,
                    delay: index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className={styles.cardShine} aria-hidden="true" />
                  <div className={styles.cardTop}>
                    <div className={styles.iconBox}>
                      <Icon size={24} />
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

        <motion.div
          className={styles.stats}
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.64, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <span>{stat.value}</span>
              <small>{stat.label}</small>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
