# Karin Eventos — Integración Sanity CMS

## Cambios realizados

### 1. Sanity CMS — Infraestructura completa

- `src/sanity/client.ts` — Cliente Sanity configurado con variables de entorno
- `src/sanity/image.ts` — Builder de URLs para imágenes y archivos (videos)
- `src/sanity/icons.ts` — Resolvedor de iconos: mapea nombres de Sanity a componentes lucide-react
- `src/sanity/queries.ts` — Queries GROQ organizadas por sección
- `src/sanity/types.ts` — Tipos TypeScript para todos los datos de Sanity
- `src/sanity/fetch.ts` — Función de fetching paralelo con fallback a null

### 2. Schemas de Sanity (9 documentos)

- `siteSettings` — Logo, nombre, contacto, redes sociales, SEO
- `navbarSettings` — Links, CTA WhatsApp, modo de color (neutral/adaptive)
- `heroSection` — Imagen de fondo, título, palabras rotativas, cards, mini cards
- `benefitsSection` — Cards de beneficios, stats, eyebrow, título
- `servicesSection` — Lista dinámica de servicios, lead card, footer card
- `catalogSection` — Elementos con soporte de video, badges, orden
- `testimonialsSection` — Testimonios con foto, rating, visibilidad
- `contactSection` — Tipos de evento editables con opción "Otro"
- `footerSection` — CTA, columnas de navegación, redes con color de borde

### 3. Navbar — Armonía visual

- **Color neutro**: Taupe/carob translúcido que funciona sobre secciones claras y oscuras
- **Modo adaptivo** (opcional desde Sanity): Cambia color suavemente según sección visible
- **"Beneficios"** agregado al navbar
- **WhatsApp** armonizado: Cambiado de verde matcha a chai/vanilla cálido
- **Sin scroll-snap ni scroll automático**

### 4. Componentes modificados

Todos aceptan `sanityData` como prop y usan fallback local si Sanity está vacío:
- `HeroSection` — Títulos, flipWords, cards, CTAs editables
- `BenefitsSection` — Cards, stats, eyebrow, título editables
- `ServiceSection` — Servicios dinámicos (agregar/eliminar/ocultar)
- `TestimonialsSection` — Testimonios dinámicos, flechas ocultas si solo hay 1
- `CatalogSection` — Items con video, thumbnails, modal responsivo
- `ContactSection` — Tipos de evento editables con "Otro"
- `FooterSection` — CTA, redes sociales con color de borde por icono

### 5. Fallback data

`src/data/fallbacks.ts` — Datos locales idénticos al diseño original, usados cuando Sanity está vacío.

---

## Configuración

### Paso 1: Variables de entorno

Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tu proyecto de Sanity:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=tu_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

### Paso 2: Instalar dependencias

```bash
npm install
```

Se agregaron estas dependencias:
- `@sanity/client` — Cliente oficial de Sanity
- `@sanity/image-url` — Builder de URLs para imágenes

### Paso 3: Configurar Sanity Studio

1. Crea un proyecto Sanity en [sanity.io](https://www.sanity.io/)
2. Instala Sanity Studio como proyecto separado:

```bash
npm create sanity@latest -- --template clean
```

3. Copia la carpeta `src/sanity/schemas/` a tu proyecto Sanity Studio
4. Configura `sanity.config.ts` según el ejemplo en `sanity.config.example.ts`

### Paso 4: Cargar datos iniciales

En Sanity Studio, crea un documento de cada tipo (singleton):
- Configuración del sitio
- Navbar
- Hero, Beneficios, Servicios, Catálogo, Testimonios, Contacto, Footer

**La web funciona sin datos en Sanity** — usa los fallbacks locales.

---

## Estructura de archivos

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx          ← fetch de Sanity + pasa datos a componentes
├── components/
│   ├── NavbarSection.tsx  ← navbar neutral/adaptivo + Sanity
│   ├── HeroSection.tsx
│   ├── BenefitsSection.tsx
│   ├── ServiceSection.tsx
│   ├── TestimonialsSection.tsx
│   ├── CatalogSection.tsx
│   ├── ContactSection.tsx
│   ├── FooterSection.tsx
│   ├── ImageAsset.tsx
│   └── *.module.css
├── data/
│   └── fallbacks.ts       ← datos locales de respaldo
├── lib/
│   └── types.ts
└── sanity/
    ├── client.ts           ← conexión a Sanity
    ├── fetch.ts            ← fetching paralelo con fallback
    ├── icons.ts            ← iconMap lucide-react
    ├── image.ts            ← URL builder para imágenes/videos
    ├── queries.ts          ← GROQ queries por sección
    ├── types.ts            ← tipos TypeScript
    └── schemas/
        ├── index.ts
        ├── shared.ts
        ├── siteSettings.ts
        ├── navbarSettings.ts
        ├── heroSection.ts
        ├── benefitsSection.ts
        ├── servicesSection.ts
        ├── catalogSection.ts
        ├── testimonialsSection.ts
        ├── contactSection.ts
        └── footerSection.ts
```
