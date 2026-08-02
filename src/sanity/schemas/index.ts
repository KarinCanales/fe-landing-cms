export {default as siteSettings} from './siteSettings';
export {default as navbarSettings} from './navbarSettings';
export {default as heroSection} from './heroSection';
export {default as benefitsSection} from './benefitsSection';
export {default as servicesSection} from './servicesSection';
export {default as testimonialsSection} from './testimonialsSection';
export {default as catalogSection} from './catalogSection';
export {default as contactSection} from './contactSection';
export {default as footerSection} from './footerSection';
export {default as linksPage} from './linksPage';

export {iconList, overlayPresets, sectionThemes, navbarThemes, cardSizes} from './shared';

import siteSettingsSchema from './siteSettings';
import navbarSettingsSchema from './navbarSettings';
import heroSectionSchema from './heroSection';
import benefitsSectionSchema from './benefitsSection';
import servicesSectionSchema from './servicesSection';
import testimonialsSectionSchema from './testimonialsSection';
import catalogSectionSchema from './catalogSection';
import contactSectionSchema from './contactSection';
import footerSectionSchema from './footerSection';
import linksPageSchema from './linksPage';

export const schemaTypes = [
  siteSettingsSchema,
  navbarSettingsSchema,
  heroSectionSchema,
  benefitsSectionSchema,
  servicesSectionSchema,
  testimonialsSectionSchema,
  catalogSectionSchema,
  contactSectionSchema,
  footerSectionSchema,
  linksPageSchema,
];
