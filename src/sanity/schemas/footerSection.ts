import {fieldHelp, footerGroups} from './helpers';

const footerSection = {
  name: 'footerSection',
  title: 'Parte final',
  type: 'document',
  description:
    'Edita la invitación final, los textos de cierre y la foto de fondo. El logo, contacto, redes y servicios se toman automáticamente de otras secciones.',
  groups: footerGroups.filter((group) => ['cta', 'brand', 'background'].includes(group.name)),
  fields: [
    {
      name: 'backgroundImage',
      title: 'Imagen de fondo',
      type: 'image',
      group: 'background',
      description: 'Foto ambiental que aparece detrás de todo el pie de página.',
      options: {
        hotspot: true,
        ...fieldHelp({
          helpText: 'Usa una foto horizontal con buena iluminación. El sitio aplica un filtro oscuro para que los textos se lean bien.',
          example: 'Foto de evento, decoración o detalle floral en tonos cálidos.',
        }),
      },
    },
    {
      name: 'backgroundAlt',
      title: 'Descripción de la imagen para accesibilidad',
      type: 'string',
      group: 'background',
      description: 'Texto para lectores de pantalla. No se muestra visualmente en la web, pero ayuda a personas con discapacidad visual.',
    },
    {
      name: 'ctaEyebrow',
      title: 'Texto pequeño sobre el título de cierre',
      type: 'string',
      group: 'cta',
      description: 'Es la etiqueta corta tipo píldora que aparece encima del título grande en la tarjeta de cierre del pie de página.',
      options: fieldHelp({
        example: 'Hagamos que tu celebración se sienta inolvidable',
        helpText: 'Manténlo breve, idealmente una sola línea.',
      }),
    },
    {
      name: 'ctaTitle',
      title: 'Título grande del cierre',
      type: 'string',
      group: 'cta',
      description: 'Frase principal que invita al visitante a escribir o cotizar antes de terminar la página.',
      options: fieldHelp({
        example: 'Hagamos realidad tu próxima celebración',
      }),
    },
    {
      name: 'ctaHighlightWord',
      title: 'Texto destacado del título de cierre',
      type: 'string',
      group: 'cta',
      description: 'Parte del título que aparece en un estilo visual diferente (itálica dorada). Normalmente es la frase final que cierra el mensaje.',
      options: fieldHelp({
        example: 'con detalle y estilo',
        helpText: 'Este texto se verá en un color diferente al lado del título principal.',
      }),
    },
    {
      name: 'ctaButtonLabel',
      title: 'Texto del botón de contacto',
      type: 'string',
      group: 'cta',
      description: 'Texto que aparece dentro del botón al lado del título de cierre. Al presionarlo, el visitante baja a la sección de contacto.',
      options: fieldHelp({
        example: 'Cotiza tu evento',
        helpText: 'Usa un texto corto y directo que invite a cotizar.',
      }),
    },
    {
      name: 'brandText',
      title: 'Texto de marca',
      type: 'text',
      rows: 3,
      group: 'brand',
      description: 'Párrafo breve que aparece debajo del logo en el pie de página. Describe en pocas palabras qué hace la empresa.',
      options: fieldHelp({
        example: 'Bodas, eventos, catering y decoración con una mirada cálida, elegante y profundamente cuidada.',
        helpText: 'El logo se toma automáticamente de "Datos generales del sitio".',
      }),
    },
    {
      name: 'navColumnTitle',
      title: 'Título de la columna de navegación',
      type: 'string',
      group: 'brand',
      description: 'Título que aparece encima de los enlaces de navegación interna (Inicio, Beneficios, Servicios, etc.).',
      options: fieldHelp({example: 'Explorar'}),
    },
    {
      name: 'servicesColumnTitle',
      title: 'Título de la columna de servicios',
      type: 'string',
      group: 'brand',
      description: 'Título que aparece encima de la lista de servicios. Los servicios se toman automáticamente de la sección "Servicios".',
      options: fieldHelp({example: 'Servicios'}),
    },
    {
      name: 'contactTitle',
      title: 'Título de la tarjeta de contacto',
      type: 'string',
      group: 'brand',
      description: 'Título que aparece arriba de los datos de contacto (teléfono, email, ubicación). Los datos se toman de "Datos generales".',
      options: fieldHelp({example: 'Contacto'}),
    },
    {
      name: 'legalText',
      title: 'Texto legal de derechos',
      type: 'string',
      group: 'brand',
      description: 'Texto de derechos reservados que aparece en la barra inferior del pie de página.',
      options: fieldHelp({
        example: '© 2025 Karin Cadenas Bodas & Eventos. Todos los derechos reservados.',
        helpText: 'Si lo dejas vacío, se genera automáticamente con el año actual y el nombre de la empresa.',
      }),
    },
    {
      name: 'madeWithLine',
      title: 'Texto central inferior',
      type: 'string',
      group: 'brand',
      description: 'Mensaje breve que aparece centrado en la parte baja del pie de página.',
      options: fieldHelp({
        example: 'Hecho con amor y cariño 💚 para celebraciones memorables.',
      }),
    },
    {
      name: 'backToTopLabel',
      title: 'Texto del botón "Volver arriba"',
      type: 'string',
      group: 'brand',
      description: 'Texto del enlace que al presionarlo lleva al visitante de regreso al inicio de la página.',
      options: fieldHelp({example: 'Volver arriba'}),
    },
  ],
  preview: {prepare: () => ({title: 'Sección Footer'})},
};

export default footerSection;
