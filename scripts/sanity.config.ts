import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
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
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.listItem()
              .title('Inicio / Primera pantalla')
              .child(S.document().schemaType('heroSection').documentId('heroSection')),
            S.listItem()
              .title('Beneficios')
              .child(S.document().schemaType('benefitsSection').documentId('benefitsSection')),
            S.listItem()
              .title('Servicios')
              .child(S.document().schemaType('servicesSection').documentId('servicesSection')),
            S.listItem()
              .title('Catálogo visual')
              .child(S.document().schemaType('catalogSection').documentId('catalogSection')),
            S.listItem()
              .title('Testimonios')
              .child(S.document().schemaType('testimonialsSection').documentId('testimonialsSection')),
            S.listItem()
              .title('Contacto')
              .child(S.document().schemaType('contactSection').documentId('contactSection')),
            S.listItem()
              .title('Footer / Parte final')
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
