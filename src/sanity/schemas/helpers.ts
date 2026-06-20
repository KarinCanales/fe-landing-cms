import React from 'react';
import {
  Brush,
  Camera,
  Contact,
  Eye,
  FileText,
  FormInput,
  HeartHandshake,
  Image as ImageIcon,
  LayoutGrid,
  Link,
  Megaphone,
  Palette,
  Settings,
  Share2,
  Sparkles,
  Store,
  type LucideIcon,
} from 'lucide-react';
import {ColorInput} from '../components/ColorInput';
import {IconInput} from '../components/IconInput';
import {resolveIcon} from '../icons';
import {iconList} from './shared';

export const sectionGroups = [
  {name: 'content', title: 'Textos principales', default: true, icon: FileText},
  {name: 'background', title: 'Imagen de fondo', icon: ImageIcon},
  {name: 'cards', title: 'Tarjetas y detalles', icon: LayoutGrid},
  {name: 'settings', title: 'Mostrar u ocultar', icon: Eye},
];

export const siteGroups = [
  {name: 'identity', title: 'Marca y logo', default: true, icon: Sparkles},
  {name: 'contact', title: 'Datos de contacto', icon: Contact},
  {name: 'social', title: 'Redes sociales', icon: Share2},
  {name: 'seo', title: 'Cómo se ve el link', icon: Link},
];

export const footerGroups = [
  {name: 'cta', title: 'Invitación final', default: true, icon: Megaphone},
  {name: 'brand', title: 'Textos del pie', icon: Store},
  {name: 'navigation', title: 'Columnas y enlaces', icon: LayoutGrid},
  {name: 'contact', title: 'Datos de contacto', icon: Contact},
  {name: 'social', title: 'Redes sociales', icon: Share2},
  {name: 'background', title: 'Imagen de fondo', icon: ImageIcon},
];

export const navbarGroups = [
  {name: 'style', title: 'Ajustes visuales', default: true, icon: Palette},
];

export const studioGroupIcons: Record<string, LucideIcon> = {
  background: ImageIcon,
  cards: LayoutGrid,
  content: FileText,
  ctas: Megaphone,
  form: FormInput,
  items: Camera,
  services: HeartHandshake,
  settings: Eye,
  style: Brush,
  visibility: Eye,
};

export function studioGroup(
  name: string,
  title: string,
  options: {default?: boolean; icon?: LucideIcon} = {},
) {
  return {
    name,
    title,
    default: options.default,
    icon: options.icon || studioGroupIcons[name] || Settings,
  };
}

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

export function iconField(title = 'Icono', description = 'Elige un icono decorativo de la lista.') {
  return {
    name: 'icon',
    title,
    type: 'string',
    description,
    components: {input: IconInput},
    options: {
      list: iconList.map((i) => i),
      ...fieldHelp({
        helpText: 'Elige un icono de la lista. La vista previa del icono aparece al lado del selector.',
      }),
    },
  };
}

/** Shorthand: returns the components + options for an inline icon string field */
export function iconFieldInline(helpText = 'Elige un icono de la lista.') {
  return {
    components: {input: IconInput},
    options: {
      list: iconList.map((i) => i),
      ...fieldHelp({helpText}),
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
