export type Categoria =
  | 'Playeras'
  | 'Camisas'
  | 'Pantalones'
  | 'Sudaderas'
  | 'Chamarras'
  | 'Calzado'
  | 'Accesorios';

export interface ColorProducto {
  nombre: string;
  /** Color en hexadecimal para pintar el círculo del selector. */
  hex: string;
}

export interface Talla {
  /** Para ropa: XS, S, M…  Para calzado: medida MX (25, 26…). Para accesorios: "Única". */
  valor: string;
  agotada: boolean;
}

export interface Product {
  id: number;
  nombre: string;
  categoria: Categoria;
  /** Precio en pesos mexicanos (MXN). */
  precio: number;
  descripcion: string;
  /** Imagen principal que se muestra en la tarjeta. */
  imagen: string;
  /** Galería de la vista de detalle (la primera es la imagen principal). */
  imagenes: string[];
  /** Valoración promedio de 1 a 5. */
  valoracion: number;
  colores: ColorProducto[];
  tallas: Talla[];
}
