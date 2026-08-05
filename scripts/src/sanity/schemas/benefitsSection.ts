import {cardSizes, iconList} from './shared';
import {fieldHelp, iconFieldInline, iconPreviewMedia, sectionGroups, visibilitySubtitle} from './helpers';

const benefitsSection = {
  name: 'benefitsSection',
  title: 'Beneficios',
  type: 'document',
  description:
    'Sección que explica por qué elegir a Karin. Normalmente usa un fondo claro y cards con beneficios de confianza.',
  groups: sectionGroups,
  fields: [
    {name: 'visible', title: 'Mostrar sección Beneficios', type: 'boolean', group: 'settings', initialValue: true, description: 'Activa o desactiva toda la sección sin borrar su contenido.', options: fieldHelp({helpText: 'Útil si todavía estás editando esta sección.'})},
    {name: 'backgroundImage', title: 'Imagen de fondo', type: 'image', group: 'background', description: 'Imagen de fondo suave para acompañar los beneficios.', options: {hotspot: true, ...fieldHelp({helpText: 'Usa una imagen clara, limpia y con pocos elementos distractores.', designNote: 'La sección ya aplica filtros claros; evita imágenes demasiado blancas o quemadas.'})}},
    {name: 'backgroundAlt', title: 'Descripción de la imagen para accesibilidad', type: 'string', group: 'background', description: 'Texto para lectores de pantalla. No se muestra visualmente en la web, pero ayuda a personas que usan tecnologías de asistencia y mejora la accesibilidad.', options: fieldHelp({example: 'Decoración elegante con flores y mesa de evento.'})},
    {name: 'theme', title: 'Tipo de sección', type: 'string', group: 'background', initialValue: 'light', description: 'Define si esta sección se trata visualmente como clara u oscura.', options: {list: [{title: 'Clara', value: 'light'}, {title: 'Oscura', value: 'dark'}], ...fieldHelp({helpText: 'Beneficios normalmente debe ser una sección clara.'})}},
    {name: 'eyebrow', title: 'Etiqueta pequeña superior', type: 'string', group: 'content', description: 'Texto pequeño que aparece arriba del título.', options: fieldHelp({example: 'Excelencia garantizada'})},
    {name: 'title', title: 'Título principal', type: 'string', group: 'content', description: 'Título grande de la sección.', options: fieldHelp({example: 'Tu tranquilidad es nuestro mayor lujo.'})},
    {name: 'highlightWord', title: 'Texto destacado del título', type: 'string', group: 'content', description: 'Palabra o frase que tendrá un color/estilo diferente dentro del título.', options: fieldHelp({example: 'mayor lujo.'})},
    {name: 'description', title: 'Texto descriptivo', type: 'text', group: 'content', description: 'Párrafo de apoyo que explica la promesa de la sección.', options: fieldHelp({helpText: 'Idealmente 1 a 3 líneas para mantener buen ritmo visual.'})},
    {
      name: 'cards',
      title: 'Cards de beneficios',
      type: 'array',
      group: 'cards',
      description: 'Beneficios individuales mostrados como cards.',
      options: fieldHelp({warning: 'Si agregas muchas cards, usa títulos cortos para que el diseño respire.'}),
      of: [{
        type: 'object',
        title: 'Beneficio',
        fields: [
          {name: 'title', title: 'Título del beneficio', type: 'string', description: 'Nombre corto del beneficio.', options: fieldHelp({example: 'Planificación integral'}), validation: (Rule: any) => Rule.required().warning('Cada beneficio necesita un título.')},
          {name: 'eyebrow', title: 'Texto pequeño superior', type: 'string', description: 'Etiqueta pequeña opcional que aparece en la card.', options: fieldHelp({example: 'Organización'})},
          {name: 'description', title: 'Descripción del beneficio', type: 'text', description: 'Explicación breve del beneficio.', options: fieldHelp({helpText: 'Manténlo corto para que no se deforme la card.'})},
          {name: 'icon', title: 'Icono', type: 'string', description: 'Icono decorativo del beneficio.', ...iconFieldInline('Elige un icono que represente este beneficio.')},
          {name: 'size', title: 'Tamaño visual de la card', type: 'string', initialValue: 'sm', description: 'Tamaño de la card dentro del layout.', options: {list: cardSizes.map((s) => s), ...fieldHelp({warning: 'Cambiar tamaños puede alterar el balance visual, sobre todo en mobile.'})}},
          {name: 'visible', title: 'Mostrar este beneficio', type: 'boolean', initialValue: true, description: 'Oculta o muestra este beneficio sin borrarlo.', options: fieldHelp({helpText: 'Si está apagado, no aparecerá en la web.'})},
        ],
        preview: {select: {title: 'title', subtitle: 'eyebrow', visible: 'visible', icon: 'icon'}, prepare: ({title, subtitle, visible, icon}: any) => ({title: title || 'Beneficio', subtitle: visibilitySubtitle(visible, subtitle), media: iconPreviewMedia(icon)})},
      }],
    },
    {
      name: 'stats',
      title: 'Datos o estadísticas',
      type: 'array',
      group: 'cards',
      description: 'Pequeños datos de confianza que pueden aparecer dentro de la sección.',
      options: fieldHelp({example: '12+ eventos, Lima, Atención personalizada.'}),
      of: [{
        type: 'object',
        title: 'Dato de confianza',
        fields: [
          {name: 'value', title: 'Número o texto principal', type: 'string', description: 'Texto grande del dato.', options: fieldHelp({example: '12+'})},
          {name: 'label', title: 'Descripción corta del dato', type: 'string', description: 'Texto que acompaña al número o dato.', options: fieldHelp({example: 'eventos coordinados'})},
          {name: 'visible', title: 'Mostrar este dato', type: 'boolean', initialValue: true, description: 'Oculta o muestra este dato sin borrarlo.', options: fieldHelp({helpText: 'Si está apagado, no aparecerá en la web.'})},
        ],
        preview: {select: {title: 'value', subtitle: 'label', visible: 'visible'}, prepare: ({title, subtitle, visible}: any) => ({title: title || 'Dato', subtitle: visibilitySubtitle(visible, subtitle)})},
      }],
    },
  ],
  preview: {prepare: () => ({title: 'Beneficios'})},
};

export default benefitsSection;
