import { ServiceCategoryInput } from '../components/ServiceCategoryInput';

const catalogSection = {
  name: 'catalogSection',
  title: 'Catálogo',
  type: 'document',
  groups: [
    { name: 'content', title: 'Contenido principal', default: true },
    { name: 'background', title: 'Fondo' },
    { name: 'items', title: 'Fotos y videos' },
    { name: 'visibility', title: 'Visibilidad' },
  ],
  fields: [
    {
      name: 'visible',
      title: 'Mostrar sección Catálogo',
      type: 'boolean',
      initialValue: true,
      group: 'visibility',
      description: 'Activa o desactiva toda la sección de catálogo sin borrar su contenido.',
      options: {
        helpText: 'Útil si quieres preparar cambios en el panel y publicarlos más adelante.',
      },
    },
    {
      name: 'backgroundImage',
      title: 'Imagen de fondo de la sección',
      type: 'image',
      group: 'background',
      options: {
        hotspot: true,
        helpText: 'Foto que aparece detrás del catálogo. El sitio le aplica filtros para que combine con la paleta.',
        example: 'Una foto horizontal de una mesa decorada, flores, velas o ambiente de evento.',
      },
      description: 'Cambia el fondo visual de la sección Catálogo.',
    },
    {
      name: 'backgroundAlt',
      title: 'Descripción de la imagen de fondo',
      type: 'string',
      group: 'background',
      description: 'Texto para lectores de pantalla. No se muestra visualmente en la web, pero ayuda a personas que usan tecnologías de asistencia y mejora la accesibilidad.',
      options: { example: 'Mesa de evento decorada con flores y velas.' },
    },
    {
      name: 'eyebrow',
      title: 'Texto pequeño superior',
      type: 'string',
      group: 'content',
      description: 'Texto corto que aparece encima del título principal.',
      options: { example: 'Catálogo visual' },
    },
    {
      name: 'title',
      title: 'Título principal',
      type: 'string',
      group: 'content',
      description: 'Primera parte del título grande visible en la sección.',
      options: { example: 'Un archivo visual de' },
    },
    {
      name: 'highlightWord',
      title: 'Parte destacada del título',
      type: 'string',
      group: 'content',
      description: 'Texto del título que tendrá un estilo visual diferente.',
      options: { example: 'momentos y detalles.' },
    },
    {
      name: 'supportText',
      title: 'Texto de apoyo',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Texto breve que explica qué verá la persona en el catálogo.',
      options: {
        helpText: 'Mantén este texto corto. Lo ideal es 1 o 2 frases.',
        example: 'Explora montajes, texturas, mesas, ambientes y detalles visuales seleccionados.',
      },
    },
    {
      name: 'items',
      title: 'Fotos y videos del catálogo',
      type: 'array',
      group: 'items',
      description: 'Aquí puedes agregar fotos del catálogo o enlaces de YouTube. No se suben videos pesados para no consumir almacenamiento.',
      options: {
        helpText: 'Para fotos, sube una imagen. Para videos, pega el enlace de YouTube y, si quieres, agrega una portada bonita.',
        warning: 'No subas videos como archivo. Usa enlaces de YouTube para que la web sea más ligera y no consuma almacenamiento de Sanity.',
      },
      of: [
        {
          type: 'object',
          title: 'Contenido del catálogo',
          initialValue: {
            mediaType: 'photo',
            visible: true,
            featured: false,
          },
          fields: [
            {
              name: 'mediaType',
              title: 'Tipo de contenido',
              type: 'string',
              initialValue: 'photo',
              options: {
                layout: 'radio',
                list: [
                  { title: 'Foto subida al panel', value: 'photo' },
                  { title: 'Video de YouTube', value: 'youtube' },
                ],
                helpText: 'Elige si este elemento será una foto o un video enlazado desde YouTube.',
              },
              description: 'Define qué se mostrará en esta tarjeta del catálogo.',
              // No lo hacemos obligatorio porque algunos items antiguos pueden no tenerlo.
              // Si está vacío, el frontend y las validaciones lo tratan como "Foto".
              validation: (Rule: any) => Rule.custom((value: string) => {
                if (!value) return true;
                if (value !== 'photo' && value !== 'youtube') {
                  return 'Elige Foto subida al panel o Video de YouTube.';
                }
                return true;
              }),
            },
            {
              name: 'title',
              title: 'Título de la tarjeta',
              type: 'string',
              description: 'Nombre corto que aparece sobre la tarjeta.',
              options: { example: 'Montaje de salón' },
              validation: (Rule: any) => Rule.required().error('Agrega un título para identificar este contenido.'),
            },
            {
              name: 'category',
              title: 'Categoría (opcional)',
              type: 'string',
              description: 'Selecciona un servicio como categoría. La lista viene de la sección Servicios.',
              components: {
                input: ServiceCategoryInput,
              },
            },
            {
              name: 'description',
              title: 'Descripción',
              type: 'text',
              rows: 3,
              description: 'Texto que explica brevemente lo que se ve en la foto o video.',
              options: { example: 'Ambiente cuidadosamente montado con flores, velas y detalles cálidos.' },
            },
            {
              name: 'badge',
              title: 'Etiqueta pequeña (obsoleto)',
              type: 'string',
              hidden: true,
              description: 'Campo descontinuado. Los datos existentes se conservan pero ya no se editan ni se muestran.',
            },
            {
              name: 'thumbnail',
              title: 'Foto principal',
              type: 'image',
              hidden: ({ parent }: any) => parent?.mediaType === 'youtube',
              options: {
                hotspot: true,
                helpText: 'Esta es la foto que aparecerá en la tarjeta y en el modal ampliado.',
              },
              description: 'Sube la foto que se mostrará en el catálogo.',
              validation: (Rule: any) =>
                Rule.custom((thumbnail: any, context: any) => {
                  const parent = context.parent || {};
                  const mediaType = parent.mediaType || 'photo';

                  if (parent.visible !== false && mediaType === 'photo' && !thumbnail?.asset?._ref) {
                    return 'Si el elemento visible es una foto, debes subir la imagen principal.';
                  }

                  return true;
                }),
            },
            {
              name: 'thumbnailAlt',
              title: 'Descripción de la foto',
              type: 'string',
              hidden: ({ parent }: any) => parent?.mediaType === 'youtube',
              description: 'Texto para lectores de pantalla. Los visitantes no lo leen normalmente; describe la foto para accesibilidad.',
              options: { example: 'Mesa decorada con flores, velas y vajilla elegante.' },
            },
            {
              name: 'youtubeUrl',
              title: 'Enlace del video de YouTube',
              type: 'url',
              hidden: ({ parent }: any) => parent?.mediaType !== 'youtube',
              description: 'Pega aquí el link del video de YouTube. No subas el video como archivo.',
              options: {
                helpText: 'Acepta enlaces como https://www.youtube.com/watch?v=... o https://youtu.be/...',
                warning: 'Usar YouTube evita consumir almacenamiento y hace que la página cargue mejor.',
              },
              validation: (Rule: any) =>
                Rule.custom((url: string, context: any) => {
                  const parent = context.parent || {};
                  const mediaType = parent.mediaType || 'photo';

                  if (parent.visible !== false && mediaType === 'youtube' && !url) {
                    return 'Si el elemento visible es un video, debes pegar el enlace de YouTube.';
                  }

                  if (url && !/(youtube\.com|youtu\.be)/i.test(url)) {
                    return 'Usa un enlace válido de YouTube.';
                  }

                  return true;
                }),
            },
            {
              name: 'coverImage',
              title: 'Imagen de portada del video',
              type: 'image',
              hidden: ({ parent }: any) => parent?.mediaType !== 'youtube',
              options: {
                hotspot: true,
                helpText: 'Opcional. Si no subes portada, la web intentará usar la miniatura pública de YouTube.',
              },
              description: 'Foto opcional que se usará como portada del video en la tarjeta.',
            },
            {
              name: 'coverAlt',
              title: 'Descripción de la portada',
              type: 'string',
              hidden: ({ parent }: any) => parent?.mediaType !== 'youtube',
              description: 'Texto para lectores de pantalla. Los visitantes no lo leen normalmente; describe la portada del video para accesibilidad.',
            },
            {
              name: 'visible',
              title: 'Mostrar este contenido',
              type: 'boolean',
              initialValue: true,
              description: 'Puedes ocultar este elemento sin eliminarlo.',
            },
            {
              name: 'featured',
              title: 'Marcar como destacado',
              type: 'boolean',
              initialValue: false,
              description: 'Sirve para identificar contenido importante. El diseño puede usarlo para darle más presencia.',
            },
          ],
          preview: {
            select: {
              title: 'title',
              category: 'category',
              mediaType: 'mediaType',
              visible: 'visible',
              featured: 'featured',
              thumbnail: 'thumbnail',
              coverImage: 'coverImage',
            },
            prepare(selection: any) {
              const mediaType = selection.mediaType || 'photo';
              const typeLabel = mediaType === 'youtube' ? 'YouTube' : 'Foto';
              const status = selection.visible === false ? 'Oculto' : 'Visible';
              const featured = selection.featured ? ' · Destacado' : '';

              return {
                title: selection.title || 'Contenido sin título',
                subtitle: `${typeLabel} · ${selection.category || 'Sin categoría'} · ${status}${featured}`,
                media: selection.coverImage || selection.thumbnail,
              };
            },
          },
        },
      ],
    },
  ],
  preview: { prepare: () => ({ title: 'Sección Catálogo' }) },
};

export default catalogSection;
