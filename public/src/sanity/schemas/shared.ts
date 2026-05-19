/**
 * Listas controladas para que el panel esté en español y la usuaria no tenga que escribir nombres técnicos.
 * Los values se mantienen iguales porque el frontend los usa para resolver iconos/filtros.
 */
export const iconList = [
  {title: 'Destellos / brillo', value: 'sparkles'},
  {title: 'Calendario', value: 'calendar'},
  {title: 'Calendario con reloj', value: 'calendar-clock'},
  {title: 'Calendario con corazón', value: 'calendar-heart'},
  {title: 'Calendario confirmado', value: 'calendar-check'},
  {title: 'Flor', value: 'flower2'},
  {title: 'Lista de planificación', value: 'clipboard-list'},
  {title: 'Corazón', value: 'heart'},
  {title: 'Acompañamiento / manos', value: 'heart-handshake'},
  {title: 'Corona / exclusividad', value: 'crown'},
  {title: 'Cubiertos / catering', value: 'utensils'},
  {title: 'Acuerdo / coordinación', value: 'handshake'},
  {title: 'Correo', value: 'mail'},
  {title: 'Teléfono', value: 'phone'},
  {title: 'Ubicación', value: 'map-pin'},
  {title: 'Reloj / horario', value: 'clock3'},
  {title: 'Instagram', value: 'instagram'},
  {title: 'Facebook', value: 'facebook'},
  {title: 'WhatsApp', value: 'message-circle'},
  {title: 'Cámara / foto', value: 'camera'},
  {title: 'Comillas / testimonio', value: 'quote'},
  {title: 'Estrella / rating', value: 'star'},
  {title: 'Flecha derecha', value: 'arrow-right'},
  {title: 'Flecha diagonal', value: 'arrow-up-right'},
  {title: 'Enviar', value: 'send'},
  {title: 'Persona', value: 'user'},
  {title: 'Check / aprobado', value: 'check-circle-2'},
  {title: 'Imagen', value: 'image'},
  {title: 'Reproducir video', value: 'play'},
  {title: 'Menú', value: 'menu'},
] as const;

export const overlayPresets = [
  {title: 'Luz cálida suave', value: 'warm-light'},
  {title: 'Oscuro cinematográfico', value: 'dark-cinematic'},
  {title: 'Verde botánico oscuro', value: 'botanical-dark'},
  {title: 'Claro editorial almendra', value: 'editorial-almond'},
  {title: 'Marrón premium carob', value: 'carob-premium'},
] as const;

export const sectionThemes = [
  {title: 'Sección clara', value: 'light'},
  {title: 'Sección oscura', value: 'dark'},
] as const;

export const navbarThemes = [
  {title: 'Claro', value: 'light'},
  {title: 'Oscuro', value: 'dark'},
  {title: 'Botánico', value: 'botanical'},
  {title: 'Cálido', value: 'warm'},
] as const;

export const cardSizes = [
  {title: 'Pequeña', value: 'sm'},
  {title: 'Mediana', value: 'md'},
  {title: 'Grande', value: 'lg'},
] as const;
