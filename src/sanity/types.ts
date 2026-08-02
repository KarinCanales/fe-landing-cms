/**
 * Sanity CMS types — mirrors the schema definitions.
 * These types describe the shape of data returned by GROQ queries.
 */

// ——————— Shared ———————

export type SanityImage = {
  _type?: 'image';
  asset?: { _ref?: string; url?: string };
  hotspot?: { x: number; y: number; width: number; height: number };
} | null;

export type SanityFile = {
  _type?: 'file';
  asset?: { _ref?: string; url?: string };
} | null;

export type IconName = string;

// ——————— Site Settings ———————

export type SocialLink = {
  name: string;
  url: string;
  icon?: IconName;
  borderColor?: string;
  visible?: boolean;
};

export type SiteSettingsData = {
  logo?: SanityImage;
  logoUrl?: string;
  companyName?: string;
  companySubtitle?: string;
  whatsapp?: string;
  email?: string;
  quoteEmail?: string;
  location?: string;
  schedule?: string;
  socialLinks?: SocialLink[];
  seo?: {
    title?: string;
    description?: string;
    ogImage?: SanityImage;
    ogImageUrl?: string;
  };
} | null;

// ——————— Navbar ———————

export type NavLink = {
  label: string;
  href: string;
  enabled?: boolean;
};

export type NavbarData = {
  colorMode?: 'neutral' | 'adaptive';
  sectionThemes?: Array<{
    sectionId: string;
    theme: 'light' | 'dark' | 'botanical' | 'warm';
  }>;
} | null;

// ——————— Sections ———————

type BaseSectionData = {
  visible?: boolean;
  backgroundImage?: SanityImage;
  backgroundImageUrl?: string;
  backgroundAlt?: string;
};

export type HeroData = BaseSectionData & {
  eyebrow?: string;
  titleLine1?: string;
  titleLine2?: string;
  titleLine3?: string;
  highlightWord?: string;
  flipWords?: string[];
  subtitle?: string;
  ctaPrimary?: { label?: string; href?: string };
  ctaSecondary?: { label?: string; href?: string };
  featureCards?: Array<{
    eyebrow?: string;
    title?: string;
    description?: string;
    icon?: IconName;
    visible?: boolean;
  }>;
  floatingNotes?: Array<{
    text?: string;
    icon?: IconName;
    visible?: boolean;
  }>;
} | null;

export type BenefitCard = {
  title?: string;
  eyebrow?: string;
  description?: string;
  icon?: IconName;
  size?: 'sm' | 'md' | 'lg';
  visible?: boolean;
};

export type StatItem = {
  value?: string;
  label?: string;
  visible?: boolean;
};

export type BenefitsData = BaseSectionData & {
  theme?: 'light' | 'dark';
  eyebrow?: string;
  title?: string;
  highlightWord?: string;
  description?: string;
  cards?: BenefitCard[];
  stats?: StatItem[];
} | null;

export type ServiceItem = {
  title?: string;
  eyebrow?: string;
  description?: string;
  tags?: string[];
  image?: SanityImage;
  imageUrl?: string;
  imageAlt?: string;
  icon?: IconName;
  visible?: boolean;
};

export type ServicesData = BaseSectionData & {
  eyebrow?: string;
  title?: string;
  highlightWord?: string;
  leadCard?: { text?: string; icon?: IconName; visible?: boolean };
  footerCard?: { text?: string; icon?: IconName; visible?: boolean };
  services?: ServiceItem[];
} | null;

export type CatalogItem = {
  _key?: string;
  mediaType?: 'photo' | 'youtube' | 'video' | string;
  title?: string;
  category?: string;
  description?: string;
  badge?: string;

  // Foto subida a Sanity.
  image?: SanityImage;
  imageUrl?: string;
  imageAlt?: string;
  thumbnail?: SanityImage;
  thumbnailUrl?: string;
  thumbnailAlt?: string;

  // Video enlazado desde YouTube. No se suben videos pesados al CMS.
  youtubeUrl?: string;
  videoUrl?: string;
  youtubeLink?: string;
  videoLink?: string;
  url?: string;
  link?: string;

  // Portadas opcionales para videos.
  coverImage?: SanityImage;
  coverImageUrl?: string;
  coverAlt?: string;
  posterImage?: SanityImage;
  posterImageUrl?: string;
  posterAlt?: string;

  // Compatibilidad con datos antiguos del panel.
  legacyVideoAssetUrl?: string;

  visible?: boolean;
  featured?: boolean;
};

export type CatalogData = BaseSectionData & {
  eyebrow?: string;
  title?: string;
  highlightWord?: string;
  supportText?: string;
  items?: CatalogItem[];
} | null;

export type TestimonialItem = {
  names?: string;
  event?: string;
  quote?: string;
  photo?: SanityImage;
  photoUrl?: string;
  rating?: number;
  visible?: boolean;
};

export type TestimonialsData = BaseSectionData & {
  eyebrow?: string;
  title?: string;
  highlightWord?: string;
  storyPanelLabel?: string;
  testimonials?: TestimonialItem[];
} | null;

export type ContactCardItem = {
  type?: string;
  label?: string;
  value?: string;
  icon?: IconName;
  link?: string;
  visible?: boolean;
};

export type EventTypeOption = {
  label?: string;
  visible?: boolean;
};

export type ContactData = BaseSectionData & {
  eyebrow?: string;
  title?: string;
  highlightWord?: string;
  description?: string;
  form?: {
    title?: string;
    description?: string;
    submitLabel?: string;
  };
} | null;

export type FooterNavColumn = {
  title?: string;
  links?: Array<{ label?: string; href?: string }>;
  visible?: boolean;
};

export type FooterData = BaseSectionData & {
  backgroundImageUrl?: string;
  footerBackgroundImage?: SanityImage;
  background?: SanityImage;
  backgroundPhoto?: SanityImage;
  ctaEyebrow?: string;
  ctaTitle?: string;
  ctaHighlightWord?: string;
  ctaButtonLabel?: string;
  ctaButtonLink?: string;
  logo?: SanityImage;
  logoUrl?: string;
  brandText?: string;
  navColumnTitle?: string;
  servicesColumnTitle?: string;
  contactTitle?: string;
  legalText?: string;
  navigationColumns?: FooterNavColumn[];
  serviceLinks?: Array<{ text?: string; link?: string; visible?: boolean }>;
  contactInfo?: { phone?: string; email?: string; location?: string; schedule?: string };
  socialLinks?: SocialLink[];
  madeWithLine?: string;
  madeWithSuffix?: string;
  backToTopLabel?: string;
} | null;

export type LinksPageLink = {
  _key?: string;
  name?: string;
  url?: string;
  type?: 'web' | 'social' | 'whatsapp' | 'email' | 'phone' | 'location' | 'catalog' | 'calendar' | 'video' | 'other' | string;
  icon?: IconName;
  description?: string;
  expandableText?: string;
  email?: string;
  phone?: string;
  active?: boolean;
  featured?: boolean;
  order?: number;
};

export type LinksPageData = {
  title?: string;
  subtitle?: string;
  mainIcon?: IconName;
  links?: LinksPageLink[];
} | null;

// ——————— Aggregated page data ———————

export type HomePageData = {
  settings: SiteSettingsData;
  navbar: NavbarData;
  hero: HeroData;
  benefits: BenefitsData;
  services: ServicesData;
  catalog: CatalogData;
  testimonials: TestimonialsData;
  contact: ContactData;
  footer: FooterData;
};
