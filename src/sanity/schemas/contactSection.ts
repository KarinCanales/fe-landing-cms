import {fieldHelp, studioGroup} from './helpers';

const contactSection = {
  name: 'contactSection',
  title: 'Contacto',
  type: 'document',
  description:
    'Controla los textos y el formulario de contacto. WhatsApp, correos, horarios y redes se toman automáticamente de Datos generales.',
  groups: [
    studioGroup('content', 'Textos de contacto', {default: true}),
    studioGroup('background', 'Foto de fondo'),
    studioGroup('form', 'Formulario'),
    studioGroup('settings', 'Mostrar u ocultar'),
  ],
  fields: [
    {name: 'visible', title: 'Mostrar sección Contacto', type: 'boolean', group: 'settings', initialValue: true, description: 'Activa o desactiva toda la sección sin borrar su contenido.', options: fieldHelp({helpText: 'Si está apagada, el contacto no aparecerá como sección.'})},
    {name: 'backgroundImage', title: 'Imagen de fondo', type: 'image', group: 'background', description: 'Imagen de fondo para la sección de contacto.', options: {hotspot: true, ...fieldHelp({helpText: 'Usa una imagen clara/cálida que permita leer bien el formulario.'})}},
    {name: 'backgroundAlt', title: 'Descripción de la imagen para accesibilidad', type: 'string', group: 'background', description: 'Texto para lectores de pantalla. No se muestra visualmente en la web, pero ayuda a personas que usan tecnologías de asistencia y mejora la accesibilidad.', options: fieldHelp({example: 'Detalle elegante de evento para sección de contacto.'})},
    {name: 'eyebrow', title: 'Etiqueta pequeña superior', type: 'string', group: 'content', description: 'Texto pequeño encima del título.', options: fieldHelp({example: 'Conversemos sobre tu evento'})},
    {name: 'title', title: 'Título principal', type: 'string', group: 'content', description: 'Título grande de la sección de contacto.', options: fieldHelp({example: 'Cuéntanos qué estás imaginando.'})},
    {name: 'highlightWord', title: 'Texto destacado del título', type: 'string', group: 'content', description: 'Palabra o frase resaltada dentro del título.', options: fieldHelp({example: 'Karin se encarga de cuidar los detalles.'})},
    {name: 'description', title: 'Texto descriptivo', type: 'text', group: 'content', description: 'Texto que explica qué debe hacer el visitante.', options: fieldHelp({helpText: 'Manténlo claro y directo. Debe invitar a escribir.'})},
    {
      name: 'form',
      title: 'Formulario de contacto',
      type: 'object',
      group: 'form',
      description: 'Ajustes de los textos que aparecen dentro del formulario.',
      options: fieldHelp({
        helpText: 'Las categorías del formulario salen de la sección Servicios y siempre se agrega la opción “Otro”.',
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
