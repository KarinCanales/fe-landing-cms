import {navbarThemes} from './shared';
import {fieldHelp, navbarGroups, visibilitySubtitle} from './helpers';

const navbarSettings = {
  name: 'navbarSettings',
  title: 'Barra superior / Menú',
  type: 'document',
  description:
    'Controla los botones de navegación, el botón de WhatsApp y el comportamiento visual de la barra superior.',
  groups: navbarGroups,
  fields: [
    {
      name: 'links',
      title: 'Botones del menú',
      type: 'array',
      group: 'links',
      description: 'Botones que aparecen al centro de la barra superior.',
      options: fieldHelp({
        helpText: 'Puedes cambiar el texto, el enlace, el orden o desactivar un botón sin borrarlo.',
        warning: 'Si agregas muchos botones, la barra puede quedar apretada en pantallas medianas.',
      }),
      of: [
        {
          type: 'object',
          title: 'Botón del menú',
          fields: [
            {name: 'label', title: 'Texto visible', type: 'string', description: 'Texto que verá el visitante en la barra.', options: fieldHelp({example: 'Beneficios'})},
            {name: 'href', title: 'Destino del botón', type: 'string', description: 'Sección a la que llevará el botón.', options: fieldHelp({example: '#beneficios', warning: 'Para ir a una sección de la misma página, debe empezar con #.'})},
            {name: 'enabled', title: 'Mostrar este botón', type: 'boolean', initialValue: true, description: 'Permite ocultar el botón sin borrar su configuración.', options: fieldHelp({helpText: 'Útil si una sección todavía no está lista.'})},
            {name: 'order', title: 'Orden', type: 'number', description: 'Número que define la posición del botón. Menor aparece primero.', options: fieldHelp({example: '0 para Inicio, 1 para Beneficios...'})},
          ],
          preview: {
            select: {title: 'label', subtitle: 'href', visible: 'enabled'},
            prepare: ({title, subtitle, visible}: any) => ({
              title: title || 'Botón del menú',
              subtitle: visibilitySubtitle(visible, subtitle),
            }),
          },
        },
      ],
    },
    {
      name: 'whatsappCta',
      title: 'Botón de WhatsApp',
      type: 'object',
      group: 'cta',
      description: 'Botón destacado de WhatsApp que aparece en la barra superior.',
      options: fieldHelp({designNote: 'Debe mantenerse corto para verse elegante en desktop y mobile.'}),
      fields: [
        {name: 'label', title: 'Texto en desktop', type: 'string', description: 'Texto del botón cuando hay espacio suficiente.', options: fieldHelp({example: 'WhatsApp'})},
        {name: 'mobileLabelLong', title: 'Texto alternativo para mobile', type: 'string', description: 'Texto que puede usarse en pantallas pequeñas si el diseño lo permite.', options: fieldHelp({example: 'Cotizar por WhatsApp'})},
        {name: 'url', title: 'Enlace de WhatsApp', type: 'url', description: 'Link completo hacia WhatsApp.', options: fieldHelp({example: 'https://wa.me/51999999999'})},
      ],
    },
    {
      name: 'colorMode',
      title: 'Color de la barra superior',
      type: 'string',
      group: 'style',
      description: 'Define si la barra mantiene un color neutro o cambia sutilmente según la sección visible.',
      options: {
        list: [
          {title: 'Neutro fijo', value: 'neutral'},
          {title: 'Adaptable por sección', value: 'adaptive'},
        ],
        ...fieldHelp({
          helpText: 'Neutro fijo es más estable. Adaptable permite que la barra cambie suavemente entre claro/oscuro según la sección.',
          designNote: 'Para evitar cambios bruscos, los colores adaptables deben ser sutiles.',
        }),
      },
      initialValue: 'neutral',
    },
    {
      name: 'sectionThemes',
      title: 'Tema visual por sección',
      type: 'array',
      group: 'style',
      description: 'Sirve si eliges que la barra superior sea adaptable.',
      options: fieldHelp({
        helpText: 'Indica si cada sección es clara, oscura, botánica o cálida para que la barra combine mejor.',
        example: 'inicio = oscuro, beneficios = claro, footer = botánico.',
      }),
      of: [
        {
          type: 'object',
          title: 'Tema de sección',
          fields: [
            {name: 'sectionId', title: 'Nombre interno de la sección', type: 'string', description: 'Escribe el ID de la sección sin el símbolo #.', options: fieldHelp({example: 'inicio, beneficios, servicios, catalogo, testimonios, contacto, footer'})},
            {name: 'theme', title: 'Tipo de fondo', type: 'string', description: 'Tipo visual de la sección.', options: {list: navbarThemes.map((t) => t), ...fieldHelp({helpText: 'Esto ayuda a que la barra superior no choque con el fondo.'})}},
          ],
          preview: {select: {title: 'sectionId', subtitle: 'theme'}},
        },
      ],
    },
  ],
  preview: {prepare: () => ({title: 'Barra superior / Menú'})},
};

export default navbarSettings;
