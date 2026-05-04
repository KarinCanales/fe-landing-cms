import {iconList, overlayPresets} from './shared';
import {fieldHelp, sectionGroups, visibilitySubtitle} from './helpers';

const contactSection = {
  name: 'contactSection',
  title: 'Contacto',
  type: 'document',
  description:
    'Controla la sección de contacto, las cards de datos y las opciones del formulario.',
  groups: [
    {name: 'content', title: 'Contenido principal', default: true},
    {name: 'background', title: 'Fondo de la sección'},
    {name: 'cards', title: 'Datos de contacto'},
    {name: 'form', title: 'Formulario'},
    {name: 'settings', title: 'Mostrar / ocultar'},
  ],
  fields: [
    {name: 'visible', title: 'Mostrar sección Contacto', type: 'boolean', group: 'settings', initialValue: true, description: 'Activa o desactiva toda la sección sin borrar su contenido.', options: fieldHelp({helpText: 'Si está apagada, el contacto no aparecerá como sección.'})},
    {name: 'backgroundImage', title: 'Imagen de fondo', type: 'image', group: 'background', description: 'Imagen de fondo para la sección de contacto.', options: {hotspot: true, ...fieldHelp({helpText: 'Usa una imagen clara/cálida que permita leer bien el formulario.'})}},
    {name: 'backgroundAlt', title: 'Descripción de la imagen para accesibilidad', type: 'string', group: 'background', description: 'Texto que describe la imagen de fondo.', options: fieldHelp({example: 'Detalle elegante de evento para sección de contacto.'})},
    {name: 'overlay', title: 'Filtro visual del fondo', type: 'string', group: 'background', description: 'Capa visual que armoniza la imagen de fondo.', options: {list: overlayPresets.map((p) => p), ...fieldHelp({example: 'Claro editorial almendra.'})}},
    {name: 'eyebrow', title: 'Etiqueta pequeña superior', type: 'string', group: 'content', description: 'Texto pequeño encima del título.', options: fieldHelp({example: 'Conversemos sobre tu evento'})},
    {name: 'title', title: 'Título principal', type: 'string', group: 'content', description: 'Título grande de la sección de contacto.', options: fieldHelp({example: 'Cuéntanos qué estás imaginando.'})},
    {name: 'highlightWord', title: 'Texto destacado del título', type: 'string', group: 'content', description: 'Palabra o frase resaltada dentro del título.', options: fieldHelp({example: 'Karin se encarga de cuidar los detalles.'})},
    {name: 'description', title: 'Texto descriptivo', type: 'text', group: 'content', description: 'Texto que explica qué debe hacer el visitante.', options: fieldHelp({helpText: 'Manténlo claro y directo. Debe invitar a escribir.'})},
    {
      name: 'contactCards',
      title: 'Cards de contacto',
      type: 'array',
      group: 'cards',
      description: 'Pequeñas cards con WhatsApp, correo, ubicación u otros datos.',
      options: fieldHelp({helpText: 'Puedes agregar, ocultar o reordenar datos de contacto.'}),
      of: [{
        type: 'object',
        title: 'Dato de contacto',
        fields: [
          {name: 'type', title: 'Tipo de dato', type: 'string', description: 'Tipo interno para identificar el dato.', options: fieldHelp({example: 'whatsapp, email, ubicación'})},
          {name: 'label', title: 'Título visible', type: 'string', description: 'Nombre que aparece en la card.', options: fieldHelp({example: 'WhatsApp'})},
          {name: 'value', title: 'Texto mostrado', type: 'string', description: 'Valor visible para el visitante.', options: fieldHelp({example: 'Respuesta rápida'})},
          {name: 'icon', title: 'Icono', type: 'string', description: 'Icono que acompaña este dato.', options: {list: iconList.map((i) => i), ...fieldHelp({helpText: 'Elige un icono de la lista.'})}},
          {name: 'link', title: 'Enlace opcional', type: 'string', description: 'Destino cuando se hace click en la card.', options: fieldHelp({example: 'https://wa.me/51999999999 o mailto:hola@...'})},
          {name: 'visible', title: 'Mostrar este dato', type: 'boolean', initialValue: true, description: 'Oculta o muestra este dato sin borrarlo.', options: fieldHelp({helpText: 'Si está apagado, no aparecerá en la web.'})},
        ],
        preview: {select: {title: 'label', subtitle: 'value', visible: 'visible'}, prepare: ({title, subtitle, visible}: any) => ({title: title || 'Dato de contacto', subtitle: visibilitySubtitle(visible, subtitle)})},
      }],
    },
    {
      name: 'form',
      title: 'Formulario de contacto',
      type: 'object',
      group: 'form',
      description: 'Textos y opciones del formulario que usa el visitante para enviar una solicitud.',
      options: fieldHelp({helpText: 'Las categorías ayudan a entender qué tipo de evento desea cotizar la persona.'}),
      fields: [
        {name: 'title', title: 'Título del formulario', type: 'string', description: 'Título visible encima de los campos del formulario.', options: fieldHelp({example: 'Formulario de contacto'})},
        {name: 'description', title: 'Descripción del formulario', type: 'text', description: 'Texto corto que explica cómo usar el formulario.', options: fieldHelp({example: 'Completa la información y prepararemos el correo automáticamente.'})},
        {name: 'submitLabel', title: 'Texto del botón de enviar', type: 'string', description: 'Texto que aparece en el botón final del formulario.', options: fieldHelp({example: 'Preparar correo'})},
        {
          name: 'eventTypes',
          title: 'Categorías del formulario',
          type: 'array',
          description: 'Opciones que el visitante puede elegir como tipo de evento o servicio.',
          options: fieldHelp({
            helpText: 'Puedes agregar, ocultar, eliminar o reordenar categorías.',
            warning: 'Mantén siempre una opción general para casos que no encajen. También puedes activar “Otro”.',
          }),
          of: [{
            type: 'object',
            title: 'Categoría del formulario',
            fields: [
              {name: 'label', title: 'Nombre de la categoría', type: 'string', description: 'Texto que verá el visitante en el selector.', options: fieldHelp({example: 'Bodas Personalizadas'}), validation: (Rule: any) => Rule.required().warning('La categoría necesita un nombre.')},
              {name: 'visible', title: 'Mostrar esta categoría', type: 'boolean', initialValue: true, description: 'Oculta o muestra esta categoría sin borrarla.', options: fieldHelp({helpText: 'Si está apagada, no aparecerá en el formulario.'})},
              {name: 'order', title: 'Orden', type: 'number', description: 'Número para ordenar. Menor número aparece primero.', options: fieldHelp({example: '0, 1, 2...'})},
            ],
            preview: {select: {title: 'label', visible: 'visible'}, prepare: ({title, visible}: any) => ({title: title || 'Categoría', subtitle: visibilitySubtitle(visible)})},
          }],
        },
        {name: 'includeOtherOption', title: 'Agregar opción “Otro”', type: 'boolean', initialValue: true, description: 'Agrega una opción final para casos que no están en la lista.', options: fieldHelp({helpText: 'Recomendado dejarlo activado para no perder solicitudes especiales.'})},
      ],
    },
  ],
  preview: {prepare: () => ({title: 'Contacto'})},
};

export default contactSection;
