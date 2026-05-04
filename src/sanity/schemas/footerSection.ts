import { iconList, overlayPresets } from './shared';

const footerSection = {
  name: 'footerSection',
  title: 'Footer',
  type: 'document',
  fields: [
    {
      name: 'backgroundImage',
      title: 'Imagen de fondo',
      type: 'image',
      options: { hotspot: true },
      description: 'Foto ambiental que aparece detrás del footer.',
    },
    { name: 'backgroundAlt', title: 'Alt de imagen de fondo', type: 'string' },
    {
      name: 'overlay',
      title: 'Overlay de fondo',
      type: 'string',
      options: { list: overlayPresets.map((p) => p) },
    },

    { name: 'ctaEyebrow', title: 'Texto pequeño del CTA superior', type: 'string' },
    { name: 'ctaTitle', title: 'Título del CTA superior', type: 'string' },
    { name: 'ctaHighlightWord', title: 'Fragmento destacado del CTA', type: 'string' },
    { name: 'ctaButtonLabel', title: 'Texto del botón CTA', type: 'string' },
    { name: 'ctaButtonLink', title: 'Link del botón CTA', type: 'string' },

    {
      name: 'logo',
      title: 'Logo del footer',
      type: 'image',
      options: { hotspot: true },
      description: 'Si subes un logo aquí, reemplaza el recuadro con la letra K del footer.',
    },
    {
      name: 'brandText',
      title: 'Texto de marca',
      type: 'text',
      rows: 3,
      description: 'Texto que aparece debajo del logo en el footer.',
    },

    {
      name: 'navigationColumns',
      title: 'Columnas de navegación',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Título de la columna', type: 'string' },
            {
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'label', title: 'Texto', type: 'string' },
                    { name: 'href', title: 'Enlace', type: 'string' },
                  ],
                },
              ],
            },
            { name: 'visible', title: 'Visible', type: 'boolean', initialValue: true },
            { name: 'order', title: 'Orden', type: 'number' },
          ],
          preview: { select: { title: 'title' } },
        },
      ],
    },
    {
      name: 'serviceLinks',
      title: 'Servicios del footer',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'text', title: 'Texto', type: 'string' },
            { name: 'link', title: 'Enlace', type: 'string' },
            { name: 'visible', title: 'Visible', type: 'boolean', initialValue: true },
          ],
        },
      ],
    },
    {
      name: 'contactInfo',
      title: 'Información de contacto',
      type: 'object',
      fields: [
        { name: 'phone', title: 'Teléfono', type: 'string' },
        { name: 'email', title: 'Email', type: 'string' },
        { name: 'location', title: 'Ubicación', type: 'string' },
        { name: 'schedule', title: 'Horario', type: 'string' },
      ],
    },
    {
      name: 'socialLinks',
      title: 'Redes sociales',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Nombre', type: 'string' },
            { name: 'url', title: 'URL', type: 'url' },
            {
              name: 'icon',
              title: 'Icono',
              type: 'string',
              options: { list: iconList.map((i) => i) },
            },
            { name: 'borderColor', title: 'Color de animación del borde (hex)', type: 'string' },
            { name: 'visible', title: 'Visible', type: 'boolean', initialValue: true },
            { name: 'order', title: 'Orden', type: 'number' },
          ],
          preview: { select: { title: 'name', subtitle: 'url' } },
        },
      ],
    },

    {
      name: 'legalText',
      title: 'Texto inferior izquierdo',
      type: 'text',
      rows: 4,
      description: 'Aquí puedes quitar el Lorem ipsum o colocar derechos reservados, aviso legal, créditos, etc.',
    },
    {
      name: 'madeWithLine',
      title: 'Texto inferior central completo',
      type: 'string',
      description: 'Texto completo de la línea central inferior. Puedes poner emojis directamente aquí, por ejemplo: Hecho con amor y cariño 🤎 para celebraciones memorables.',
    },
    {
      name: 'backToTopLabel',
      title: 'Texto del botón “Volver arriba”',
      type: 'string',
      description: 'Texto del enlace inferior derecho que regresa al inicio.',
    },
  ],
  preview: { prepare: () => ({ title: 'Sección Footer' }) },
};

export default footerSection;
