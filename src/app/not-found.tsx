import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página no encontrada | Karin Cadenas Bodas & Eventos",
  description:
    "La página solicitada no existe. Vuelve al inicio o navega a servicios y contacto.",
};

export default function NotFound() {
  return (
    <main className="notFoundPage" id="contenido-principal">
      <section className="notFoundShell" aria-labelledby="not-found-title">
        <span className="notFoundEyebrow">404</span>
        <h1 id="not-found-title">Esta página no existe</h1>
        <p>
          El enlace puede haber cambiado o estar incompleto. Puedes volver al
          inicio, revisar los servicios o escribirnos para cotizar tu evento.
        </p>
        <div className="notFoundActions">
          <Link href="/">Ir al inicio</Link>
          <Link href="/#servicios">Ver servicios</Link>
          <Link href="/#contacto">Contacto</Link>
        </div>
      </section>
    </main>
  );
}
