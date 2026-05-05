import React from 'react';
import {ColorInput} from '../components/ColorInput';
import {resolveIcon} from '../icons';

export const sectionGroups = [
  {name: 'content', title: 'Contenido principal', default: true},
  {name: 'background', title: 'Fondo de la sección'},
  {name: 'cards', title: 'Cards y elementos'},
  {name: 'settings', title: 'Mostrar / ocultar y ajustes'},
];

export const siteGroups = [
  {name: 'identity', title: 'Identidad de marca', default: true},
  {name: 'contact', title: 'Datos de contacto'},
  {name: 'social', title: 'Redes sociales'},
  {name: 'seo', title: 'Vista al compartir / Google'},
];

export const footerGroups = [
  {name: 'cta', title: 'Bloque principal superior', default: true},
  {name: 'brand', title: 'Marca'},
  {name: 'navigation', title: 'Columnas y enlaces'},
  {name: 'contact', title: 'Datos de contacto'},
  {name: 'social', title: 'Redes sociales'},
  {name: 'background', title: 'Fondo y ambiente visual'},
];

export const navbarGroups = [
  {name: 'style', title: 'Ajustes visuales', default: true},
];

export function fieldHelp({
  helpText,
  example,
  warning,
  designNote,
}: {
  helpText?: string;
  example?: string;
  warning?: string;
  designNote?: string;
}) {
  return {helpText, example, warning, designNote};
}

export function visibilitySubtitle(visible?: boolean, extra?: string) {
  const state = visible === false ? 'Oculto' : 'Visible';
  return extra ? `${state} · ${extra}` : state;
}

export function iconField(title = 'Icono') {
  return {
    name: 'icon',
    title,
    type: 'string',
    options: {
      list: [],
      ...fieldHelp({
        helpText: 'Elige un icono de la lista. El icono aparece como detalle visual dentro de la card o enlace.',
        warning: 'No escribas nombres manualmente. Usa la lista para evitar que el icono no aparezca.',
      }),
    },
  };
}

export function colorField({
  name = 'borderColor',
  title = 'Color de animación',
  description = 'Color usado para el brillo o borde animado de este elemento.',
}: {
  name?: string;
  title?: string;
  description?: string;
}) {
  return {
    name,
    title,
    type: 'string',
    description,
    components: {input: ColorInput},
    options: fieldHelp({
      helpText: 'Puedes elegir un color con el selector visual o escribir un código hexadecimal.',
      example: '#d2ab80 para dorado cálido, #809671 para verde elegante.',
      designNote: 'Para mantener la marca, usa de preferencia los colores de la paleta: verde matcha, pistacho, chai, carob, vanilla o almond.',
    }),
    validation: (Rule: any) =>
      Rule.regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).warning(
        'Usa un color hexadecimal válido. Ejemplo: #d2ab80.',
      ),
  };
}


export function iconPreviewMedia(icon?: string | null, color?: string | null) {
  const Icon = resolveIcon(icon || undefined);
  const accent = color || '#2a5a55';

  return function IconPreview() {
    return React.createElement(
      'span',
      {
        style: {
          width: 34,
          height: 34,
          display: 'grid',
          placeItems: 'center',
          borderRadius: 12,
          color: accent,
          background: 'rgba(229, 224, 216, 0.16)',
          border: `1px solid ${accent}55`,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,.12)',
        },
      },
      React.createElement(Icon, {size: 18}),
    );
  };
}
