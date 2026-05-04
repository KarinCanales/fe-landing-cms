import {iconList, overlayPresets} from './shared';
import {fieldHelp, visibilitySubtitle} from './helpers';

const heroSection = {
  name: 'heroSection',
  title: 'Inicio / Primera pantalla',
  type: 'document',
  description:
    'Es la primera impresión de la web. Aquí se editan el título principal, la imagen de fondo, los botones y las cards rotativas del lado derecho.',
  groups: [
    {name: 'content', title: 'Contenido principal', default: true},
    {name: 'background', title: 'Fondo de la sección'},
    {name: 'ctas', title: 'Botones'},
    {name: 'cards', title: 'Cards del lado derecho'},
    {name: 'settings', title: 'Mostrar / ocultar'},
  ],
  fields: [
    {name: 'visible', title: 'Mostrar sección de inicio', type: 'boolean', group: 'settings', initialValue: true, description: 'Activa o desactiva toda la primera pantalla sin borrar su contenido.', options: fieldHelp({helpText: 'Normalmente debe estar activada porque es la portada de la web.'})},
    {name: 'backgroundImage', title: 'Imagen de fondo', type: 'image', group: 'background', description: 'Foto grande que aparece detrás del texto principal.', options: {hotspot: true, ...fieldHelp({helpText: 'Usa una foto horizontal elegante y con buena iluminación.', example: 'Mesa de evento con velas, salón decorado o detalle floral amplio.', designNote: 'El sistema aplica un filtro oscuro para que el texto se lea bien.'})}},
    {name: 'backgroundAlt', title: 'Descripción de la imagen para accesibilidad', type: 'string', group: 'background', description: 'Texto que describe la imagen para lectores de pantalla.', options: fieldHelp({example: 'Mesa elegante con velas y flores para evento.'})},
    {name: 'overlay', title: 'Filtro visual del fondo', type: 'string', group: 'background', description: 'Capa de color que se coloca encima de la imagen para armonizarla con la marca.', options: {list: overlayPresets.map((p) => p), ...fieldHelp({helpText: 'En la portada normalmente funciona mejor “Oscuro cinematográfico”.', designNote: 'Este filtro evita que una imagen muy clara o muy cargada haga ilegible el texto.'})}},
    {name: 'eyebrow', title: 'Etiqueta pequeña sobre el título', type: 'string', group: 'content', description: 'Texto pequeño tipo píldora que aparece arriba del título principal.', options: fieldHelp({example: 'Wedding planner en Lima'})},
    {name: 'titleLine1', title: 'Título normal — línea 1', type: 'string', group: 'content', description: 'Primera línea del título principal. Esta línea se verá sin pintar.', options: fieldHelp({example: 'Cada evento puede contar una historia.'})},
    {name: 'highlightWord', title: 'Título pintado — línea 2', type: 'string', group: 'content', description: 'Segunda línea del título principal. Esta línea tendrá el estilo destacado/pintado.', options: fieldHelp({example: 'Empecemos por la tuya.', helpText: 'Ahora el Hero usa solo dos campos para el título: una línea normal y una línea destacada.'})},
    {name: 'titleLine2', title: 'Campo anterior — no usar', type: 'string', group: 'content', hidden: true, description: 'Campo conservado solo para compatibilidad con contenido antiguo.'},
    {name: 'titleLine3', title: 'Campo anterior — no usar', type: 'string', group: 'content', hidden: true, description: 'Campo conservado solo para compatibilidad con contenido antiguo.'},
    {name: 'flipWords', title: 'Palabras rotativas', type: 'array', group: 'content', description: 'Palabras que van cambiando en la frase “Especialistas en...”.', options: fieldHelp({helpText: 'Sirven para mostrar diferentes tipos de eventos sin ocupar mucho espacio.', example: 'bodas, quinceañeros, eventos corporativos'}), of: [{type: 'string'}]},
    {name: 'subtitle', title: 'Texto descriptivo principal', type: 'text', group: 'content', description: 'Párrafo corto debajo del título.', options: fieldHelp({helpText: 'Idealmente debe tener una o dos frases. No lo hagas demasiado largo.', example: 'Creamos celebraciones personalizadas con detalles sofisticados y coordinación impecable.'})},
    {
      name: 'ctaPrimary',
      title: 'Botón principal',
      type: 'object',
      group: 'ctas',
      description: 'Botón más importante de la primera pantalla.',
      options: fieldHelp({helpText: 'Normalmente debe llevar a WhatsApp o a la sección de contacto.'}),
      fields: [
        {name: 'label', title: 'Texto del botón', type: 'string', description: 'Texto que aparece dentro del botón.', options: fieldHelp({example: 'Cotiza ahora'})},
        {name: 'href', title: 'Destino del botón', type: 'string', description: 'Link o sección a donde lleva el botón.', options: fieldHelp({example: '#contacto'})},
      ],
    },
    {
      name: 'ctaSecondary',
      title: 'Botón secundario',
      type: 'object',
      group: 'ctas',
      description: 'Botón de apoyo, menos importante que el principal.',
      fields: [
        {name: 'label', title: 'Texto del botón', type: 'string', description: 'Texto que aparece dentro del botón.', options: fieldHelp({example: 'Ver portafolio'})},
        {name: 'href', title: 'Destino del botón', type: 'string', description: 'Link o sección a donde lleva el botón.', options: fieldHelp({example: '#catalogo'})},
      ],
    },
    {
      name: 'featureCards',
      title: 'Cards grandes rotativas',
      type: 'array',
      group: 'cards',
      description: 'Cards grandes que aparecen al lado derecho de la portada y cambian automáticamente.',
      options: fieldHelp({
        helpText: 'Cada card tiene un texto pequeño superior, un título grande, una descripción y un icono.',
        warning: 'Usa títulos cortos para que no se corte el contenido dentro de la card.',
      }),
      of: [
        {
          type: 'object',
          title: 'Card grande del inicio',
          fields: [
            {
              name: 'icon',
              title: 'Icono de la card',
              type: 'string',
              description: 'Icono pequeño que aparece en la esquina superior izquierda de la card.',
              options: {list: iconList.map((i) => i), ...fieldHelp({helpText: 'Elige un icono que represente el tema de la card.'})},
            },
            {
              name: 'eyebrow',
              title: 'Texto pequeño superior de la card',
              type: 'string',
              description: 'Este es el texto pequeño que aparece arriba del título grande dentro de la card.',
              options: fieldHelp({
                example: 'Dirección estética',
                designNote: 'Este campo controla exactamente el texto que aparece arriba de “Diseño floral con mirada editorial”.',
              }),
              validation: (Rule: any) => Rule.required().warning('Recomendado: completa este texto para que la card no quede vacía arriba.'),
            },
            {name: 'title', title: 'Título grande de la card', type: 'string', description: 'Título principal de esta card.', options: fieldHelp({example: 'Diseño floral con mirada editorial'}), validation: (Rule: any) => Rule.required().warning('La card necesita un título.')},
            {name: 'description', title: 'Descripción de la card', type: 'text', description: 'Texto inferior de la card.', options: fieldHelp({example: 'Moodboard, flores, montaje y atmósfera visual con una propuesta coherente y elegante.'})},
            {name: 'visible', title: 'Mostrar esta card', type: 'boolean', initialValue: true, description: 'Activa o desactiva esta card sin borrarla.', options: fieldHelp({helpText: 'Útil si quieres guardarla para después.'})},
          ],
          preview: {
            select: {title: 'title', subtitle: 'eyebrow', visible: 'visible'},
            prepare: ({title, subtitle, visible}: any) => ({
              title: title || 'Card grande del inicio',
              subtitle: visibilitySubtitle(visible, subtitle || 'Sin texto pequeño superior'),
            }),
          },
        },
      ],
    },
    {
      name: 'floatingNotes',
      title: 'Mini cards debajo de la card grande',
      type: 'array',
      group: 'cards',
      description: 'Etiquetas pequeñas flotantes que aparecen debajo de la card grande.',
      options: fieldHelp({helpText: 'Funcionan como accesos visuales o beneficios cortos. Mantén el texto breve.'}),
      of: [
        {
          type: 'object',
          title: 'Mini card',
          fields: [
            {name: 'text', title: 'Texto de la mini card', type: 'string', description: 'Texto corto que aparece dentro de la mini card.', options: fieldHelp({example: 'Dirección floral'})},
            {name: 'icon', title: 'Icono de la mini card', type: 'string', description: 'Icono pequeño de la mini card.', options: {list: iconList.map((i) => i), ...fieldHelp({helpText: 'Elige un icono simple y fácil de reconocer.'})}},
            {name: 'visible', title: 'Mostrar esta mini card', type: 'boolean', initialValue: true, description: 'Activa o desactiva esta mini card sin borrarla.', options: fieldHelp({helpText: 'Si está apagado, no aparecerá en la portada.'})},
          ],
          preview: {select: {title: 'text', visible: 'visible'}, prepare: ({title, visible}: any) => ({title: title || 'Mini card', subtitle: visibilitySubtitle(visible)})},
        },
      ],
    },
  ],
  preview: {prepare: () => ({title: 'Inicio / Primera pantalla'})},
};

export default heroSection;
