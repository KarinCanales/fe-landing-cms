# Migracion SEO

El sitio anterior usaba el mismo dominio principal, sin subdirectorios publicos relevantes.
El unico enlace especial conocido era `https://karincadenaseventos.com/#Contacto`.

| URL antigua | URL nueva | Tipo de redireccion | Motivo |
| --- | --- | --- | --- |
| https://www.karincadenaseventos.com/:path* | https://karincadenaseventos.com/:path* | Permanente | Normalizar dominio canonical sin www |
| https://karincadenaseventos.com/#Contacto | https://karincadenaseventos.com/#contacto | Alias en HTML | Los fragments no llegan al servidor, por eso no se pueden redirigir con 301 |

Notas:
- Mantener `https://karincadenaseventos.com` como unica version canonica del dominio en `NEXT_PUBLIC_SITE_URL`.
- No usar dominio temporal de Vercel como canonical.
- Si aparecen URLs antiguas con path real desde Search Console, agregarlas como redirects 301 en `next.config.ts`.
- El alias `#Contacto` debe permanecer mientras exista trafico o enlaces compartidos con ese fragment antiguo.
