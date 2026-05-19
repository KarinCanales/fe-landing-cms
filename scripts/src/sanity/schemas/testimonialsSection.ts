import {fieldHelp, sectionGroups, visibilitySubtitle} from './helpers';

const testimonialsSection = {
  name: 'testimonialsSection',
  title: 'Testimonios',
  type: 'document',
  description:
    'Administra las historias y opiniones de clientes. Puedes agregar testimonios, ocultarlos o cambiar el orden.',
  groups: sectionGroups,
  fields: [
    {name: 'visible', title: 'Mostrar sección Testimonios', type: 'boolean', group: 'settings', initialValue: true, description: 'Activa o desactiva toda la sección sin borrar su contenido.', options: fieldHelp({helpText: 'Si está apagada, no se mostrará la sección.'})},
    {name: 'backgroundImage', title: 'Imagen de fondo', type: 'image', group: 'background', description: 'Imagen suave de fondo para los testimonios.', options: {hotspot: true, ...fieldHelp({helpText: 'Usa una imagen cálida y elegante. El diseño aplica un filtro claro.'})}},
    {name: 'backgroundAlt', title: 'Descripción de la imagen para accesibilidad', type: 'string', group: 'background', description: 'Texto para lectores de pantalla. No se muestra visualmente en la web, pero ayuda a personas que usan tecnologías de asistencia y mejora la accesibilidad.', options: fieldHelp({example: 'Fondo cálido con velas para testimonios.'})},
    {name: 'eyebrow', title: 'Etiqueta pequeña superior', type: 'string', group: 'content', description: 'Texto pequeño que aparece arriba del título.', options: fieldHelp({example: 'Historias reales'})},
    {name: 'title', title: 'Título principal', type: 'string', group: 'content', description: 'Título grande de la sección.', options: fieldHelp({example: 'Celebraciones que se recuerdan.'})},
    {name: 'highlightWord', title: 'Texto destacado del título', type: 'string', group: 'content', description: 'Palabra o frase resaltada dentro del título.', options: fieldHelp({example: 'se recuerdan.'})},
    {name: 'storyPanelLabel', title: 'Texto de la card superior', type: 'string', group: 'content', description: 'Etiqueta de la card que indica qué testimonio está activo.', options: fieldHelp({example: 'Ahora en pantalla'})},
    {
      name: 'testimonials',
      title: 'Lista de testimonios',
      type: 'array',
      group: 'cards',
      description: 'Testimonios que aparecen en el carrusel.',
      options: fieldHelp({
        helpText: 'Puedes agregar, eliminar, ocultar o reordenar testimonios.',
        warning: 'Los testimonios demasiado largos pueden verse pesados. Ideal: 1 a 3 frases.',
      }),
      of: [{
        type: 'object',
        title: 'Testimonio',
        fields: [
          {name: 'names', title: 'Nombre(s)', type: 'string', description: 'Nombre de la persona o pareja.', options: fieldHelp({example: 'Andrea & Sebastián'}), validation: (Rule: any) => Rule.required().warning('El testimonio necesita nombre si estará visible.')},
          {name: 'event', title: 'Tipo de evento', type: 'string', description: 'Evento relacionado al testimonio.', options: fieldHelp({example: 'Boda personalizada'})},
          {name: 'quote', title: 'Texto del testimonio', type: 'text', description: 'Opinión o comentario del cliente.', options: fieldHelp({helpText: 'Manténlo natural y relativamente corto.', example: 'Cada proveedor, cada horario y cada detalle estuvo perfectamente coordinado.'}), validation: (Rule: any) => Rule.required().warning('Agrega el texto del testimonio.')},
          {name: 'photo', title: 'Foto opcional', type: 'image', description: 'Foto de la pareja/persona o del evento.', options: {hotspot: true, ...fieldHelp({helpText: 'Si no subes foto, el diseño usará iniciales automáticamente.'})}},
          {name: 'rating', title: 'Número de estrellas', type: 'number', description: 'Calificación visual del testimonio.', initialValue: 5, options: fieldHelp({example: '5'}), validation: (Rule: any) => Rule.min(1).max(5).warning('Usa un número entre 1 y 5.')},
          {name: 'visible', title: 'Mostrar este testimonio', type: 'boolean', initialValue: true, description: 'Oculta o muestra este testimonio sin borrarlo.', options: fieldHelp({helpText: 'Si está apagado, no aparecerá en la web.'})},
        ],
        preview: {select: {title: 'names', event: 'event', visible: 'visible', rating: 'rating', media: 'photo'}, prepare: ({title, event, visible, rating, media}: any) => ({title: title || 'Testimonio', subtitle: visibilitySubtitle(visible, `${event || 'Sin tipo de evento'} · ${rating || 5} estrellas`), media})},
      }],
    },
  ],
  preview: {prepare: () => ({title: 'Testimonios'})},
};

export default testimonialsSection;
