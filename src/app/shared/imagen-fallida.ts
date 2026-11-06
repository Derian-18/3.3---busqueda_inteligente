/**
 * Si una imagen (por ejemplo una URL externa) no carga, la reemplaza por un
 * recuadro neutro en lugar de mostrar el icono de imagen rota.
 * Uso en plantillas: <img (error)="reemplazarImagenRota($event)" />
 */
export function reemplazarImagenRota(evento: Event): void {
  const img = evento.target as HTMLImageElement;
  img.onerror = null; // evita bucles si el placeholder también fallara
  img.src =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750">' +
        '<rect width="600" height="750" fill="#ece8e1"/>' +
        '<text x="300" y="380" font-family="sans-serif" font-size="28" fill="#9a948a" text-anchor="middle">Sin imagen</text>' +
        '</svg>',
    );
}
