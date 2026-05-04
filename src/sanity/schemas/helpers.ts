import {ColorInput} from '../components/ColorInput';

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
  {name: 'footer', title: 'Textos legales'},
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
  {name: 'links', title: 'Botones del menú', default: true},
  {name: 'cta', title: 'Botón de WhatsApp'},
  {name: 'style', title: 'Color de la barra'},
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
