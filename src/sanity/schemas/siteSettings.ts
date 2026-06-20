import {iconList} from './shared';
import {colorField, fieldHelp, iconFieldInline, iconPreviewMedia, siteGroups, visibilitySubtitle} from './helpers';

const siteSettings = {
  name: 'siteSettings',
  title: 'Datos generales del sitio',
  type: 'document',
  description:
    'Datos base de la marca: logo, nombre, WhatsApp, correos, horarios y redes. Se escriben una vez y el sitio los usa en varias secciones.',
  groups: siteGroups,
  fields: [
    {
      name: 'logo',
      title: 'Logo único del sitio',
      type: 'image',
      group: 'identity',
      description: 'Logo único de la marca. Se usa automáticamente en la barra superior y en el footer.',
      options: {
        hotspot: true,
        ...fieldHelp({
          helpText: 'Sube una versión limpia del logo. Este mismo logo se verá en la barra superior y en el footer.',
          example: 'PNG transparente o imagen cuadrada del monograma KC.',
          designNote: 'Evita imágenes con mucho margen vacío alrededor del logo.',
        }),
      },
    },
    {
      name: 'companyName',
      title: 'Nombre para web',
      type: 'string',
      group: 'identity',
      description: 'Nombre comercial visible en la página, navbar, footer y SEO.',
      options: fieldHelp({example: 'KARIN CADENAS BODAS & EVENTOS'}),
    },
    {
      name: 'companySubtitle',
      title: 'Frase corta de la empresa',
      type: 'string',
      group: 'identity',
      description: 'Texto pequeño que acompaña al nombre de la marca.',
      options: fieldHelp({example: 'Bodas & Eventos'}),
    },
    {
      name: 'whatsapp',
      title: 'WhatsApp principal',
      type: 'string',
      group: 'contact',
      description: 'Número principal usado por el botón fijo de WhatsApp del navbar, cards de contacto y enlaces de la web.',
      options: fieldHelp({
        helpText: 'Escríbelo con código de país y sin espacios, guiones ni símbolos.',
        example: '51922459810',
        warning: 'Si el número tiene espacios o símbolos, el enlace de WhatsApp puede fallar.',
      }),
    },
    {
      name: 'email',
      title: 'Email principal',
      type: 'string',
      group: 'contact',
      description: 'Correo institucional principal. Se reutiliza en las secciones que muestran datos generales de contacto.',
      options: fieldHelp({example: 'karin@karincadenaseventos.com'}),
      validation: (Rule: any) => Rule.email().warning('Revisa que el correo tenga formato válido.'),
    },
    {
      name: 'quoteEmail',
      title: 'Email para cotizaciones',
      type: 'string',
      group: 'contact',
      description: 'Correo que recibirá las solicitudes del formulario y que se mostrará como contacto para cotizar.',
      options: fieldHelp({example: 'presupuestos@karincadenaseventos.com'}),
      validation: (Rule: any) => Rule.email().warning('Revisa que el correo tenga formato válido.'),
    },
    {
      name: 'location',
      title: 'Ubicación',
      type: 'string',
      group: 'contact',
      description: 'Ciudad o zona de atención que aparece en la web.',
      options: fieldHelp({example: 'Lima, Perú'}),
    },
    {
      name: 'schedule',
      title: 'Horario o texto de atención',
      type: 'text',
      rows: 2,
      group: 'contact',
      description: 'Texto corto sobre atención, horarios o coordinación previa.',
      options: fieldHelp({example: 'Lunes a viernes 9am a 7pm. Sábados previa coordinación.'}),
    },
    {
      name: 'socialLinks',
      title: 'Redes sociales',
      type: 'array',
      group: 'social',
      description: 'Redes sociales principales de la marca.',
      options: fieldHelp({
        helpText: 'Puedes agregar, ocultar, reordenar o eliminar redes. El footer puede usar estos datos.',
        designNote: 'El color de animación controla el brillo del borde circular del icono.',
      }),
      of: [
        {
          type: 'object',
          title: 'Red social',
          fields: [
            {name: 'name', title: 'Nombre de la red', type: 'string', description: 'Nombre que identifica la red social.', options: fieldHelp({example: 'Instagram'})},
            {name: 'url', title: 'Enlace de la red', type: 'url', description: 'Link completo al perfil.', options: fieldHelp({example: 'https://www.instagram.com/karin...'})},
            {
              name: 'icon',
              title: 'Icono',
              type: 'string',
              description: 'Icono que se verá en el botón de la red social.',
              ...iconFieldInline('Elige el icono correspondiente a la red social.'),
            },
            colorField({title: 'Color del borde animado'}),
            {name: 'visible', title: 'Mostrar esta red', type: 'boolean', initialValue: true, description: 'Activa o desactiva esta red sin borrarla.', options: fieldHelp({helpText: 'Si está apagado, no se mostrará en la web.'})},
          ],
          preview: {
            select: {title: 'name', icon: 'icon', visible: 'visible', borderColor: 'borderColor'},
            prepare: ({title, icon, visible, borderColor}: any) => ({
              title: title || 'Red social',
              subtitle: visibilitySubtitle(visible, borderColor ? `Color ${borderColor}` : 'Sin color personalizado'),
              media: iconPreviewMedia(icon, borderColor),
            }),
          },
        },
      ],
    },
    {
      name: 'seo',
      title: 'Cómo se ve el link al compartir',
      type: 'object',
      group: 'seo',
      description: 'Texto e imagen que aparecen cuando alguien comparte el enlace de la web por WhatsApp, redes o buscadores.',
      options: fieldHelp({
        helpText: 'No cambia el diseño de la página. Solo mejora la presentación del enlace cuando se comparte.',
      }),
      fields: [
        {name: 'title', title: 'Título al compartir', type: 'string', description: 'Título que verá una persona cuando se comparte el link.', options: fieldHelp({example: 'Karin Eventos & Experiencias'})},
        {name: 'description', title: 'Descripción al compartir', type: 'text', description: 'Resumen corto de la página.', options: fieldHelp({example: 'Diseño, planificación y ambientación de eventos con una mirada elegante.'})},
        {name: 'ogImage', title: 'Imagen para compartir el link', type: 'image', description: 'Imagen grande que aparece cuando el link se comparte en redes o WhatsApp.', options: {hotspot: true, ...fieldHelp({example: 'Recomendado: 1200 x 630 px.', designNote: 'Usa una foto elegante, horizontal, sin demasiado texto encima.'})}},
      ],
    },
  ],
  preview: {prepare: () => ({title: 'Datos generales del sitio'})},
};

export default siteSettings;
