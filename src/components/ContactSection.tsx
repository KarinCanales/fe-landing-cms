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
import type { ContactData, ServicesData, SiteSettingsData } from "@/sanity/types";
import { resolveIcon } from "@/sanity/icons";
import { resolveImageWithUrl } from "@/sanity/image";
import { fallbackServices, WHATSAPP_URL, CONTACT_EMAIL, QUOTE_EMAIL } from "@/data/fallbacks";

type Props = {
  sanityData?: ContactData;
  sanitySettings?: SiteSettingsData;
  sanityServices?: ServicesData;
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

function formatPhoneDisplay(value?: string | null) {
  const raw = value?.trim();
  if (!raw) return '';
  return raw.replace(/^https?:\/\/(wa\.me|api\.whatsapp\.com)\/?/i, '').replace(/^send\?phone=/i, '').replace(/[^\d+]/g, '');
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


export default function ContactSection({ sanityData, sanitySettings, sanityServices }: Props) {
  const d = sanityData;
  const eventTypeLabelId = "event-type-label";
  const eventTypeMenuId = "event-type-options";

  const eyebrow = d?.eyebrow || "Conversemos sobre tu evento";
  const titleText = d?.title || "Cuéntanos qué estás imaginando.";
  const highlightWord = d?.highlightWord || " Karin se encarga de cuidar los detalles.";
  const description =
    d?.description ||
    "Déjanos una breve idea de la celebración. Al continuar, se abrirá tu app de correo con el mensaje listo para enviar.";

  const contactEmail = sanitySettings?.email || CONTACT_EMAIL;
  const quoteEmail = sanitySettings?.quoteEmail || QUOTE_EMAIL || contactEmail;
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
    const serviceTitles = sanityServices?.services?.length
      ? sanityServices.services
          .filter((service) => service.visible !== false && service.title)
          .map((service) => service.title?.trim() || "")
          .filter(Boolean)
      : fallbackServices.map((service) => service.title);

    return Array.from(new Set([...serviceTitles, "Otro"]));
  }, [sanityServices]);

  const contactCards = useMemo<DisplayContactCard[]>(() => {
    const whatsappHref = normalizeWhatsappUrl(sanitySettings?.whatsapp) || WHATSAPP_URL;
    const cards: DisplayContactCard[] = [
      {
        label: "WhatsApp",
        value: formatPhoneDisplay(sanitySettings?.whatsapp) || '922459810',
        href: whatsappHref,
        icon: "message-circle",
        external: true,
      },
      {
        label: "Email",
        value: contactEmail,
        href: `mailto:${contactEmail}`,
        icon: "mail",
        external: false,
      },
    ];

    if (quoteEmail && quoteEmail !== contactEmail) {
      cards.push({
        label: "Cotizaciones",
        value: quoteEmail,
        href: `mailto:${quoteEmail}`,
        icon: "mail",
        external: false,
      });
    }

    if (sanitySettings?.schedule) {
      cards.push({
        label: "Horario",
        value: sanitySettings.schedule,
        href: "#contacto",
        icon: "clock3",
        external: false,
      });
    }

    return cards;
  }, [contactEmail, quoteEmail, sanitySettings]);

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

    const subject = `Cotización web Karin - ${form.eventType}`;
    const body = [
      "Hola Karin,",
      "",
      "Quisiera solicitar una cotización para un evento.",
      "",
      `Nombre: ${form.name.trim()}`,
      `Teléfono: ${form.phone.trim() || "No indicado"}`,
      `Tipo de evento: ${form.eventType}`,
      `Fecha tentativa: ${form.eventDate || "No indicada"}`,
      "",
      "Mensaje:",
      form.message.trim(),
    ].join("\n");

    window.location.href = `mailto:${quoteEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("success");
    setFeedback("Se abrió tu app de correo con la solicitud de cotización preparada.");
  };

  if (d?.visible === false) return null;

  return (
    <section id="contacto" className={styles.contactSection} style={sectionStyle}>
      <span id="Contacto" className={styles.legacyAnchor} aria-hidden="true" />
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
                    rel={card.external ? "noopener noreferrer" : undefined}
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
              <span id={eventTypeLabelId}>Tipo de evento</span>

              <div className={styles.customSelect} ref={eventTypeRef}>
                <button
                  type="button"
                  className={`${styles.selectButton} ${form.eventType ? styles.selectButtonFilled : ""} ${
                    isEventTypeOpen ? styles.selectButtonOpen : ""
                  }`}
                  onClick={() => setIsEventTypeOpen((current) => !current)}
                  aria-haspopup="listbox"
                  aria-expanded={isEventTypeOpen}
                  aria-controls={eventTypeMenuId}
                  aria-labelledby={eventTypeLabelId}
                >
                  {form.eventType || "Selecciona una opción"}
                  <ChevronDown size={17} />
                </button>

                <input type="hidden" name="eventType" value={form.eventType} required />

                {isEventTypeOpen && (
                  <div
                    id={eventTypeMenuId}
                    className={styles.selectMenu}
                    role="listbox"
                    aria-labelledby={eventTypeLabelId}
                  >
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
              role={status === "error" ? "alert" : "status"}
              aria-live={status === "error" ? "assertive" : "polite"}
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
