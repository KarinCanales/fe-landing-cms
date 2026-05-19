import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';
const token = process.env.SANITY_API_READ_TOKEN || '';

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  /**
   * Importante para edición:
   * Dejamos el CDN apagado para que los cambios publicados en Sanity se vean
   * inmediatamente en la web, tanto en desarrollo como en build/start local.
   *
   * Cuando el sitio ya esté terminado y desplegado, si quieres más caché, se
   * puede volver a activar con una estrategia de revalidación/webhook.
   */
  useCdn: false,
  token: token || undefined,
  perspective: 'published',
});

export const isSanityConfigured = Boolean(projectId);
