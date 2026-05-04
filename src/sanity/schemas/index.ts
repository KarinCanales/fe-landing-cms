export {default as siteSettings} from './siteSettings';
export {default as navbarSettings} from './navbarSettings';
export {default as heroSection} from './heroSection';
export {default as benefitsSection} from './benefitsSection';
export {default as servicesSection} from './servicesSection';
export {default as catalogSection} from './catalogSection';
export {default as testimonialsSection} from './testimonialsSection';
export {default as contactSection} from './contactSection';
export {default as footerSection} from './footerSection';

export {iconList, overlayPresets, sectionThemes, navbarThemes, cardSizes} from './shared';

import siteSettingsSchema from './siteSettings';
import navbarSettingsSchema from './navbarSettings';
import heroSectionSchema from './heroSection';
import benefitsSectionSchema from './benefitsSection';
import servicesSectionSchema from './servicesSection';
import catalogSectionSchema from './catalogSection';
import testimonialsSectionSchema from './testimonialsSection';
import contactSectionSchema from './contactSection';
import footerSectionSchema from './footerSection';

export const schemaTypes = [
  siteSettingsSchema,
  navbarSettingsSchema,
  heroSectionSchema,
  benefitsSectionSchema,
  servicesSectionSchema,
  catalogSectionSchema,
  testimonialsSectionSchema,
  contactSectionSchema,
  footerSectionSchema,
];
