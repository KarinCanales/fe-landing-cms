/**
 * Local fallback data that keeps the site functional when Sanity is empty.
 * Mirrors the exact shape the components expect.
 */

export const WHATSAPP_NUMBER = '51922459810';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const CONTACT_EMAIL = 'karin@karincadenaseventos.com';
export const QUOTE_EMAIL = 'presupuestos@karincadenaseventos.com';

// ——————— Navbar ———————

export const fallbackNavLinks = [
  { label: 'Inicio', href: '#inicio', enabled: true, order: 0 },
  { label: 'Beneficios', href: '#beneficios', enabled: true, order: 1 },
  { label: 'Servicios', href: '#servicios', enabled: true, order: 2 },
  { label: 'Catálogo', href: '#catalogo', enabled: true, order: 3 },
  { label: 'Testimonios', href: '#testimonios', enabled: true, order: 4 },
  { label: 'Contacto', href: '#contacto', enabled: true, order: 5 },
];

// ——————— Hero ———————

export const fallbackFlipWords = [
  'catering y decoración',
  'wedding planner',
  'destination wedding',
];

export const fallbackHeroCards = [
  {
    eyebrow: 'Coordinación del día',
    title: 'Tu evento fluye sin estrés',
    description: 'Timing, equipo en campo y solución de imprevistos mientras tú disfrutas.',
    icon: 'calendar-clock',
    visible: true,
  },
  {
    eyebrow: 'Dirección estética',
    title: 'Diseño floral con mirada editorial',
    description: 'Moodboard, flores, montaje y atmósfera visual con una propuesta coherente y elegante.',
    icon: 'flower2',
    visible: true,
  },
  {
    eyebrow: 'Planificación integral',
    title: 'Organización detallada de principio a fin',
    description: 'Cronograma, proveedores, supervisión y acompañamiento para que cada momento se sienta impecable.',
    icon: 'clipboard-list',
    visible: true,
  },
];

export const fallbackFloatingNotes = [
  { text: 'Dirección floral', icon: 'flower2', visible: true },
  { text: 'Coordinación completa', icon: 'calendar-heart', visible: true },
];

// ——————— Benefits ———————

export const fallbackBenefitCards = [
  {
    icon: 'clipboard-list',
    eyebrow: 'Planificación integral',
    title: 'Organización detallada',
    description: 'Cronograma maestro, gestión de proveedores y seguimiento claro para que cada etapa avance sin fricciones.',
    size: 'lg' as const,
    visible: true,
    order: 0,
  },
  {
    icon: 'utensils',
    eyebrow: 'Experiencia gastronómica',
    title: 'Catering premium',
    description: 'Propuestas cuidadas para que la mesa también sea parte de la experiencia.',
    size: 'sm' as const,
    visible: true,
    order: 1,
  },
  {
    icon: 'crown',
    eyebrow: 'Curaduría',
    title: 'Exclusividad',
    description: 'Selección de locaciones, detalles y proveedores alineados con tu estilo.',
    size: 'sm' as const,
    visible: true,
    order: 2,
  },
  {
    icon: 'heart-handshake',
    eyebrow: 'Acompañamiento',
    title: 'Atención 1 a 1',
    description: 'Escuchamos tu visión, ordenamos las ideas y acompañamos cada decisión importante.',
    size: 'md' as const,
    visible: true,
    order: 3,
  },
];

export const fallbackStats = [
  { value: '12+', label: 'Años de experiencia' },
  { value: '300+', label: 'Eventos realizados' },
  { value: 'Lima', label: 'Cobertura y alrededores' },
  { value: 'Premium', label: 'Curaduría visual' },
];

// ——————— Services ———————

export const fallbackServices = [
  {
    title: 'Catering y Decoración',
    eyebrow: 'Experiencia integral',
    description: 'Propuesta gastronómica y ambientación coordinadas para que mesa, decoración y servicio se sientan parte de una misma celebración.',
    image: '/images/3-servicios/catering-premium.webp',
    alt: 'Mesa de catering con frutas y bocaditos para evento elegante',
    tags: ['Catering', 'Decoración', 'Montaje'],
    visible: true,
    order: 0,
  },
  {
    title: 'Wedding Planner',
    eyebrow: 'Planificación de bodas',
    description: 'Acompañamiento en la organización, coordinación de proveedores, cronograma y dirección del evento para que la pareja disfrute sin estrés.',
    image: '/images/3-servicios/bodas-personalizadas.webp',
    alt: 'Novia sosteniendo un ramo de flores en una boda personalizada',
    tags: ['Planificación', 'Coordinación', 'Bodas'],
    visible: true,
    order: 1,
  },
  {
    title: 'Destination Wedding',
    eyebrow: 'Bodas de destino',
    description: 'Diseño y coordinación de bodas fuera de la ciudad, integrando logística, estética y experiencia para invitados en un solo plan.',
    image: '/images/3-servicios/organizacion-eventos.webp',
    alt: 'Sillas blancas ordenadas para ceremonia al aire libre',
    tags: ['Destino', 'Logística', 'Experiencia'],
    visible: true,
    order: 2,
  },
];

