import {Link as LinkIcon, ListTree, Settings, Sparkles} from 'lucide-react';
import {fieldHelp, iconFieldInline, iconPreviewMedia, visibilitySubtitle} from './helpers';

export const linkTypeList = [
  {title: 'Sitio web', value: 'web'},
  {title: 'Red social', value: 'social'},
  {title: 'WhatsApp', value: 'whatsapp'},
  {title: 'Correo', value: 'email'},
  {title: 'Teléfono', value: 'phone'},
  {title: 'Ubicación', value: 'location'},
  {title: 'Catálogo', value: 'catalog'},
  {title: 'Calendario / reservas', value: 'calendar'},
  {title: 'Video', value: 'video'},
  {title: 'Otro enlace', value: 'other'},
] as const;

const linksPage = {
  name: 'linksPage',
  title: 'Página de links',
  type: 'document',
  initialValue: {
    title: 'Página de links',
    mainIcon: 'sparkles',
  },
  description:
    'Administra una página pública tipo Linktree premium para compartir enlaces importantes de Karin Eventos.',
  groups: [
    {name: 'hero', title: 'Encabezado', default: true, icon: Sparkles},
    {name: 'links', title: 'Links', icon: ListTree},
    {name: 'settings', title: 'Ajustes', icon: Settings},
  ],
  fields: [
    {
      name: 'title',
      title: 'Título principal',
      type: 'string',
      group: 'hero',
      description: 'Texto principal que aparece arriba de la página de links.',
      options: fieldHelp({example: 'Karin Cadenas Bodas & Eventos'}),
      validation: (Rule: any) => Rule.required().warning('Agrega un título para identificar la página.'),
    },
    {
      name: 'subtitle',
      title: 'Subtítulo o descripción corta',
      type: 'text',
      rows: 3,
      group: 'hero',
      description: 'Descripción breve que acompaña al título.',
      options: fieldHelp({example: 'Planificación, catering y decoración para celebraciones memorables.'}),
    },
    {
      name: 'mainIcon',
      title: 'Icono principal de la página',
      type: 'string',
      group: 'hero',
      description: 'Icono decorativo principal. Es el mismo que se renderiza en la web.',
      initialValue: 'sparkles',
      ...iconFieldInline('Elige el icono principal para el encabezado.'),
    },
    {
      name: 'links',
      title: 'Lista ordenable de links',
      type: 'array',
      group: 'links',
      description: 'Arrastra los links para reordenarlos. También puedes usar el campo Orden manual para definir prioridad.',
      options: {
        sortable: true,
        ...fieldHelp({
          helpText: 'Los links inactivos quedan guardados en Sanity, pero no se muestran en la página pública.',
          designNote: 'Destaca solo los enlaces más importantes para mantener una jerarquía clara.',
        }),
      },
      of: [
        {
          type: 'object',
          title: 'Link',
          fields: [
            {
              name: 'name',
              title: 'Nombre visible',
              type: 'string',
              description: 'Texto principal del botón/link.',
              options: fieldHelp({example: 'Cotiza tu evento por WhatsApp'}),
              validation: (Rule: any) => Rule.required().warning('El link necesita un nombre visible.'),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              description: 'Destino principal del link.',
              options: fieldHelp({example: 'https://wa.me/51922459810'}),
              validation: (Rule: any) =>
                Rule.required().uri({
                  scheme: ['http', 'https', 'mailto', 'tel'],
                  allowRelative: true,
                }).warning('Cada link necesita una URL válida. Ejemplo: https://..., mailto:... o tel:...'),
            },
            {
              name: 'type',
              title: 'Tipo de link',
              type: 'string',
              description: 'Categoría editorial del enlace.',
              options: {
                list: linkTypeList.map((item) => item),
                layout: 'dropdown',
                ...fieldHelp({helpText: 'Sirve para ordenar y reconocer rápido el tipo de destino.'}),
              },
              initialValue: 'web',
            },
            {
              name: 'icon',
              title: 'Icono elegible desde Sanity',
              type: 'string',
              description: 'Icono visible del link. El valor elegido aquí se renderiza exactamente igual en frontend.',
              initialValue: 'link',
              ...iconFieldInline('Elige el icono que verá la persona visitante.'),
            },
            {
              name: 'description',
              title: 'Descripción corta opcional',
              type: 'text',
              rows: 2,
              description: 'Texto breve debajo del nombre visible.',
              options: fieldHelp({example: 'Respuesta rápida para disponibilidad, paquetes y coordinación.'}),
            },
            {
              name: 'expandableText',
              title: 'Texto expandible opcional',
              type: 'text',
              rows: 4,
              description: 'Información extra que la visitante podrá desplegar si necesita más contexto.',
              options: fieldHelp({example: 'Incluye fecha tentativa, cantidad de invitados y tipo de evento para orientarte mejor.'}),
            },
            {
              name: 'email',
              title: 'Correo opcional',
              type: 'string',
              description: 'Correo relacionado con este link, si aplica.',
              options: fieldHelp({example: 'presupuestos@karincadenaseventos.com'}),
              validation: (Rule: any) => Rule.email().warning('Revisa que el correo tenga formato válido.'),
            },
            {
              name: 'phone',
              title: 'Teléfono opcional',
              type: 'string',
              description: 'Teléfono o WhatsApp relacionado con este link.',
              options: fieldHelp({example: '51922459810'}),
            },
            {
              name: 'active',
              title: 'Link activo',
              type: 'boolean',
              initialValue: true,
              description: 'Apaga este campo para ocultar el link sin borrarlo.',
              options: fieldHelp({helpText: 'Los links inactivos solo quedan visibles dentro del panel.'}),
            },
            {
              name: 'featured',
              title: 'Destacar el link',
              type: 'boolean',
              initialValue: false,
              description: 'Activa un tratamiento visual más importante para este link.',
              options: fieldHelp({designNote: 'Úsalo para WhatsApp, catálogo o agenda cuando quieras darles prioridad.'}),
            },
            {
              name: 'order',
              title: 'Orden manual',
              type: 'number',
              description: 'Número opcional para ordenar. Menor número aparece primero.',
              options: fieldHelp({example: '10, 20, 30... para dejar espacio entre links.'}),
              validation: (Rule: any) => Rule.integer().min(0).warning('Usa un número entero positivo.'),
            },
          ],
          preview: {
            select: {
              title: 'name',
              type: 'type',
              icon: 'icon',
              active: 'active',
              featured: 'featured',
              order: 'order',
            },
            prepare: ({title, type, icon, active, featured, order}: any) => {
              const typeTitle = linkTypeList.find((item) => item.value === type)?.title || type || 'Sin tipo';
              const state = visibilitySubtitle(active, featured ? 'Destacado' : `Orden ${order ?? 'sin definir'}`);

              return {
                title: title || 'Link sin nombre',
                subtitle: `${typeTitle} · ${state}`,
                media: iconPreviewMedia(icon, featured ? '#d2ab80' : active === false ? '#8f8f8f' : '#2d5f5e'),
              };
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {icon: 'mainIcon'},
    prepare: ({icon}: any) => ({
      title: 'Página de links',
      subtitle: 'Links tipo Linktree premium',
      media: iconPreviewMedia(icon || 'link', '#d2ab80'),
    }),
  },
  icon: LinkIcon,
};

export default linksPage;
