# Revalidación de Sanity en Next.js

Este proyecto usa ISR para que la home no consulte Sanity en cada visita. Por eso, si publicas cambios en Sanity y no existe una revalidación on-demand, Next puede seguir mostrando HTML/datos anteriores hasta que expire el intervalo de caché.

## Qué incluye el proyecto

- `src/app/api/revalidate/route.ts`: endpoint protegido para invalidar la home y los tags cuando Sanity publica cambios.
- `src/sanity/fetch.ts`: cada consulta de Sanity usa tags de caché (`sanity`, `catalogSection`, `siteSettings`, etc.).
- `src/app/page.tsx`: ISR corto de respaldo para que el contenido no quede viejo si el webhook falla.
- `.env.example`: documenta las variables necesarias.

## Variables

En Vercel, la única variable nueva obligatoria para el webhook es:

```env
SANITY_REVALIDATE_SECRET=un-texto-largo-seguro
```

Variables opcionales:

```env
SANITY_REVALIDATE_SECONDS=60
SANITY_DISABLE_CACHE=false
```

En local, si estás probando con `npm run build && npm run start` y quieres que los cambios publicados se vean sin esperar ISR, puedes usar:

```env
SANITY_DISABLE_CACHE=true
```

No uses `SANITY_DISABLE_CACHE=true` en producción salvo que aceptes que la home consulte Sanity en cada request.

## Webhook en Sanity

Crea un webhook en:

```txt
Sanity Manage → Project → API → Webhooks
```

URL:

```txt
https://TU-DOMINIO.com/api/revalidate?secret=TU_SANITY_REVALIDATE_SECRET
```

Método:

```txt
POST
```

Dataset:

```txt
production
```

Trigger on:

```txt
Create, Update, Delete
```

Filter:

```groq
!(_id in path("drafts.**"))
```

Projection:

```groq
{
  "_type": _type,
  "_id": _id
}
```

Deja vacío el campo `Secret` de Sanity si el endpoint está validando el secreto por query param.

## Prueba manual

Después de desplegar y configurar `SANITY_REVALIDATE_SECRET`, abre esta URL cambiando el secreto:

```txt
https://TU-DOMINIO.com/api/revalidate?secret=TU_SANITY_REVALIDATE_SECRET
```

Debe responder algo como:

```json
{
  "revalidated": true,
  "path": "/",
  "tag": "sanity"
}
```

Luego publica un cambio en Sanity y revisa el historial del webhook. Una respuesta `200` indica que Next recibió la revalidación.