// ——————— Catalog ———————

export const fallbackCatalogItems = [
  {
    title: 'Papelería & detalles',
    category: 'Diseño editorial',
    description: 'Papelería, menú, servilletas y detalles visuales que construyen una primera impresión elegante.',
    badge: 'Detalles',
    imageSrc: '/images/5-catalogo/1.webp',
    imageAlt: 'Papelería de evento con servilleta sobre mesa decorada',
    visible: true,
    order: 0,
  },
  {
    title: 'Montaje de salón',
    category: 'Recepciones',
    description: 'Ambientes cuidadosamente montados para que cada mesa, luz y textura se sienta parte de una misma historia.',
    badge: 'Recepción',
    imageSrc: '/images/5-catalogo/2.webp',
    imageAlt: 'Salón de evento con mesas decoradas',
    visible: true,
    order: 1,
  },
  {
    title: 'Mesas principales',
    category: 'Estilismo de mesa',
    description: 'Composición de mesas, flores, vajilla y acentos decorativos para una experiencia visual memorable.',
    badge: 'Mesa',
    imageSrc: '/images/5-catalogo/3.webp',
    imageAlt: 'Mesa decorada con flores y vajilla para evento',
    visible: true,
    order: 2,
  },
  {
    title: 'Ambientación exterior',
    category: 'Espacios al aire libre',
    description: 'Montajes cálidos y naturales para celebraciones con luz, aire libre y una atmósfera sofisticada.',
    badge: 'Outdoor',
    imageSrc: '/images/5-catalogo/4.webp',
    imageAlt: 'Ambientación exterior con mesas altas y decoración floral',
    visible: true,
    order: 3,
  },
  {
    title: 'Bodas personalizadas',
    category: 'Experiencias a medida',
    description: 'Bodas diseñadas alrededor de la historia de cada pareja, con estética, logística y detalle.',
    badge: 'Bodas',
    imageSrc: '/images/5-catalogo/1.webp',
    imageAlt: 'Ambientación de boda personalizada',
    visible: true,
    order: 4,
  },
  {
    title: 'Catering premium',
    category: 'Gastronomía',
    description: 'Presentación y servicio gastronómico pensados para acompañar el tono de la celebración.',
    badge: 'Catering',
    imageSrc: '/images/5-catalogo/2.webp',
    imageAlt: 'Mesa de catering premium',
    visible: true,
    order: 5,
  },
];

// ——————— Testimonials ———————

export const fallbackTestimonials = [
  {
    names: 'Gabriela & Nigel',
    event: 'Aniversario de bodas',
    quote: 'Karin superó nuestras expectativas. Nos acompañó con una visión muy cuidada, resolvió cada detalle y logró que nuestra celebración se sintiera elegante, cálida y completamente nuestra.',
    image: '/images/4-testimonios/gabriela-y-nigel.webp',
    rating: 5,
    visible: true,
    order: 0,
  },
  {
    names: 'Jessica & Ayrton',
    event: 'Boda personalizada',
    quote: 'No queríamos dejar de agradecer la increíble gestión que tuvieron para nuestro evento. Nos sentimos acompañados en todo momento y el resultado fue mucho más hermoso de lo que imaginamos.',
    image: '/images/4-testimonios/jessica-y-ayrton.webp',
    rating: 5,
    visible: true,
    order: 1,
  },
  {
    names: 'Andrea & Sebastián',
    event: 'Organización integral',
    quote: 'Cada proveedor, cada horario y cada detalle estuvo perfectamente coordinado. Pudimos disfrutar el evento sin estar pendientes de resolver nada.',
    rating: 5,
    visible: true,
    order: 2,
  },
  {
    names: 'María Fernanda',
    event: 'Celebración íntima',
    quote: 'Me encantó la tranquilidad de saber que todo estaba bajo control. La coordinación fue ordenada, puntual y con muchísimo criterio estético.',
    rating: 5,
    visible: true,
    order: 3,
  },
  {
    names: 'Camila & Rodrigo',
    event: 'Decoración y ambientación',
    quote: 'Cada espacio quedó impecable. La decoración tenía coherencia, personalidad y una sensibilidad especial. Nuestros invitados quedaron encantados.',
    rating: 5,
    visible: true,
    order: 4,
  },
];

// ——————— Contact ———————

export const fallbackEventTypes = [
  'Catering y Decoración',
  'Wedding Planner',
  'Destination Wedding',
  'Otro',
];

// ——————— Footer ———————

export const fallbackNavigationLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Beneficios', href: '#beneficios' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Catálogo', href: '#catalogo' },
  { label: 'Testimonios', href: '#testimonios' },
  { label: 'Contacto', href: '#contacto' },
];

export const fallbackServiceLinks = [
  'Catering y Decoración',
  'Wedding Planner',
  'Destination Wedding',
];
