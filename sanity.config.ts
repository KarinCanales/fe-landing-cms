import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {
  Contact,
  Gem,
  HeartHandshake,
  Home,
  Image as ImageIcon,
  MessageCircleHeart,
  Settings,
  Sparkles,
} from 'lucide-react';
import {schemaTypes} from './src/sanity/schemas';
import {FieldHelp} from './src/sanity/components/FieldHelp';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01';

export default defineConfig({
  name: 'karin-eventos',
  title: 'Karin Eventos — Panel de edición',
  projectId,
  dataset,
  apiVersion,
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenido editable')
          .items([
            S.listItem()
              .title('Datos generales del sitio')
              .icon(Settings)
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.listItem()
              .title('Inicio / Primera pantalla')
              .icon(Home)
              .child(S.document().schemaType('heroSection').documentId('heroSection')),
            S.listItem()
              .title('Beneficios')
              .icon(Gem)
              .child(S.document().schemaType('benefitsSection').documentId('benefitsSection')),
            S.listItem()
              .title('Servicios')
              .icon(HeartHandshake)
              .child(S.document().schemaType('servicesSection').documentId('servicesSection')),
            S.listItem()
              .title('Catálogo visual')
              .icon(ImageIcon)
              .child(S.document().schemaType('catalogSection').documentId('catalogSection')),
            S.listItem()
              .title('Testimonios')
              .icon(MessageCircleHeart)
              .child(S.document().schemaType('testimonialsSection').documentId('testimonialsSection')),
            S.listItem()
              .title('Contacto')
              .icon(Contact)
              .child(S.document().schemaType('contactSection').documentId('contactSection')),
            S.listItem()
              .title('Parte final')
              .icon(Sparkles)
              .child(S.document().schemaType('footerSection').documentId('footerSection')),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
  },
  form: {
    components: {
      field: FieldHelp,
    },
  },
});
