import { Categoria, ColorProducto, Product, Talla } from '../models/product.model';

/* ------------------------------------------------------------------
 * IMÁGENES
 * ------------------------------------------------------------------
 * Por defecto se usan URLs externas (picsum.photos), así el proyecto
 * funciona sin descargar nada. OJO: son fotos de ejemplo aleatorias,
 * no de ropa real.
 *
 * Para usar tus propias imágenes:
 *   1. Pon USAR_IMAGENES_LOCALES = true.
 *   2. Copia tus archivos .jpg dentro de:  public/assets/products/
 *      (en Angular 18+ la carpeta "public/" reemplaza a "src/assets/").
 *   3. Nombra cada archivo igual que el "slug" del producto, por ejemplo:
 *        public/assets/products/playera-basica-blanca.jpg
 *      Cada producto usa 3 imágenes para la galería del detalle: el slug,
 *      el slug con "-2" y el slug con "-3", por ejemplo:
 *        playera-basica-blanca.jpg · playera-basica-blanca-2.jpg · playera-basica-blanca-3.jpg
 *
 * Si prefieres otras URLs externas (Unsplash, tu CDN, etc.), edita la
 * parte de la URL remota dentro de la función imagen().
 * ------------------------------------------------------------------ */
const USAR_IMAGENES_LOCALES = true;

const imagen = (slug: string): string =>
  USAR_IMAGENES_LOCALES
    ? `assets/products/${slug}.jpg` // <-- AQUÍ se leen tus imágenes locales
    : `https://picsum.photos/seed/${slug}/600/750`; // <-- AQUÍ puedes cambiar la URL remota

const BASE: ProductoBase[] = [
  // ---------------------------------------------------------- Playeras
  {
    id: 1,
    nombre: 'Playera básica',
    categoria: 'Playeras',
    precio: 199,
    descripcion: 'Playera de algodón peinado con cuello redondo y corte regular. Un básico para todos los días.',
    slug: 'playera-basica-blanca',
  },
  
  {
    id: 3,
    nombre: 'Polo',
    categoria: 'Playeras',
    precio: 449,
    descripcion: 'Polo clásico con botones de nácar y cuello tejido. Ideal para oficina casual.',
    slug: 'polo-pique',
  },
  {
    id: 4,
    nombre: 'Playera gráfica vintage',
    categoria: 'Playeras',
    precio: 349,
    descripcion: 'Estampado de inspiración retro sobre algodón lavado a la piedra para un acabado desgastado.',
    slug: 'camisa-vintage',
  },

  // ----------------------------------------------------------- Camisas
  {
    id: 5,
    nombre: 'Camisa Oxford ',
    categoria: 'Camisas',
    precio: 699,
    descripcion: 'Camisa Oxford de manga larga con cuello button-down. Combina con jeans o pantalón de vestir.',
    slug: 'camisa-oxford',
  },
  {
    id: 6,
    nombre: 'Camisa de lino',
    categoria: 'Camisas',
    precio: 799,
    descripcion: 'Lino 100% natural, fresca y ligera, con bolsillo en el pecho y botones de coco.',
    slug: 'camisa-lino',
  },
  {
    id: 7,
    nombre: 'Camisa de franela a cuadros',
    categoria: 'Camisas',
    precio: 549,
    descripcion: 'Franela cepillada en cuadros rojos y negros. Se puede usar sola o como sobrecamisa.',
    slug: 'camisa-cuadros',
  },
  {
    id: 8,
    nombre: 'Camisa de mezclilla lavada',
    categoria: 'Camisas',
    precio: 649,
    descripcion: 'Mezclilla ligera con lavado medio, doble bolsillo y costuras contrastantes.',
    slug: 'camisa-lavada',
  },

  // -------------------------------------------------------- Pantalones
  {
    id: 9,
    nombre: 'Jeans slim fit',
    categoria: 'Pantalones',
    precio: 899,
    descripcion: 'Mezclilla stretch con corte slim, tiro medio y cinco bolsillos. Cómodos todo el día.',
    slug: 'pantalon-liso',
  },
  {
    id: 10,
    nombre: 'Pantalón chino ',
    categoria: 'Pantalones',
    precio: 749,
    descripcion: 'Gabardina de algodón con un toque de elastano. Un clásico versátil para cualquier ocasión.',
    slug: 'chino',
  },
  {
    id: 11,
    nombre: 'Jogger deportivo',
    categoria: 'Pantalones',
    precio: 499,
    descripcion: 'Felpa ligera con cintura elástica, cordón ajustable y puños en los tobillos.',
    slug: 'deportivo',
  },
  {
    id: 12,
    nombre: 'Pantalón cargoo',
    categoria: 'Pantalones',
    precio: 849,
    descripcion: 'Corte recto con bolsillos laterales con solapa y tela resistente de sarga.',
    slug: 'pantalon-cargo',
  },

  // --------------------------------------------------------- Sudaderas
  {
    id: 13,
    nombre: 'Sudadera con capucha',
    categoria: 'Sudaderas',
    precio: 799,
    descripcion: 'Felpa afelpada por dentro, capucha doble y bolsillo canguro. Perfecta para el invierno.',
    slug: 'sudareda-capucha',
  },
  {
    id: 14,
    nombre: 'Sudadera cuello redondo',
    categoria: 'Sudaderas',
    precio: 649,
    descripcion: 'Sudadera sin capucha en algodón grueso con puños y cintura acanalados.',
    slug: 'sudareda-cuello-redondo',
  },
  {
    id: 15,
    nombre: 'Cárdigan de punto trenzado',
    categoria: 'Sudaderas',
    precio: 899,
    descripcion: 'Punto grueso con trenzas, cierre de botones y bolsillos frontales.',
    slug: 'cardigan',
  },

  // --------------------------------------------------------- Chamarras
  {
    id: 16,
    nombre: 'Chamarra de mezclilla clásica',
    categoria: 'Chamarras',
    precio: 1299,
    descripcion: 'Chamarra de mezclilla rígida con botones metálicos y forro interior suave.',
    slug: 'chamarra-mezclilla',
  },
  {
    id: 17,
    nombre: 'Chamarra bomber',
    categoria: 'Chamarras',
    precio: 1499,
    descripcion: 'Estilo bomber con cierre frontal, puños elásticos y acabado repelente al agua.',
    slug: 'chamarra-bomber',
  },
  {
    id: 18,
    nombre: 'Abrigo largo de lana ',
    categoria: 'Chamarras',
    precio: 2499,
    descripcion: 'Abrigo largo de mezcla de lana con solapa amplia y forro satinado. Elegancia para el frío.',
    slug: 'chamarra-lana',
  },

  // ----------------------------------------------------------- Calzado
  {
    id: 19,
    nombre: 'Tenis urbanos',
    categoria: 'Calzado',
    precio: 1199,
    descripcion: 'Tenis minimalistas de piel sintética con suela de goma y plantilla acolchada.',
    slug: 'tenis-urbanos',
  },
  {
    id: 20,
    nombre: 'Botas de piel',
    categoria: 'Calzado',
    precio: 1899,
    descripcion: 'Botas de piel genuina con suela antiderrapante y cierre de agujetas reforzado.',
    slug: 'botas-piel',
  },
  {
    id: 21,
    nombre: 'Tenis running ligeros',
    categoria: 'Calzado',
    precio: 1599,
    descripcion: 'Malla transpirable, amortiguación en el talón y peso pluma para correr cómodo.',
    slug: 'tenis-runing',
  },

  // -------------------------------------------------------- Accesorios
  {
    id: 22,
    nombre: 'Gorra beisbolera de algodón',
    categoria: 'Accesorios',
    precio: 249,
    descripcion: 'Gorra de seis paneles con visera curva y cierre ajustable en la parte trasera.',
    slug: 'gorra-beisbolera',
  },
  {
    id: 23,
    nombre: 'Bufanda de lana tejida',
    categoria: 'Accesorios',
    precio: 349,
    descripcion: 'Bufanda larga tejida de lana suave con flecos en los extremos.',
    slug: 'bufanda',
  },
  {
    id: 24,
    nombre: 'Mochila urbana impermeable',
    categoria: 'Accesorios',
    precio: 899,
    descripcion: 'Mochila con compartimento acolchado para laptop de 15", bolsillos ocultos y tela repelente al agua.',
    slug: 'mochila',
  },
];

