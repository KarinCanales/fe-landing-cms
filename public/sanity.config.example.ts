/**
 * Sanity Studio Configuration
 * ─────────────────────────────────────────────
 *
 * Para instalar Sanity Studio como proyecto separado:
 *
 *   npm create sanity@latest -- --template clean
 *
 * Luego copia la carpeta src/sanity/schemas/ a tu proyecto Sanity
 * e importa los schemas en tu sanity.config.ts:
 */

// sanity.config.ts (en tu proyecto Sanity Studio)
// ────────────────────────────────────────────────

/*
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemas'; // copiar desde src/sanity/schemas/

export default defineConfig({
  name: 'karin-eventos',
  title: 'Karin Eventos — Panel de administración',

  projectId: '<TU_PROJECT_ID>',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenido')
          .items([
            // Singletons
            S.listItem()
              .title('Configuración del sitio')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.listItem()
              .title('Navbar')
              .child(
                S.document()
                  .schemaType('navbarSettings')
                  .documentId('navbarSettings')
              ),

            S.divider(),

            // Secciones de la página principal
            S.listItem()
              .title('Hero')
              .child(
                S.document()
                  .schemaType('heroSection')
                  .documentId('heroSection')
              ),
            S.listItem()
              .title('Beneficios')
              .child(
                S.document()
                  .schemaType('benefitsSection')
                  .documentId('benefitsSection')
              ),
            S.listItem()
              .title('Servicios')
              .child(
                S.document()
                  .schemaType('servicesSection')
                  .documentId('servicesSection')
              ),
            S.listItem()
              .title('Catálogo')
              .child(
                S.document()
                  .schemaType('catalogSection')
                  .documentId('catalogSection')
              ),
            S.listItem()
              .title('Testimonios')
              .child(
                S.document()
                  .schemaType('testimonialsSection')
                  .documentId('testimonialsSection')
              ),
            S.listItem()
              .title('Contacto')
              .child(
                S.document()
                  .schemaType('contactSection')
                  .documentId('contactSection')
              ),
            S.listItem()
              .title('Footer')
              .child(
                S.document()
                  .schemaType('footerSection')
                  .documentId('footerSection')
              ),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
*/

export {};
