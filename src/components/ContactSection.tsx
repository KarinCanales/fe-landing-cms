"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  ChevronDown,
  CheckCircle2,
  Phone,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import styles from "./ContactSection.module.css";
import type { ContactData, SiteSettingsData } from "@/sanity/types";
import { resolveIcon } from "@/sanity/icons";
import { resolveImageWithUrl } from "@/sanity/image";
import { fallbackEventTypes, WHATSAPP_URL, CONTACT_EMAIL } from "@/data/fallbacks";

type Props = {
  sanityData?: ContactData;
  sanitySettings?: SiteSettingsData;
};

type FormStatus = "idle" | "success" | "error";

type ContactFormState = {
  name: string;
  phone: string;
  eventType: string;
  eventDate: string;
  message: string;
  website: string;
};

type DisplayContactCard = {
  label: string;
  value: string;
  href: string;
  icon: string;
  external?: boolean;
};

const initialFormState: ContactFormState = {
  name: "",
  phone: "",
  eventType: "",
  eventDate: "",
  message: "",
  website: "",
};

function cleanPhone(value?: string | null) {
  return value?.replace(/\D/g, "") || "";
}

function normalizeWhatsappUrl(value?: string | null) {
  const raw = value?.trim();

  if (!raw) return "";

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }

  const phone = cleanPhone(raw);

  if (!phone || phone.length < 8) return "";

  return `https://wa.me/${phone}`;
}

function normalizeContactType(value?: string | null) {
  return value?.trim().toLowerCase() || "";
}

function getDefaultIcon(type: string) {
  if (type.includes("whatsapp")) return "message-circle";
  if (type.includes("email") || type.includes("correo") || type.includes("mail")) return "mail";
  if (type.includes("phone") || type.includes("tel") || type.includes("telefono") || type.includes("teléfono")) return "phone";
  if (type.includes("ubic") || type.includes("map") || type.includes("direc")) return "map-pin";
  if (type.includes("horario") || type.includes("schedule") || type.includes("clock")) return "clock3";
  return "sparkles";
}

function getDefaultLabel(type: string) {
  if (type.includes("whatsapp")) return "WhatsApp";
  if (type.includes("email") || type.includes("correo") || type.includes("mail")) return "Correo";
  if (type.includes("phone") || type.includes("tel") || type.includes("telefono") || type.includes("teléfono")) return "Teléfono";
  if (type.includes("ubic") || type.includes("map") || type.includes("direc")) return "Ubicación";
  if (type.includes("horario") || type.includes("schedule") || type.includes("clock")) return "Horario";
  return "Contacto";
}

