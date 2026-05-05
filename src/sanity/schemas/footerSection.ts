import {fieldHelp, footerGroups} from './helpers';

const footerSection = {
  name: 'footerSection',
  title: 'Footer',
  type: 'document',
  description:
    'Edita solo los textos y el ambiente visual del footer. Logo, contacto, redes y servicios se toman automáticamente de Datos generales y Servicios.',
  groups: footerGroups.filter((group) => ['cta', 'brand', 'background'].includes(group.name)),
  fields: [
    {
      name: 'backgroundImage',
      title: 'Imagen de fondo',
      type: 'image',
      group: 'background',
      options: {hotspot: true, ...fieldHelp({helpText: 'Foto ambiental que aparece detrás del footer.'})},
    },
    {name: 'backgroundAlt', title: 'Descripción de la imagen para accesibilidad', type: 'string', group: 'background', description: 'Texto para lectores de pantalla. No se muestra visualmente en la web, pero ayuda a personas que usan tecnologías de asistencia y mejora la accesibilidad.'},
    {name: 'ctaEyebrow', title: 'Texto pequeño del CTA superior', type: 'string', group: 'cta'},
    {name: 'ctaTitle', title: 'Título del CTA superior', type: 'string', group: 'cta'},
    {name: 'ctaHighlightWord', title: 'Fragmento destacado del CTA', type: 'string', group: 'cta'},
    {
      name: 'ctaButtonLabel',
      title: 'Texto del botón CTA',
      type: 'string',
      group: 'cta',
      description: 'El botón siempre llevará a la sección Contacto para cotizar.',
      options: fieldHelp({example: 'Cotiza ahora'}),
    },
    {
      name: 'brandText',
      title: 'Texto de marca',
      type: 'text',
      rows: 3,
      group: 'brand',
      description: 'Texto que aparece debajo del logo en el footer. El logo se toma desde Datos generales.',
    },
    {
      name: 'navColumnTitle',
      title: 'Título de columna de navegación',
      type: 'string',
      group: 'brand',
      description: 'Título que aparece encima de los enlaces internos del footer.',
    },
    {
      name: 'servicesColumnTitle',
      title: 'Título de columna de servicios',
      type: 'string',
      group: 'brand',
      description: 'Título que aparece encima de los servicios listados en el footer.',
    },
    {
      name: 'contactTitle',
      title: 'Título de contacto',
      type: 'string',
      group: 'brand',
      description: 'Título de la tarjeta de contacto del footer.',
    },
    {
      name: 'legalText',
      title: 'Texto legal inferior',
      type: 'string',
      group: 'brand',
      description: 'Texto legal de derechos reservados que aparece en la barra inferior del footer.',
    },
    {
      name: 'madeWithLine',
      title: 'Texto inferior central completo',
      type: 'string',
      group: 'brand',
      description: 'Texto completo de la línea central inferior. Puedes poner emojis directamente aquí.',
    },
    {
      name: 'backToTopLabel',
      title: 'Texto del botón “Volver arriba”',
      type: 'string',
      group: 'brand',
      description: 'Texto del enlace inferior derecho que regresa al inicio.',
    },
  ],
  preview: {prepare: () => ({title: 'Sección Footer'})},
};

export default footerSection;
