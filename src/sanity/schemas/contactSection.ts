import {overlayPresets} from './shared';
import {fieldHelp} from './helpers';

const contactSection = {
  name: 'contactSection',
  title: 'Contacto',
  type: 'document',
  description:
    'Controla solo los textos y el formulario de la sección. WhatsApp, emails, horario y redes se toman de Datos generales. Las categorías del formulario se toman de Servicios.',
  groups: [
    {name: 'content', title: 'Contenido principal', default: true},
    {name: 'background', title: 'Fondo de la sección'},
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
      name: 'form',
      title: 'Formulario de contacto',
      type: 'object',
      group: 'form',
      description: 'Las categorías del selector se generan automáticamente desde la lista de Servicios y siempre se agrega la opción “Otro”.',
      options: fieldHelp({
        helpText: 'Para cambiar las categorías del formulario, edita la sección Servicios. No hay una lista duplicada en Contacto.',
      }),
      fields: [
        {name: 'title', title: 'Título del formulario', type: 'string', description: 'Título visible encima de los campos del formulario.', options: fieldHelp({example: 'Formulario de cotización'})},
        {name: 'description', title: 'Descripción del formulario', type: 'text', description: 'Texto corto que explica cómo usar el formulario.', options: fieldHelp({example: 'Completa la información y prepararemos el correo automáticamente.'})},
        {name: 'submitLabel', title: 'Texto del botón de enviar', type: 'string', description: 'Texto que aparece en el botón final del formulario.', options: fieldHelp({example: 'Preparar cotización'})},
      ],
    },
  ],
  preview: {prepare: () => ({title: 'Contacto'})},
};

export default contactSection;
