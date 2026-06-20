import {iconList} from './shared';
import {fieldHelp, iconFieldInline, iconPreviewMedia, studioGroup, visibilitySubtitle} from './helpers';

const servicesSection = {
  name: 'servicesSection',
  title: 'Servicios',
  type: 'document',
  description:
    'Aquí se ordenan los servicios que ofrece la empresa. Cada servicio puede tener foto, descripción breve, etiquetas e icono.',
  groups: [
    studioGroup('content', 'Textos de la sección', {default: true}),
    studioGroup('background', 'Foto de fondo'),
    studioGroup('cards', 'Mensajes de apoyo'),
    studioGroup('services', 'Lista de servicios'),
    studioGroup('settings', 'Mostrar u ocultar'),
  ],
  fields: [
    {name: 'visible', title: 'Mostrar sección Servicios', type: 'boolean', group: 'settings', initialValue: true, description: 'Activa o desactiva toda la sección sin borrar su contenido.', options: fieldHelp({helpText: 'Útil si todavía estás editando servicios.'})},
    {name: 'backgroundImage', title: 'Imagen de fondo', type: 'image', group: 'background', description: 'Imagen o ambiente de fondo para la sección de servicios.', options: {hotspot: true, ...fieldHelp({helpText: 'Usa una imagen elegante que no compita con las cards.', designNote: 'La sección usa overlay oscuro para que el contenido se lea bien.'})}},
    {name: 'backgroundAlt', title: 'Descripción de la imagen para accesibilidad', type: 'string', group: 'background', description: 'Texto para lectores de pantalla. No se muestra visualmente en la web, pero ayuda a personas que usan tecnologías de asistencia y mejora la accesibilidad.', options: fieldHelp({example: 'Mesa de evento decorada con flores y velas.'})},
    {name: 'eyebrow', title: 'Etiqueta pequeña superior', type: 'string', group: 'content', description: 'Texto pequeño que aparece arriba del título de Servicios.', options: fieldHelp({example: 'Servicios Karin'})},
    {name: 'title', title: 'Título principal', type: 'string', group: 'content', description: 'Título grande de la sección.', options: fieldHelp({example: 'Nuestros Servicios'})},
    {name: 'highlightWord', title: 'Texto destacado del título', type: 'string', group: 'content', description: 'Palabra o frase que se resaltará dentro del título.', options: fieldHelp({example: 'Servicios'})},
    {
      name: 'leadCard',
      title: 'Card superior derecha',
      type: 'object',
      group: 'cards',
      description: 'Card pequeña que aparece arriba a la derecha con un mensaje general de la sección.',
      options: fieldHelp({helpText: 'Es la card con textos como “Una experiencia integral...”'}),
      fields: [
        {name: 'text', title: 'Texto de la card', type: 'text', description: 'Mensaje que aparece en la card superior derecha.', options: fieldHelp({example: 'Una experiencia integral para eventos con carácter, estética cuidada y ejecución sin fricciones.'})},
        {name: 'icon', title: 'Icono', type: 'string', description: 'Icono de esta card auxiliar.', ...iconFieldInline('Elige un icono sobrio para acompañar el mensaje.')},
        {name: 'visible', title: 'Mostrar esta card', type: 'boolean', initialValue: true, description: 'Oculta o muestra la card sin borrarla.', options: fieldHelp({helpText: 'Si está apagado, la card no aparecerá.'})},
      ],
    },
    {
      name: 'footerCard',
      title: 'Card inferior de apoyo',
      type: 'object',
      group: 'cards',
      description: 'Card pequeña inferior con un mensaje complementario.',
      fields: [
        {name: 'text', title: 'Texto de la card', type: 'text', description: 'Mensaje de apoyo que aparece debajo del bloque de servicios.', options: fieldHelp({example: 'Catering, bodas, organización y ambientación trabajando como una sola experiencia.'})},
        {name: 'icon', title: 'Icono', type: 'string', description: 'Icono de esta card inferior.', ...iconFieldInline('Elige un icono simple.')},
        {name: 'visible', title: 'Mostrar esta card', type: 'boolean', initialValue: true, description: 'Oculta o muestra la card sin borrarla.', options: fieldHelp({helpText: 'Si está apagado, la card no aparecerá.'})},
      ],
    },
    {
      name: 'services',
      title: 'Servicios disponibles',
      type: 'array',
      group: 'services',
      description: 'Lista editable de servicios que aparecen como cards verticales/interactivas.',
      options: fieldHelp({
        helpText: 'Puedes agregar, eliminar, ocultar o reordenar servicios.',
        warning: 'En pantallas grandes, demasiados servicios pueden hacer que las cards se vean más angostas. Mantén títulos breves.',
      }),
      of: [{
        type: 'object',
        title: 'Servicio',
        fields: [
          {name: 'title', title: 'Nombre del servicio', type: 'string', description: 'Nombre visible del servicio.', options: fieldHelp({example: 'Catering y Decoración'}), validation: (Rule: any) => Rule.required().warning('El servicio necesita un nombre.')},
          {name: 'eyebrow', title: 'Texto pequeño superior', type: 'string', description: 'Etiqueta pequeña que va arriba del nombre del servicio.', options: fieldHelp({example: 'Alta gastronomía'})},
          {name: 'description', title: 'Descripción del servicio', type: 'text', description: 'Explicación breve del servicio.', options: fieldHelp({helpText: '2 o 3 líneas como máximo para mantener el diseño limpio.'})},
          {name: 'tags', title: 'Etiquetas del servicio', type: 'array', description: 'Pequeñas etiquetas tipo beneficios o características.', options: fieldHelp({example: 'Menú personalizado, Presentación editorial'}), of: [{type: 'string'}]},
          {name: 'image', title: 'Imagen del servicio', type: 'image', description: 'Imagen que representa el servicio.', options: {hotspot: true, ...fieldHelp({helpText: 'Usa fotos verticales o con buen centro visual.'})}},
          {name: 'imageAlt', title: 'Descripción de la imagen para accesibilidad', type: 'string', description: 'Texto para lectores de pantalla. Los visitantes no lo leen normalmente; describe la foto para accesibilidad.', options: fieldHelp({example: 'Mesa de catering con presentación elegante.'})},
          {name: 'icon', title: 'Icono', type: 'string', description: 'Icono asociado al servicio.', ...iconFieldInline('Elige el icono que mejor represente este servicio.')},
          {name: 'visible', title: 'Mostrar este servicio', type: 'boolean', initialValue: true, description: 'Oculta o muestra este servicio sin borrarlo.', options: fieldHelp({helpText: 'Útil para guardar servicios que todavía no quieres publicar.'})},
        ],
        preview: {select: {title: 'title', subtitle: 'eyebrow', visible: 'visible', media: 'image', icon: 'icon'}, prepare: ({title, subtitle, visible, media, icon}: any) => ({title: title || 'Servicio', subtitle: visibilitySubtitle(visible, subtitle), media: media || iconPreviewMedia(icon)})},
      }],
    },
  ],
  preview: {prepare: () => ({title: 'Servicios'})},
};

export default servicesSection;
