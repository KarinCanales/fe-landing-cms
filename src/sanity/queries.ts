/**
 * GROQ queries organized by section.
 *
 * Cada fondo trae dos cosas:
 * - backgroundImage: objeto editable de Sanity, para transformarlo con image.ts
 * - backgroundImageUrl: URL directa de respaldo, para evitar que una sección se quede sin fondo
 */

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  logo,
  "logoUrl": logo.asset->url,
  companyName,
  companySubtitle,
  whatsapp,
  email,
  quoteEmail,
  phone,
  location,
  schedule,
  domain,
  purchaseNote,
  "socialLinks": socialLinks[]{ name, url, icon, borderColor, visible, order } | order(order asc),
  legalText,
  madeWithText,
  seo { title, description, ogImage, "ogImageUrl": ogImage.asset->url }
}`;

export const NAVBAR_QUERY = `*[_type == "navbarSettings"][0]{
  colorMode,
  "sectionThemes": sectionThemes[]{ sectionId, theme }
}`;

export const HERO_QUERY = `*[_type == "heroSection"][0]{
  visible,
  backgroundImage,
  "backgroundImageUrl": backgroundImage.asset->url,
  backgroundAlt,
  overlay,
  eyebrow,
  titleLine1,
  titleLine2,
  titleLine3,
  highlightWord,
  flipWords,
  subtitle,
  ctaPrimary { label, href },
  ctaSecondary { label, href },
  "featureCards": featureCards[]{ eyebrow, title, description, icon, visible },
  "floatingNotes": floatingNotes[]{ text, icon, visible }
}`;

export const BENEFITS_QUERY = `*[_type == "benefitsSection"][0]{
  visible,
  backgroundImage,
  "backgroundImageUrl": backgroundImage.asset->url,
  backgroundAlt,
  overlay,
  theme,
  eyebrow,
  title,
  highlightWord,
  description,
  "cards": cards[]{ title, eyebrow, description, icon, size, visible, order } | order(order asc),
  "stats": stats[]{ value, label, visible, order } | order(order asc)
}`;

export const SERVICES_QUERY = `*[_type == "servicesSection"][0]{
  visible,
  backgroundImage,
  "backgroundImageUrl": backgroundImage.asset->url,
  backgroundAlt,
  overlay,
  eyebrow,
  title,
  highlightWord,
  leadCard { text, icon, visible },
  footerCard { text, icon, visible },
  "services": services[]{
    title,
    eyebrow,
    description,
    tags,
    image,
    "imageUrl": image.asset->url,
    imageAlt,
    icon,
    visible,
    order
  } | order(order asc)
}`;

export const CATALOG_QUERY = `*[_type == "catalogSection"][0]{
  visible,
  backgroundImage,
  "backgroundImageUrl": backgroundImage.asset->url,
  backgroundAlt,
  overlay,
  eyebrow,
  title,
  highlightWord,
  supportText,
  "items": items[]{
    _key,
    mediaType,
    title,
    category,
    description,
    badge,
    image,
    "imageUrl": image.asset->url,
    imageAlt,
    thumbnail,
    "thumbnailUrl": thumbnail.asset->url,
    thumbnailAlt,
    coverImage,
    "coverImageUrl": coverImage.asset->url,
    coverAlt,
    posterImage,
    "posterImageUrl": posterImage.asset->url,
    posterAlt,
    youtubeUrl,
    videoUrl,
    youtubeLink,
    videoLink,
    url,
    link,
    "legacyVideoAssetUrl": video.asset->url,
    visible,
    featured,
    order
  } | order(order asc)
}`;

export const TESTIMONIALS_QUERY = `*[_id == "testimonialsSection"][0]{
  visible,
  "backgroundImage": coalesce(backgroundImage, testimonialsBackgroundImage, testimonialBackgroundImage, background, backgroundPhoto),
  "backgroundImageUrl": coalesce(backgroundImage.asset->url, testimonialsBackgroundImage.asset->url, testimonialBackgroundImage.asset->url, background.asset->url, backgroundPhoto.asset->url),
  backgroundAlt,
  overlay,
  eyebrow,
  title,
  highlightWord,
  storyPanelLabel,
  "testimonials": testimonials[]{
    names,
    event,
    quote,
    photo,
    "photoUrl": photo.asset->url,
    rating,
    visible,
    order
  } | order(order asc)
}`;

export const CONTACT_QUERY = `*[_type == "contactSection"][0]{
  visible,
  backgroundImage,
  "backgroundImageUrl": backgroundImage.asset->url,
  backgroundAlt,
  overlay,
  eyebrow,
  title,
  highlightWord,
  description,
  form {
    title,
    description,
    submitLabel
  }
}`;

export const FOOTER_QUERY = `*[_type == "footerSection"][0]{
  "backgroundImage": coalesce(backgroundImage, footerBackgroundImage, background, backgroundPhoto),
  "backgroundImageUrl": coalesce(backgroundImage.asset->url, footerBackgroundImage.asset->url, background.asset->url, backgroundPhoto.asset->url),
  backgroundAlt,
  overlay,
  ctaEyebrow,
  ctaTitle,
  ctaHighlightWord,
  ctaButtonLabel,
  brandText,
  madeWithLine,
  backToTopLabel
}`;
