import type { Metadata } from "next";
import type { HomePageData, ServiceItem, SiteSettingsData } from "@/sanity/types";
import {
  CONTACT_EMAIL,
  fallbackServices,
  QUOTE_EMAIL,
  WHATSAPP_NUMBER,
} from "@/data/fallbacks";
import { resolveLogoImage } from "@/sanity/image";
import {
  absoluteUrl,
  DEFAULT_SOCIAL_IMAGE,
  DEFAULT_SOCIAL_IMAGE_ALT,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site";

function cleanText(value?: string | null) {
  const text = value?.trim();
  return text || undefined;
}

function cleanUrl(value?: string | null) {
  const text = cleanText(value);
  if (!text || text === "#") return undefined;
  return /^https?:\/\//i.test(text) ? text : undefined;
}

function cleanPhone(value?: string | null) {
  return value?.replace(/\D/g, "") || "";
}

function schemaTelephone(value?: string | null) {
  const phone = cleanPhone(value) || WHATSAPP_NUMBER;
  return phone ? `+${phone}` : undefined;
}

function localOrAbsoluteUrl(path?: string | null) {
  const value = cleanText(path);
  if (!value) return undefined;
  return /^https?:\/\//i.test(value) ? value : absoluteUrl(value);
}

function getSocialImage() {
  return absoluteUrl(DEFAULT_SOCIAL_IMAGE);
}

export function buildHomeMetadata(settings?: SiteSettingsData): Metadata {
  const title = cleanText(settings?.seo?.title) || SITE_TITLE;
  const description = cleanText(settings?.seo?.description) || SITE_DESCRIPTION;
  const socialImage = getSocialImage();

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title,
      description,
      url: "/",
      siteName: cleanText(settings?.companyName) || SITE_NAME,
      locale: SITE_LOCALE,
      type: "website",
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: DEFAULT_SOCIAL_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: socialImage,
          alt: DEFAULT_SOCIAL_IMAGE_ALT,
        },
      ],
    },
  };
}

function visibleServices(services?: ServiceItem[]) {
  const source = services?.length
    ? services.filter((service) => service.visible !== false)
    : fallbackServices;

  return source
    .map((service) => ({
      title: cleanText(service.title),
      description: cleanText(service.description),
    }))
    .filter((service) => service.title);
}

function getAddressFromLocation(location?: string) {
  if (!location) return undefined;

  const lowerLocation = location.toLowerCase();
  const isLima = lowerLocation.includes("lima");
  const isPeru = lowerLocation.includes("peru") || lowerLocation.includes("perú");

  if (!isLima && !isPeru) return undefined;

  return {
    "@type": "PostalAddress",
    ...(isLima ? { addressLocality: "Lima" } : {}),
    ...(isPeru ? { addressCountry: "PE" } : {}),
  };
}

export function buildHomeJsonLd(data: HomePageData) {
  const settings = data.settings;
  const businessName = cleanText(settings?.companyName) || SITE_NAME;
  const description = cleanText(settings?.seo?.description) || SITE_DESCRIPTION;
  const logo = localOrAbsoluteUrl(
    resolveLogoImage(settings?.logo, settings?.logoUrl || "/images/_logo/logo.webp"),
  );
  const image = localOrAbsoluteUrl(getSocialImage());
  const location = cleanText(settings?.location) || "Lima, Peru";
  const sameAs = (settings?.socialLinks || [])
    .filter((social) => social.visible !== false)
    .map((social) => cleanUrl(social.url))
    .filter((url): url is string => Boolean(url));
  const telephone = schemaTelephone(settings?.whatsapp);
  const email = cleanText(settings?.email) || CONTACT_EMAIL;
  const quoteEmail = cleanText(settings?.quoteEmail) || QUOTE_EMAIL;
  const address = getAddressFromLocation(location);
  const services = visibleServices(data.services?.services);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: businessName,
        url: SITE_URL,
        inLanguage: "es-PE",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: businessName,
        url: SITE_URL,
        description,
        ...(logo ? { logo: { "@type": "ImageObject", url: logo } } : {}),
        ...(image ? { image } : {}),
        ...(sameAs.length ? { sameAs } : {}),
        ...(email ? { email } : {}),
      },
      {
        "@type": ["LocalBusiness", "EventPlanningBusiness"],
        "@id": `${SITE_URL}/#localbusiness`,
        name: businessName,
        url: SITE_URL,
        description,
        ...(image ? { image } : {}),
        ...(logo ? { logo } : {}),
        ...(telephone ? { telephone } : {}),
        ...(email ? { email } : {}),
        ...(quoteEmail && quoteEmail !== email ? { contactPoint: [{ "@type": "ContactPoint", email: quoteEmail, contactType: "sales" }] } : {}),
        ...(location ? { areaServed: location } : {}),
        ...(address ? { address } : {}),
        ...(sameAs.length ? { sameAs } : {}),
      },
      ...(services.length
        ? [
            {
              "@type": "ItemList",
              "@id": `${SITE_URL}/#services`,
              name: "Servicios de Karin Cadenas",
              itemListElement: services.map((service, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "Service",
                  name: service.title,
                  ...(service.description ? { description: service.description } : {}),
                  provider: { "@id": `${SITE_URL}/#organization` },
                  areaServed: location,
                },
              })),
            },
          ]
        : []),
    ],
  };
}

export function stringifyJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
