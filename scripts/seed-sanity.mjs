#!/usr/bin/env node

/**
 * Seed inicial para Karin Eventos & Experiencias.
 *
 * Uso:
 *   npm run seed:sanity         -> crea documentos singleton solo si no existen.
 *   npm run seed:sanity:force   -> reemplaza los documentos singleton con la data base del proyecto.
 *
 * Requiere un token con permisos de escritura:
 *   SANITY_API_WRITE_TOKEN=...
 */

import {createClient} from '@sanity/client';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const cwd = process.cwd();
const force = process.argv.includes('--force') || process.argv.includes('--reset');

function loadEnvFile(fileName) {
  const filePath = path.join(cwd, fileName);
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || !line.includes('=')) continue;

    const index = line.indexOf('=');
    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile('.env.local');
loadEnvFile('.env');

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01';
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;

if (!projectId) {
  console.error('❌ Falta NEXT_PUBLIC_SANITY_PROJECT_ID en .env.local');
  process.exit(1);
}

if (!token) {
  console.error('❌ Falta SANITY_API_WRITE_TOKEN en .env.local');
  console.error('Crea un token con permisos de escritura en Sanity Manage > API > Tokens.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const imageCache = new Map();

function fileExists(relativePath) {
  const filePath = path.join(cwd, relativePath);
  return fs.existsSync(filePath) ? filePath : null;
}

async function uploadImage(relativePath) {
  const absolutePath = fileExists(relativePath);
  if (!absolutePath) {
    console.warn(`⚠️  No encontré imagen local: ${relativePath}`);
    return undefined;
  }

  if (imageCache.has(absolutePath)) return imageCache.get(absolutePath);

  const filename = path.basename(absolutePath);
  const asset = await client.assets.upload('image', fs.createReadStream(absolutePath), {filename});
  const image = {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: asset._id,
    },
  };

  imageCache.set(absolutePath, image);
  return image;
}

function removeUndefined(value) {
  if (Array.isArray(value)) return value.map(removeUndefined).filter((item) => item !== undefined);
  if (value && typeof value === 'object') {
    const clean = {};
    for (const [key, val] of Object.entries(value)) {
      const cleaned = removeUndefined(val);
      if (cleaned !== undefined) clean[key] = cleaned;
    }
    return clean;
  }
  return value === undefined ? undefined : value;
}

async function upsertSingleton(doc) {
  const cleanDoc = removeUndefined(doc);

  if (force) {
    await client.createOrReplace(cleanDoc);
    console.log(`✅ Reemplazado: ${doc._id}`);
    return;
  }

  const exists = await client.fetch('defined(*[_id == $id][0]._id)', {id: doc._id});
  if (exists) {
    console.log(`↪️  Ya existe, no se tocó: ${doc._id}`);
    return;
  }

  await client.createIfNotExists(cleanDoc);
  console.log(`✅ Creado: ${doc._id}`);
}

async function buildDocuments() {
  const logo = await uploadImage('public/images/_logo/logo2.png');
  const logoFooter = await uploadImage('public/images/_logo/logo2.png');
  const heroBg = await uploadImage('public/images/_miscelanea/velas.jpg');
  const benefitsBg = await uploadImage('public/images/2-beneficios/img-beneficios.png');
  const servicesBg = await uploadImage('public/images/_miscelanea/velas.jpg');
  const catalogBg = await uploadImage('public/images/_miscelanea/morada.jpg');
  const testimonialsBg = await uploadImage('public/images/_miscelanea/velas.jpg');
  const contactBg = await uploadImage('public/images/_miscelanea/velas.jpg');

  const servicesImages = {
    catering: await uploadImage('public/images/3-servicios/catering-premium.png'),
    bodas: await uploadImage('public/images/3-servicios/bodas-personalizadas.png'),
    organizacion: await uploadImage('public/images/3-servicios/organizacion-eventos.png'),
    decoracion: await uploadImage('public/images/3-servicios/decoracion-y-ambientacion.png'),
  };

  const catalogImages = [
    await uploadImage('public/images/5-catalogo/1.png'),
    await uploadImage('public/images/5-catalogo/2.png'),
    await uploadImage('public/images/5-catalogo/3.png'),
    await uploadImage('public/images/5-catalogo/4.png'),
  ];

  const testimonialImages = {
    gabriela: await uploadImage('public/images/4-testimonios/gabriela-y-nigel.png'),
    jessica: await uploadImage('public/images/4-testimonios/jessica-y-ayrton.png'),
  };

  const navLinks = [
    {label: 'Inicio', href: '#inicio', enabled: true, order: 0},
    {label: 'Beneficios', href: '#beneficios', enabled: true, order: 1},
    {label: 'Servicios', href: '#servicios', enabled: true, order: 2},
    {label: 'Catálogo', href: '#catalogo', enabled: true, order: 3},
    {label: 'Testimonios', href: '#testimonios', enabled: true, order: 4},
    {label: 'Contacto', href: '#contacto', enabled: true, order: 5},
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/',
      icon: 'instagram',
      borderColor: '#d2ab80',
      visible: true,
      order: 0,
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/',
      icon: 'facebook',
      borderColor: '#b3b792',
      visible: true,
      order: 1,
    },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/51999999999',
      icon: 'message-circle',
      borderColor: '#809671',
      visible: true,
      order: 2,
    },
  ];

  return [
    {
      _id: 'siteSettings',
      _type: 'siteSettings',
      logo,
      companyName: 'Karin',
      companySubtitle: 'Eventos & experiencias',
      whatsapp: '51999999999',
      email: 'hola@karineventos.com',
      phone: '+51 999 999 999',
      location: 'Lima, Perú',
      schedule: 'Atención previa coordinación',
      socialLinks,
      legalText: '© Karin Eventos. Todos los derechos reservados.',
      madeWithText: 'Hecho con',
      seo: {
        title: 'Karin Eventos & Experiencias',
        description: 'Diseño, planificación y ambientación de eventos con una mirada cálida, elegante y profundamente cuidada.',
        ogImage: heroBg,
      },
    },
    {
      _id: 'navbarSettings',
      _type: 'navbarSettings',
      links: navLinks,
      whatsappCta: {
        label: 'WhatsApp',
        mobileLabelLong: 'Cotizar por WhatsApp',
        url: 'https://wa.me/51999999999',
      },
      colorMode: 'neutral',
      sectionThemes: [
        {sectionId: 'inicio', theme: 'dark'},
        {sectionId: 'beneficios', theme: 'light'},
        {sectionId: 'servicios', theme: 'dark'},
        {sectionId: 'catalogo', theme: 'dark'},
        {sectionId: 'testimonios', theme: 'light'},
        {sectionId: 'contacto', theme: 'light'},
        {sectionId: 'footer', theme: 'botanical'},
      ],
    },
    {
      _id: 'heroSection',
      _type: 'heroSection',
      visible: true,
      backgroundImage: heroBg,
      backgroundAlt: 'Evento elegante decorado por Karin Cadenas Eventos',
      overlay: 'dark-cinematic',
      eyebrow: 'Wedding planner en Lima',
      titleLine1: 'Eventos',
      titleLine2: 'con estilo',
      titleLine3: 'y calidez',
      highlightWord: 'estilo',
      flipWords: ['bodas', 'quinceañeros', 'eventos corporativos', 'celebraciones íntimas'],
      subtitle: 'Creamos celebraciones personalizadas con detalles sofisticados y coordinación impecable.',
      ctaPrimary: {label: 'Cotiza ahora', href: 'https://wa.me/51999999999'},
      ctaSecondary: {label: 'Ver portafolio', href: '#catalogo'},
      featureCards: [
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
      ],
      floatingNotes: [
        {text: 'Dirección floral', icon: 'flower2', visible: true},
        {text: 'Coordinación completa', icon: 'calendar-heart', visible: true},
      ],
    },
    {
      _id: 'benefitsSection',
      _type: 'benefitsSection',
      visible: true,
      backgroundImage: benefitsBg,
      backgroundAlt: 'Decoración elegante para eventos con detalles florales',
      overlay: 'editorial-almond',
      theme: 'light',
      eyebrow: 'Excelencia garantizada',
      title: 'Tu tranquilidad es nuestro',
      highlightWord: 'mayor lujo.',
      description: 'Elevamos cada aspecto de tu celebración mediante un estándar de servicio impecable, una coordinación precisa y una mirada editorial única.',
      cards: [
        {
          icon: 'clipboard-list',
          eyebrow: 'Planificación integral',
          title: 'Organización detallada',
          description: 'Cronograma maestro, gestión de proveedores y seguimiento claro para que cada etapa avance sin fricciones.',
          size: 'lg',
          visible: true,
          order: 0,
        },
        {
          icon: 'utensils',
          eyebrow: 'Experiencia gastronómica',
          title: 'Catering premium',
          description: 'Propuestas cuidadas para que la mesa también sea parte de la experiencia.',
          size: 'sm',
          visible: true,
          order: 1,
        },
        {
          icon: 'crown',
          eyebrow: 'Curaduría',
          title: 'Exclusividad',
          description: 'Selección de locaciones, detalles y proveedores alineados con tu estilo.',
          size: 'sm',
          visible: true,
          order: 2,
        },
        {
          icon: 'heart-handshake',
          eyebrow: 'Acompañamiento',
          title: 'Atención 1 a 1',
          description: 'Escuchamos tu visión, ordenamos las ideas y acompañamos cada decisión importante.',
          size: 'md',
          visible: true,
          order: 3,
        },
      ],
      stats: [
        {value: '12+', label: 'Años de experiencia', visible: true, order: 0},
        {value: '300+', label: 'Eventos realizados', visible: true, order: 1},
        {value: 'Lima', label: 'Cobertura y alrededores', visible: true, order: 2},
        {value: 'Premium', label: 'Curaduría visual', visible: true, order: 3},
      ],
    },
    {
      _id: 'servicesSection',
      _type: 'servicesSection',
      visible: true,
      backgroundImage: servicesBg,
      backgroundAlt: 'Ambiente elegante con velas para eventos',
      overlay: 'dark-cinematic',
      eyebrow: 'Servicios Karin',
      title: 'Nuestros',
      highlightWord: 'Servicios',
      leadCard: {
        text: 'Una experiencia integral para eventos con carácter, estética cuidada y ejecución sin fricciones.',
        icon: 'calendar-check',
        visible: true,
      },
      footerCard: {
        text: 'Catering, bodas, organización y ambientación trabajando como una sola experiencia.',
        icon: 'flower2',
        visible: true,
      },
      services: [
        {
          title: 'Catering Premium',
          eyebrow: 'Alta gastronomía',
          description: 'Menús diseñados para elevar la experiencia de tus invitados, con presentación cuidada y coordinación impecable.',
          tags: ['Menú personalizado', 'Presentación editorial'],
          image: servicesImages.catering,
          imageAlt: 'Mesa de catering con frutas y bocaditos para evento elegante',
          icon: 'utensils',
          visible: true,
          order: 0,
        },
        {
          title: 'Bodas Personalizadas',
          eyebrow: 'Celebraciones únicas',
          description: 'Diseñamos bodas con una narrativa visual propia, cuidando cada decisión estética desde el concepto hasta el último detalle.',
          tags: ['Concepto visual', 'Detalle emocional'],
          image: servicesImages.bodas,
          imageAlt: 'Novia sosteniendo un ramo de flores en una boda personalizada',
          icon: 'heart',
          visible: true,
          order: 1,
        },
        {
          title: 'Organización de Eventos',
          eyebrow: 'Planificación integral',
          description: 'Creamos cronogramas, gestionamos proveedores y acompañamos todo el proceso para que tú solo vivas el momento.',
          tags: ['Cronograma maestro', 'Gestión de proveedores'],
          image: servicesImages.organizacion,
          imageAlt: 'Sillas blancas ordenadas para ceremonia al aire libre',
          icon: 'calendar-check',
          visible: true,
          order: 2,
        },
        {
          title: 'Decoración y Ambientación',
          eyebrow: 'Atmósferas memorables',
          description: 'Transformamos espacios con flores, mobiliario, color, iluminación y composición para lograr una puesta en escena premium.',
          tags: ['Diseño floral', 'Styling del espacio'],
          image: servicesImages.decoracion,
          imageAlt: 'Decoración floral y ambientación elegante en ceremonia exterior',
          icon: 'flower2',
          visible: true,
          order: 3,
        },
      ],
    },
    {
      _id: 'catalogSection',
      _type: 'catalogSection',
      visible: true,
      backgroundImage: catalogBg,
      backgroundAlt: 'Fondo floral oscuro para catálogo visual',
      overlay: 'carob-premium',
      eyebrow: 'Catálogo visual',
      title: 'Un archivo visual de',
      highlightWord: 'momentos y detalles.',
      supportText: 'Explora montajes, texturas, mesas, ambientes y piezas visuales. Puedes reemplazar estos elementos por videos desde el panel.',
      items: [
        {
          title: 'Papelería & detalles',
          category: 'Diseño editorial',
          description: 'Papelería, menú, servilletas y detalles visuales que construyen una primera impresión elegante.',
          badge: 'Detalles',
          thumbnail: catalogImages[0],
          thumbnailAlt: 'Papelería de evento con servilleta sobre mesa decorada',
          visible: true,
          featured: false,
          order: 0,
        },
        {
          title: 'Montaje de salón',
          category: 'Recepciones',
          description: 'Ambientes cuidadosamente montados para que cada mesa, luz y textura se sienta parte de una misma historia.',
          badge: 'Recepción',
          thumbnail: catalogImages[1],
          thumbnailAlt: 'Salón de evento con mesas decoradas',
          visible: true,
          featured: true,
          order: 1,
        },
        {
          title: 'Mesas principales',
          category: 'Estilismo de mesa',
          description: 'Composición de mesas, flores, vajilla y acentos decorativos para una experiencia visual memorable.',
          badge: 'Mesa',
          thumbnail: catalogImages[2],
          thumbnailAlt: 'Mesa decorada con flores y vajilla para evento',
          visible: true,
          featured: false,
          order: 2,
        },
        {
          title: 'Ambientación exterior',
          category: 'Espacios al aire libre',
          description: 'Montajes cálidos y naturales para celebraciones con luz, aire libre y una atmósfera sofisticada.',
          badge: 'Outdoor',
          thumbnail: catalogImages[3],
          thumbnailAlt: 'Ambientación exterior con mesas altas y decoración floral',
          visible: true,
          featured: false,
          order: 3,
        },
        {
          title: 'Bodas personalizadas',
          category: 'Experiencias a medida',
          description: 'Bodas diseñadas alrededor de la historia de cada pareja, con estética, logística y detalle.',
          badge: 'Bodas',
          thumbnail: catalogImages[0],
          thumbnailAlt: 'Ambientación de boda personalizada',
          visible: true,
          featured: false,
          order: 4,
        },
        {
          title: 'Catering premium',
          category: 'Gastronomía',
          description: 'Presentación y servicio gastronómico pensados para acompañar el tono de la celebración.',
          badge: 'Catering',
          thumbnail: catalogImages[1],
          thumbnailAlt: 'Mesa de catering premium',
          visible: true,
          featured: false,
          order: 5,
        },
      ],
    },
    {
      _id: 'testimonialsSection',
      _type: 'testimonialsSection',
      visible: true,
      backgroundImage: testimonialsBg,
      backgroundAlt: 'Fondo cálido con velas para testimonios',
      overlay: 'warm-light',
      eyebrow: 'Historias reales',
      title: 'Celebraciones que',
      highlightWord: 'se recuerdan.',
      storyPanelLabel: 'Ahora en pantalla',
      testimonials: [
        {
          names: 'Gabriela & Nigel',
          event: 'Aniversario de bodas',
          quote: 'Karin superó nuestras expectativas. Nos acompañó con una visión muy cuidada, resolvió cada detalle y logró que nuestra celebración se sintiera elegante, cálida y completamente nuestra.',
          photo: testimonialImages.gabriela,
          rating: 5,
          visible: true,
          order: 0,
        },
        {
          names: 'Jessica & Ayrton',
          event: 'Boda personalizada',
          quote: 'No queríamos dejar de agradecer la increíble gestión que tuvieron para nuestro evento. Nos sentimos acompañados en todo momento y el resultado fue mucho más hermoso de lo que imaginamos.',
          photo: testimonialImages.jessica,
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
      ],
    },
    {
      _id: 'contactSection',
      _type: 'contactSection',
      visible: true,
      backgroundImage: contactBg,
      backgroundAlt: 'Fondo elegante para contacto de eventos',
      overlay: 'editorial-almond',
      eyebrow: 'Conversemos sobre tu evento',
      title: 'Cuéntanos qué estás imaginando.',
      highlightWord: ' Karin se encarga de cuidar los detalles.',
      description: 'Déjanos una breve idea de la celebración. Al continuar, se abrirá tu app de correo con el mensaje listo para enviar.',
      contactCards: [
        {
          type: 'whatsapp',
          label: 'WhatsApp',
          value: 'Respuesta rápida',
          icon: 'message-circle',
          link: 'https://wa.me/51999999999',
          visible: true,
        },
        {
          type: 'email',
          label: 'Correo',
          value: 'hola@karineventos.com',
          icon: 'mail',
          link: 'mailto:hola@karineventos.com',
          visible: true,
        },
      ],
      form: {
        title: 'Formulario de contacto',
        description: 'Completa la información y prepararemos el correo automáticamente.',
        submitLabel: 'Preparar correo',
        eventTypes: [
          {label: 'Catering Premium', visible: true, order: 0},
          {label: 'Bodas Personalizadas', visible: true, order: 1},
          {label: 'Organización de Eventos', visible: true, order: 2},
          {label: 'Decoración y Ambientación', visible: true, order: 3},
        ],
        includeOtherOption: true,
      },
    },
    {
      _id: 'footerSection',
      _type: 'footerSection',
      backgroundImage: undefined,
      backgroundAlt: '',
      overlay: 'botanical-dark',
      ctaEyebrow: 'Hagamos que tu celebración se sienta inolvidable',
      ctaTitle: 'Cada detalle puede contar una historia.',
      ctaHighlightWord: ' Empecemos por la tuya.',
      ctaButtonLabel: 'Escribir por WhatsApp',
      ctaButtonLink: 'https://wa.me/51999999999',
      logo: logoFooter,
      brandText: 'Diseño, planificación y ambientación de eventos con una mirada cálida, elegante y profundamente cuidada.',
      navigationColumns: [
        {
          title: 'Explorar',
          links: navLinks.map(({label, href}) => ({label, href})),
          visible: true,
          order: 0,
        },
      ],
      serviceLinks: [
        {text: 'Bodas personalizadas', link: '#servicios', visible: true},
        {text: 'Catering premium', link: '#servicios', visible: true},
        {text: 'Decoración floral', link: '#servicios', visible: true},
        {text: 'Organización integral', link: '#servicios', visible: true},
      ],
      contactInfo: {
        phone: '+51 999 999 999',
        email: 'hola@karineventos.com',
        location: 'Lima, Perú',
        schedule: 'Atención previa coordinación',
      },
      socialLinks,
    },
  ];
}

async function main() {
  console.log(`\n🌱 Seed Sanity — Karin Eventos`);
  console.log(`Proyecto: ${projectId}`);
  console.log(`Dataset: ${dataset}`);
  console.log(`Modo: ${force ? 'FORCE / reemplazar documentos' : 'SAFE / crear solo si faltan'}\n`);

  const docs = await buildDocuments();

  for (const doc of docs) {
    await upsertSingleton(doc);
  }

  console.log('\n✅ Seed terminado.');
  console.log('Abre /studio y revisa cada sección. Luego puedes editar desde Sanity sin perder los defaults.\n');
}

main().catch((error) => {
  console.error('\n❌ Error ejecutando seed:');
  console.error(error);
  process.exit(1);
});
