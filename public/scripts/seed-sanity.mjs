#!/usr/bin/env node

/**
 * Seed inicial para KARIN CADENAS BODAS & EVENTOS.
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
  const logo = await uploadImage('public/images/_logo/logo2.webp');
  const heroBg = await uploadImage('public/images/_miscelanea/velas.webp');
  const benefitsBg = await uploadImage('public/images/2-beneficios/img-beneficios.webp');
  const servicesBg = await uploadImage('public/images/_miscelanea/velas.webp');
  const catalogBg = await uploadImage('public/images/_miscelanea/morada.webp');
  const testimonialsBg = await uploadImage('public/images/_miscelanea/velas.webp');
  const contactBg = await uploadImage('public/images/_miscelanea/velas.webp');

  const servicesImages = {
    catering: await uploadImage('public/images/3-servicios/catering-premium.webp'),
    bodas: await uploadImage('public/images/3-servicios/bodas-personalizadas.webp'),
    organizacion: await uploadImage('public/images/3-servicios/organizacion-eventos.webp'),
    decoracion: await uploadImage('public/images/3-servicios/decoracion-y-ambientacion.webp'),
  };

  const catalogImages = [
    await uploadImage('public/images/5-catalogo/1.webp'),
    await uploadImage('public/images/5-catalogo/2.webp'),
    await uploadImage('public/images/5-catalogo/3.webp'),
    await uploadImage('public/images/5-catalogo/4.webp'),
  ];

  const testimonialImages = {
    gabriela: await uploadImage('public/images/4-testimonios/gabriela-y-nigel.webp'),
    jessica: await uploadImage('public/images/4-testimonios/jessica-y-ayrton.webp'),
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
      url: 'https://www.instagram.com/karincadenaseventos/',
      icon: 'instagram',
      borderColor: '#d2ab80',
      visible: true,
      order: 0,
    },
  ];

  return [
    {
      _id: 'siteSettings',
      _type: 'siteSettings',
      logo,
      companyName: 'KARIN CADENAS BODAS & EVENTOS',
      companySubtitle: 'Bodas & Eventos',
      whatsapp: '51922459810',
      email: 'karin@karincadenaseventos.com',
      quoteEmail: 'presupuestos@karincadenaseventos.com',
      phone: '+51 922 459 810',
      location: 'Lima, Perú',
      schedule: 'Lunes a viernes 9am a 7pm. Sábados previa coordinación.',
      domain: 'https://www.karincadenaseventos.com',
      purchaseNote: 'Pendiente dato de compra',
      socialLinks,
      legalText: '© KARIN CADENAS BODAS & EVENTOS. Todos los derechos reservados.',
      madeWithText: 'Hecho con amor y cariño 🤎 para celebraciones memorables.',
      seo: {
        title: 'KARIN CADENAS BODAS & EVENTOS',
        description: 'Catering y decoración, wedding planner y destination wedding para celebraciones cuidadas de principio a fin.',
        ogImage: heroBg,
      },
    },
    {
      _id: 'navbarSettings',
      _type: 'navbarSettings',
      colorMode: 'adaptive',
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
      eyebrow: 'Bodas & eventos',
      titleLine1: 'Bodas y eventos',
      titleLine2: '',
      titleLine3: '',
      highlightWord: 'con estilo y calidez',
      flipWords: ['catering y decoración', 'wedding planner', 'destination wedding'],
      subtitle: 'Creamos celebraciones personalizadas con catering, decoración y planificación impecable para que cada detalle fluya con elegancia.',
      ctaPrimary: {label: 'Cotiza ahora', href: '#contacto'},
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
      eyebrow: 'Servicios Karin Cadenas',
      title: 'Nuestros',
      highlightWord: 'Servicios',
      leadCard: {
        text: 'Catering, decoración, planificación y bodas de destino con una misma dirección estética y logística.',
        icon: 'calendar-check',
        visible: true,
      },
      footerCard: {
        text: 'Catering y decoración, wedding planner y destination wedding trabajando como una sola experiencia.',
        icon: 'flower2',
        visible: true,
      },
      services: [
        {
          title: 'Catering y Decoración',
          eyebrow: 'Experiencia integral',
          description: 'Propuesta gastronómica y ambientación coordinadas para que mesa, decoración y servicio se sientan parte de una misma celebración.',
          tags: ['Catering', 'Decoración', 'Montaje'],
          image: servicesImages.catering,
          imageAlt: 'Mesa de catering con presentación elegante para evento',
          icon: 'utensils',
          visible: true,
          order: 0,
        },
        {
          title: 'Wedding Planner',
          eyebrow: 'Planificación de bodas',
          description: 'Acompañamiento en la organización, coordinación de proveedores, cronograma y dirección del evento para que la pareja disfrute sin estrés.',
          tags: ['Planificación', 'Coordinación', 'Bodas'],
          image: servicesImages.bodas,
          imageAlt: 'Novia sosteniendo un ramo de flores en una boda personalizada',
          icon: 'heart',
          visible: true,
          order: 1,
        },
        {
          title: 'Destination Wedding',
          eyebrow: 'Bodas de destino',
          description: 'Diseño y coordinación de bodas fuera de la ciudad, integrando logística, estética y experiencia para invitados en un solo plan.',
          tags: ['Destino', 'Logística', 'Experiencia'],
          image: servicesImages.organizacion,
          imageAlt: 'Ceremonia al aire libre preparada para boda de destino',
          icon: 'map-pin',
          visible: true,
          order: 2,
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
      description: 'Déjanos una breve idea de la celebración. Al continuar, se abrirá tu app de correo con la solicitud lista para enviar al área de cotizaciones.',
      form: {
        title: 'Formulario de cotización',
        description: 'Completa la información y prepararemos el correo automáticamente.',
        submitLabel: 'Preparar cotización',
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
      ctaButtonLabel: 'Cotiza ahora',
      brandText: 'Bodas, eventos, catering y decoración con una mirada cálida, elegante y profundamente cuidada.',
      madeWithLine: 'Hecho con amor y cariño 🤎 para celebraciones memorables.',
      backToTopLabel: 'Volver arriba',
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
