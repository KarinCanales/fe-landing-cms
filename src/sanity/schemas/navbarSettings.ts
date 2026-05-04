import {navbarThemes} from './shared';
import {fieldHelp, navbarGroups} from './helpers';

const navbarSettings = {
  name: 'navbarSettings',
  title: 'Barra superior / Menú',
  type: 'document',
  description:
    'Ajustes visuales técnicos de la barra superior. Los links del menú, el botón de WhatsApp y su destino no son editables por el usuario final.',
  groups: navbarGroups,
  fields: [
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
          helpText: 'Los botones del menú y el CTA de WhatsApp están bloqueados. El WhatsApp se toma del campo “WhatsApp principal” de Datos generales.',
          designNote: 'Para evitar cambios bruscos, los colores adaptables deben ser sutiles.',
        }),
      },
      initialValue: 'adaptive',
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
