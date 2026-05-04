import {iconList} from './shared';
import {colorField, fieldHelp, siteGroups, visibilitySubtitle} from './helpers';

const siteSettings = {
  name: 'siteSettings',
  title: 'Configuración general del sitio',
  type: 'document',
  description:
    'Aquí se editan los datos globales de la marca: logo, datos de contacto, redes sociales y cómo se ve el link cuando se comparte.',
  groups: siteGroups,
  fields: [
    {
      name: 'logo',
      title: 'Logo principal',
      type: 'image',
      group: 'identity',
      description: 'Logo que se usa como imagen principal de la marca en la web.',
      options: {
        hotspot: true,
        ...fieldHelp({
          helpText: 'Sube una versión limpia del logo. Se verá en la barra superior y puede reutilizarse en otras secciones.',
          example: 'PNG transparente o imagen cuadrada del monograma KC.',
          designNote: 'Evita imágenes con mucho margen vacío alrededor del logo.',
        }),
      },
    },
    {
      name: 'companyName',
      title: 'Nombre de la empresa',
      type: 'string',
      group: 'identity',
      description: 'Nombre comercial visible en la página.',
      options: fieldHelp({example: 'Karin'}),
    },
    {
      name: 'companySubtitle',
      title: 'Frase corta de la empresa',
      type: 'string',
      group: 'identity',
      description: 'Texto pequeño que acompaña al nombre de la marca.',
      options: fieldHelp({example: 'Eventos & Experiencias'}),
    },
    {
      name: 'whatsapp',
      title: 'Número de WhatsApp',
      type: 'string',
      group: 'contact',
      description: 'Número usado para abrir conversaciones de WhatsApp desde los botones de la web.',
      options: fieldHelp({
        helpText: 'Escríbelo con código de país y sin espacios, guiones ni símbolos.',
        example: '51999999999',
        warning: 'Si el número tiene espacios o símbolos, el enlace de WhatsApp puede fallar.',
      }),
    },
    {
      name: 'email',
      title: 'Correo de contacto',
      type: 'string',
      group: 'contact',
      description: 'Correo que se muestra en contacto y footer.',
      options: fieldHelp({example: 'hola@karineventos.com'}),
      validation: (Rule: any) => Rule.email().warning('Revisa que el correo tenga formato válido.'),
    },
    {
      name: 'phone',
      title: 'Teléfono visible',
      type: 'string',
      group: 'contact',
      description: 'Teléfono mostrado como texto para visitantes.',
      options: fieldHelp({example: '+51 999 999 999'}),
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
      type: 'string',
      group: 'contact',
      description: 'Texto corto sobre atención, horarios o coordinación previa.',
      options: fieldHelp({example: 'Atención previa coordinación'}),
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
              options: {list: iconList.map((i) => i), ...fieldHelp({helpText: 'Elige el icono correspondiente a la red social.'})},
            },
            colorField({title: 'Color del borde animado'}),
            {name: 'visible', title: 'Mostrar esta red', type: 'boolean', initialValue: true, description: 'Activa o desactiva esta red sin borrarla.', options: fieldHelp({helpText: 'Si está apagado, no se mostrará en la web.'})},
            {name: 'order', title: 'Orden', type: 'number', description: 'Número para ordenar. Menor número aparece primero.', options: fieldHelp({example: '0, 1, 2...'})},
          ],
          preview: {
            select: {title: 'name', visible: 'visible', borderColor: 'borderColor'},
            prepare: ({title, visible, borderColor}: any) => ({
              title: title || 'Red social',
              subtitle: visibilitySubtitle(visible, borderColor ? `Color ${borderColor}` : 'Sin color personalizado'),
            }),
          },
        },
      ],
    },
    {
      name: 'legalText',
      title: 'Texto legal del footer',
      type: 'string',
      group: 'footer',
      description: 'Texto pequeño de derechos reservados al final de la página.',
      options: fieldHelp({example: '© Karin Eventos. Todos los derechos reservados.'}),
    },
    {
      name: 'madeWithText',
      title: 'Texto pequeño de créditos',
      type: 'string',
      group: 'footer',
      description: 'Frase decorativa o crédito mostrado en el footer.',
      options: fieldHelp({example: 'Hecho con amor para celebraciones memorables.'}),
    },
    {
      name: 'seo',
      title: 'Vista del link al compartir / Google',
      type: 'object',
      group: 'seo',
      description: 'Información que ayuda a que la página se vea bien cuando se comparte en WhatsApp, Facebook o Google.',
      options: fieldHelp({
        helpText: 'No afecta directamente el diseño dentro de la página, sino cómo aparece el enlace compartido.',
      }),
      fields: [
        {name: 'title', title: 'Título al compartir', type: 'string', description: 'Título que verá una persona cuando se comparte el link.', options: fieldHelp({example: 'Karin Eventos & Experiencias'})},
        {name: 'description', title: 'Descripción al compartir', type: 'text', description: 'Resumen corto de la página.', options: fieldHelp({example: 'Diseño, planificación y ambientación de eventos con una mirada elegante.'})},
        {name: 'ogImage', title: 'Imagen para compartir el link', type: 'image', description: 'Imagen grande que aparece cuando el link se comparte en redes o WhatsApp.', options: {hotspot: true, ...fieldHelp({example: 'Recomendado: 1200 x 630 px.', designNote: 'Usa una foto elegante, horizontal, sin demasiado texto encima.'})}},
      ],
    },
  ],
  preview: {prepare: () => ({title: 'Configuración general del sitio'})},
};

export default siteSettings;