function buildCardHref({
  type,
  link,
  value,
  settings,
}: {
  type: string;
  link?: string | null;
  value?: string | null;
  settings?: SiteSettingsData;
}) {
  const rawLink = link?.trim();

  if (rawLink) {
    if (rawLink.startsWith("mailto:") || rawLink.startsWith("tel:") || rawLink.startsWith("#")) {
      return rawLink;
    }

    if (rawLink.startsWith("http://") || rawLink.startsWith("https://")) {
      return rawLink;
    }

    if (type.includes("whatsapp")) {
      return normalizeWhatsappUrl(rawLink) || WHATSAPP_URL;
    }

    return rawLink;
  }

  if (type.includes("whatsapp")) {
    return normalizeWhatsappUrl(value) || normalizeWhatsappUrl(settings?.whatsapp) || WHATSAPP_URL;
  }

  if (type.includes("email") || type.includes("correo") || type.includes("mail")) {
    const email = value?.trim() || settings?.email || CONTACT_EMAIL;
    return `mailto:${email}`;
  }

  if (type.includes("phone") || type.includes("tel") || type.includes("telefono") || type.includes("teléfono")) {
    const phone = value?.trim() || settings?.phone || settings?.whatsapp || "";
    return phone ? `tel:${cleanPhone(phone)}` : "#contacto";
  }

  if (type.includes("ubic") || type.includes("map") || type.includes("direc")) {
    const location = value?.trim() || settings?.location || "";
    return location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}` : "#contacto";
  }

  return "#contacto";
}

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export default function ContactSection({ sanityData, sanitySettings }: Props) {
  const d = sanityData;

  const eyebrow = d?.eyebrow || "Conversemos sobre tu evento";
  const titleText = d?.title || "Cuéntanos qué estás imaginando.";
  const highlightWord = d?.highlightWord || " Karin se encarga de cuidar los detalles.";
  const description =
    d?.description ||
    "Déjanos una breve idea de la celebración. Al continuar, se abrirá tu app de correo con el mensaje listo para enviar.";

  const contactEmail = sanitySettings?.email || CONTACT_EMAIL;
  const backgroundImage = resolveImageWithUrl(d?.backgroundImage, d?.backgroundImageUrl, "/images/_miscelanea/velas.webp", "background");

  const sectionStyle = {
    "--contact-bg-image": `url(${JSON.stringify(backgroundImage)})`,
  } as CSSProperties;

  const formTitle = d?.form?.title || "Formulario de contacto";
  const formDescription =
    d?.form?.description ||
    "Completa la información y prepararemos el correo automáticamente.";
  const submitLabel = d?.form?.submitLabel || "Preparar correo";

  const eventTypes = useMemo(() => {
    if (d?.form?.eventTypes?.length) {
      const visible = d.form.eventTypes
        .filter((eventType) => eventType.visible !== false && eventType.label)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((eventType) => eventType.label || "");

      if (d.form.includeOtherOption !== false && !visible.includes("Otro")) {
        visible.push("Otro");
      }

      return visible;
    }

    return fallbackEventTypes;
  }, [d?.form]);

  const contactCards = useMemo<DisplayContactCard[]>(() => {
    const rawCards = d?.contactCards || [];

    if (rawCards.length) {
      return rawCards
        .filter((card) => card.visible !== false)
        .map((card) => {
          const type = normalizeContactType(card.type);
          const label = card.label?.trim() || getDefaultLabel(type);
          const value =
            card.value?.trim() ||
            (type.includes("whatsapp")
              ? "Respuesta rápida"
              : type.includes("email") || type.includes("correo") || type.includes("mail")
                ? contactEmail
                : type.includes("phone") || type.includes("tel") || type.includes("telefono") || type.includes("teléfono")
                  ? sanitySettings?.phone || sanitySettings?.whatsapp || "Contacto directo"
                  : type.includes("ubic") || type.includes("map") || type.includes("direc")
                    ? sanitySettings?.location || "Ver ubicación"
                    : type.includes("horario") || type.includes("schedule") || type.includes("clock")
                      ? sanitySettings?.schedule || "Consultar disponibilidad"
                      : "Más información");
          const href = buildCardHref({ type, link: card.link, value: card.value, settings: sanitySettings });

          return {
            label,
            value,
            href,
            icon: card.icon || getDefaultIcon(type),
            external: isExternalHref(href),
          };
        });
    }

    const whatsappHref = normalizeWhatsappUrl(sanitySettings?.whatsapp) || WHATSAPP_URL;

    return [
      {
        label: "WhatsApp",
        value: "Respuesta rápida",
        href: whatsappHref,
        icon: "message-circle",
        external: true,
      },
      {
        label: "Correo",
        value: contactEmail,
        href: `mailto:${contactEmail}`,
        icon: "mail",
        external: false,
      },
    ];
  }, [contactEmail, d?.contactCards, sanitySettings]);

  const [form, setForm] = useState<ContactFormState>(initialFormState);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState("");
  const [isEventTypeOpen, setIsEventTypeOpen] = useState(false);
  const eventTypeRef = useRef<HTMLDivElement>(null);

  const updateField = (field: keyof ContactFormState, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const selectEventType = (type: string) => {
    updateField("eventType", type);
    setIsEventTypeOpen(false);
  };

  useEffect(() => {
    if (!isEventTypeOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!eventTypeRef.current?.contains(event.target as Node)) {
        setIsEventTypeOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsEventTypeOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEventTypeOpen]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback("");

    if (form.website) return;

    if (!form.name.trim() || !form.eventType || !form.message.trim()) {
      setStatus("error");
      setFeedback("Completa nombre, tipo de evento y mensaje antes de continuar.");
      return;
    }

    const subject = `Consulta web Karin - ${form.eventType}`;
    const body = [
      "Hola Karin,",
      "",
      "Quisiera consultar por un evento.",
      "",
      `Nombre: ${form.name.trim()}`,
      `Teléfono: ${form.phone.trim() || "No indicado"}`,
      `Tipo de evento: ${form.eventType}`,
      `Fecha tentativa: ${form.eventDate || "No indicada"}`,
      "",
      "Mensaje:",
      form.message.trim(),
    ].join("\n");

    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("success");
    setFeedback("Se abrió tu app de correo con el mensaje preparado.");
  };

  if (d?.visible === false) return null;

  return (
    <section id="contacto" className={styles.contactSection} style={sectionStyle}>
      <div className={styles.paperGlow} aria-hidden="true" />
      <div className={styles.auroraRibbons} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className={styles.lineField} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className={styles.floatingDetails} aria-hidden="true">
        {Array.from({ length: 12 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>
      <div className={styles.meshOne} aria-hidden="true" />
      <div className={styles.meshTwo} aria-hidden="true" />
      <div className={styles.lightSweep} aria-hidden="true" />
      <div className={`${styles.arcaneCircle} ${styles.arcaneCirclePrimary}`} aria-hidden="true">
        <span className={`${styles.arcaneRing} ${styles.arcaneRingOuter}`} />
        <span className={`${styles.arcaneRing} ${styles.arcaneRingMiddle}`} />
        <span className={`${styles.arcaneRing} ${styles.arcaneRingInner}`} />
        <span className={styles.arcaneCrosshairHorizontal} />
        <span className={styles.arcaneCrosshairVertical} />
        <span className={styles.arcaneOrbit} />
        <span className={styles.arcaneOrbitDot} />
        <span className={`${styles.arcaneSpark} ${styles.arcaneSparkOne}`} />
        <span className={`${styles.arcaneSpark} ${styles.arcaneSparkTwo}`} />
      </div>
      <div className={`${styles.arcaneCircle} ${styles.arcaneCircleSecondary}`} aria-hidden="true">
        <span className={`${styles.arcaneRing} ${styles.arcaneRingOuter}`} />
        <span className={`${styles.arcaneRing} ${styles.arcaneRingInner}`} />
        <span className={styles.arcaneOrbit} />
        <span className={styles.arcaneOrbitDot} />
      </div>

      <div className={styles.container}>
        <div className={styles.copyBlock}>
          <span className={styles.eyebrow}>
            <Sparkles size={15} />
            {eyebrow}
          </span>

          <h2>
            {titleText}
            <em>{highlightWord}</em>
          </h2>

          <p>{description}</p>

          {contactCards.length ? (
            <div className={styles.contactCards}>
              {contactCards.map((card) => {
                const Icon = resolveIcon(card.icon, Sparkles);

                return (
                  <a
                    key={`${card.label}-${card.href}`}
                    className={styles.contactCard}
                    href={card.href}
                    target={card.external ? "_blank" : undefined}
                    rel={card.external ? "noreferrer" : undefined}
                  >
                    <span>
                      <Icon size={18} />
                    </span>
                    <div>
                      <strong>{card.label}</strong>
                      <small>{card.value}</small>
                    </div>
                    <ArrowUpRight size={16} />
                  </a>
                );
              })}
            </div>
          ) : null}
        </div>

        <form
          className={`${styles.formCard} ${isEventTypeOpen ? styles.formCardSelectOpen : ""}`}
          onSubmit={handleSubmit}
        >
          <div className={styles.formHeader}>
            <span>{formTitle}</span>
            <p>{formDescription}</p>
          </div>

          <div className={styles.honeypot} aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(event) => updateField("website", event.target.value)}
            />
          </div>

          <div className={styles.fieldGrid}>
            <label className={styles.field}>
              <span>
                <User size={15} /> Nombre
              </span>
              <input
                type="text"
                name="name"
                placeholder="Tu nombre"
                autoComplete="name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                required
              />
            </label>

            <label className={styles.field}>
              <span>
                <Phone size={15} /> Teléfono
              </span>
              <input
                type="tel"
                name="phone"
                placeholder="+51 999 999 999"
                autoComplete="tel"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
              />
            </label>
          </div>

          <div className={`${styles.fieldGrid} ${isEventTypeOpen ? styles.fieldGridSelectOpen : ""}`}>
            <div className={`${styles.field} ${isEventTypeOpen ? styles.fieldSelectOpen : ""}`}>
              <span>Tipo de evento</span>

              <div className={styles.customSelect} ref={eventTypeRef}>
                <button
                  type="button"
                  className={`${styles.selectButton} ${form.eventType ? styles.selectButtonFilled : ""} ${
                    isEventTypeOpen ? styles.selectButtonOpen : ""
                  }`}
                  onClick={() => setIsEventTypeOpen((current) => !current)}
                  aria-haspopup="listbox"
                  aria-expanded={isEventTypeOpen}
                >
                  {form.eventType || "Selecciona una opción"}
                  <ChevronDown size={17} />
                </button>

                <input type="hidden" name="eventType" value={form.eventType} required />

                {isEventTypeOpen && (
                  <div className={styles.selectMenu} role="listbox">
                    {eventTypes.map((eventType) => (
                      <button
                        key={eventType}
                        type="button"
                        className={form.eventType === eventType ? styles.selectOptionActive : ""}
                        onClick={() => selectEventType(eventType)}
                        role="option"
                        aria-selected={form.eventType === eventType}
                      >
                        {eventType}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <label className={styles.field}>
              <span>Fecha tentativa</span>
              <input
                type="date"
                name="eventDate"
                value={form.eventDate}
                onChange={(event) => updateField("eventDate", event.target.value)}
              />
            </label>
          </div>

          <label className={styles.field}>
            <span>Mensaje</span>
            <textarea
              name="message"
              rows={6}
              placeholder="Cuéntanos el tipo de evento, número aproximado de invitados, estilo que buscas o cualquier detalle importante."
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              required
            />
          </label>

          {feedback ? (
            <div
              className={`${styles.feedback} ${
                status === "success" ? styles.feedbackSuccess : styles.feedbackError
              }`}
              role="status"
            >
              {status === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{feedback}</span>
            </div>
          ) : null}

          <button className={styles.submitButton} type="submit">
            {submitLabel}
            <Send size={17} />
          </button>
        </form>
      </div>
    </section>
  );
}
