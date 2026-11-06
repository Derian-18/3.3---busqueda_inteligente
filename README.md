# Nova Moda · Catálogo de ropa (Angular + RxJS)

Proyecto Angular (componentes standalone, Reactive Forms) con un `ProductSearchComponent` que busca y filtra un catálogo de 24 prendas en tiempo real.

## Cómo ejecutarlo

```bash
npm install
npm start          # abre http://localhost:4200
npm test           # pruebas unitarias (Vitest)
```

## Dónde está cada cosa

| Archivo | Qué contiene |
| --- | --- |
| `src/app/models/product.model.ts` | Interfaz `Product` (nombre, categoría, precio, descripción, imagen) |
| `src/app/data/products.data.ts` | Arreglo de 24 productos + **configuración de imágenes** |
| `src/app/product-search/product-search.component.ts` | Lógica RxJS (`debounceTime`, `distinctUntilChanged`, `map`, `combineLatest`) |
| `src/app/product-search/product-search.component.html` | Buscador, filtros, tarjetas, contador y mensajes |
| `src/app/product-search/product-search.component.css` | CSS Grid, animaciones hover y diseño responsive |
| `src/app/product-detail/product-detail.component.*` | Vista de detalle al seleccionar un producto: galería, tallas, colores, favorito y carrito |
| `src/app/shared/imagen-fallida.ts` | Reemplaza por un recuadro neutro las imágenes que no cargan |

## Imágenes

Por defecto usan URLs externas (`picsum.photos`), que son fotos de ejemplo aleatorias, no de ropa.

Para usar tus propias imágenes, abre `src/app/data/products.data.ts`, pon `USAR_IMAGENES_LOCALES = true` y copia tus `.jpg` en `public/assets/products/`, con el mismo nombre del slug de cada producto (por ejemplo `playera-basica-blanca.jpg`). Cada producto usa tres imágenes para la galería del detalle: `slug.jpg`, `slug-2.jpg` y `slug-3.jpg`. En Angular 18+ la carpeta `public/` reemplaza a `src/assets/`.

## Vista de detalle

Al hacer clic en una tarjeta se abre el detalle (pantalla completa en móvil, ventana centrada en escritorio). Incluye galería con miniaturas, valoración, precio, selector de talla (en calzado se puede ver en MX, US o EU), selector de color, descripción, botón de favorito y botón de carrito. Se cierra con la flecha, con `Esc` o haciendo clic fuera. Las valoraciones, colores y tallas agotadas son datos de ejemplo generados en `products.data.ts`.

## Cómo funciona el flujo RxJS

```text
busqueda.valueChanges  → debounceTime(300) → map(normalizar) → startWith('') → distinctUntilChanged ─┐
categoria.valueChanges → startWith → distinctUntilChanged ─────────────────────────────────────────────┤
precioMin.valueChanges → debounceTime(300) → map(aPrecio) → startWith → distinctUntilChanged ─────────┼→ combineLatest → map(filtrar) → async pipe
precioMax.valueChanges → debounceTime(300) → map(aPrecio) → startWith → distinctUntilChanged ─────────┘
```

## Evidencia de pruebas (para completar)

| # | Prueba | Entrada | Resultado esperado | Captura |
| --- | --- | --- | --- | --- |
| 1 | Búsqueda por nombre | `camisa` | 4 productos | |
| 2 | Búsqueda sin acentos ni mayúsculas | `CARDIGAN` | 1 producto (Cárdigan) | |
| 3 | Filtro por categoría | Calzado | 3 productos | |
| 4 | Rango de precios | mín 500 · máx 800 | 7 productos | |
| 5 | Filtros combinados | `camisa` + máx 600 | 1 producto (franela) | |
| 6 | Sin coincidencias | `zzzzz` | Mensaje y contador en 0 | |