/* ------------------------------------------------------------------
 * Datos de apoyo para la vista de detalle (galería, colores, tallas
 * y valoración). Se generan a partir de cada producto base.
 * ------------------------------------------------------------------ */
type ProductoBase = Omit<Product, 'imagen' | 'imagenes' | 'valoracion' | 'colores' | 'tallas'> & {
  slug: string;
};

const COLORES: ColorProducto[] = [
  { nombre: 'Negro', hex: '#1c1b1f' },
  { nombre: 'Blanco', hex: '#f4f1ea' },
  { nombre: 'Gris', hex: '#8e8e93' },
  { nombre: 'Azul marino', hex: '#1f3a5f' },
  { nombre: 'Azul', hex: '#2f7fd1' },
  { nombre: 'Verde olivo', hex: '#5b6b3a' },
  { nombre: 'Rojo', hex: '#c0392b' },
  { nombre: 'Beige', hex: '#d8c3a5' },
  { nombre: 'Café', hex: '#6b4a34' },
];

const TALLAS_ROPA = ['XS', 'S', 'M', 'L', 'XL'];

const TALLAS: Record<Categoria, string[]> = {
  Playeras: TALLAS_ROPA,
  Camisas: TALLAS_ROPA,
  Sudaderas: TALLAS_ROPA,
  Chamarras: TALLAS_ROPA,
  Pantalones: ['28', '30', '32', '34', '36'],
  Calzado: ['25', '26', '27', '28', '29'], // medidas MX
  Accesorios: ['Única'],
};

/** Cuatro colores por producto, rotando la paleta según el id. */
const coloresDe = (id: number): ColorProducto[] =>
  Array.from({ length: 4 }, (_, i) => COLORES[(id * 2 + i) % COLORES.length]);

/** En los productos con id par se marca una talla como agotada (datos de ejemplo). */
const tallasDe = (categoria: Categoria, id: number): Talla[] => {
  const valores = TALLAS[categoria];
  const agotada = valores.length > 1 && id % 2 === 0 ? id % valores.length : -1;
  return valores.map((valor, i) => ({ valor, agotada: i === agotada }));
};

const enriquecer = ({ slug, ...base }: ProductoBase): Product => ({
  ...base,
  imagen: imagen(slug),
  imagenes: [imagen(slug), imagen(`${slug}-2`), imagen(`${slug}-3`)],
  valoracion: (40 + ((base.id * 7) % 10)) / 10, // entre 4.0 y 4.9 (datos de ejemplo)
  colores: coloresDe(base.id),
  tallas: tallasDe(base.categoria, base.id),
});

/** Catálogo completo con todos los datos que usan el listado y el detalle. */
export const PRODUCTOS: Product[] = BASE.map(enriquecer);
