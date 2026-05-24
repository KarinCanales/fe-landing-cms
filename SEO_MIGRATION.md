# Migracion SEO

Este proyecto esta preparado para una migracion SEO, pero aun faltan las URLs reales del sitio anterior.

TODO: Exportar o compartir las URLs antiguas de WordPress u otra web anterior desde Google Search Console, el sitemap antiguo o un crawler.

| URL antigua | URL nueva | Tipo de redireccion | Motivo |
| --- | --- | --- | --- |
| https://www.karincadenaseventos.com/:path* | https://karincadenaseventos.com/:path* | Permanente | Normalizar dominio canonical sin www |
| TODO: /url-antigua/ | TODO: /url-nueva | 301 | Mantener autoridad y evitar 404 durante la migracion |

Notas:
- Mantener `https://karincadenaseventos.com` como unica version canonica del dominio en `NEXT_PUBLIC_SITE_URL`.
- No usar dominio temporal de Vercel como canonical.
- Si cambian rutas antiguas importantes, agregarlas como redirects 301 en `next.config.ts`.
- Revisar en produccion las rutas con trafico organico antes de publicar la migracion final.
