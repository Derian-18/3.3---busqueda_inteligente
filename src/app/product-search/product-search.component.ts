import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  Observable,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
} from 'rxjs';

import { PRODUCTOS } from '../data/products.data';
import { Product } from '../models/product.model';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { reemplazarImagenRota } from '../shared/imagen-fallida';

/** Valor que se muestra en el filtro cuando no se limita la categoría. */
const TODAS = 'Todas';

/** Tiempo (ms) que se espera tras la última pulsación antes de filtrar. */
const RETARDO_BUSQUEDA_MS = 300;

/** Forma de los datos que consume la plantilla (un solo objeto por emisión). */
interface Resultado {
  productos: Product[];
  total: number;
  rangoInvalido: boolean;
  hayFiltros: boolean;
}

interface RangoRapido {
  etiqueta: string;
  min: number | null;
  max: number | null;
}

/** Quita acentos y pasa a minúsculas: "Cárdigan" también se encuentra con "cardigan". */
const normalizar = (texto: string): string =>
  texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
    .toLowerCase();

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, CurrencyPipe, ProductDetailComponent],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.css',
})
export class ProductSearchComponent {
  /** Catálogo completo (arreglo de 24 productos). */
  readonly productos: Product[] = PRODUCTOS;

  /** Categorías disponibles, calculadas a partir de los datos. */
  readonly categorias: string[] = [TODAS, ...new Set(PRODUCTOS.map((p) => p.categoria))];

  readonly rangosRapidos: RangoRapido[] = [
    { etiqueta: 'Hasta $500', min: null, max: 500 },
    { etiqueta: '$500 – $1,000', min: 500, max: 1000 },
    { etiqueta: 'Más de $1,000', min: 1000, max: null },
  ];

  // ---- Controles del formulario reactivo --------------------------------
  readonly busqueda = new FormControl('', { nonNullable: true });
  readonly categoria = new FormControl(TODAS, { nonNullable: true });
  readonly precioMin = new FormControl<number | null>(null);
  readonly precioMax = new FormControl<number | null>(null);

  // ---- Vista de detalle, favoritos y carrito ----------------------------
  readonly seleccionado = signal<Product | null>(null);
  readonly favoritos = signal<ReadonlySet<number>>(new Set());
  readonly carrito = signal(0);

  readonly imagenFallida = reemplazarImagenRota;

  /** Elemento que abrió el detalle, para devolverle el foco al cerrarlo. */
  private origenDelFoco: HTMLElement | null = null;

  /**
   * Flujo principal: combina el texto del buscador con los demás filtros.
   * Cada vez que cualquiera cambia, se recalcula la lista sin recargar la página.
   */
  readonly resultado$: Observable<Resultado> = combineLatest([
    this.flujoBusqueda(),
    this.flujoCategoria(),
    this.flujoPrecio(this.precioMin),
    this.flujoPrecio(this.precioMax),
  ]).pipe(
    // map(): transforma los valores de los filtros en el objeto que usa la vista.
    map(([texto, categoria, min, max]) => this.filtrar(texto, categoria, min, max)),
  );

  // ---- Flujos RxJS ------------------------------------------------------

  /**
   * Texto del buscador:
   *  - debounceTime(): espera 300 ms sin pulsaciones antes de emitir.
   *  - map(): normaliza el texto (sin acentos, minúsculas, sin espacios sobrantes).
   *  - startWith(): emite '' al inicio para mostrar el catálogo completo de entrada.
   *  - distinctUntilChanged(): ignora el valor si es igual al anterior.
   */
  private flujoBusqueda(): Observable<string> {
    return this.busqueda.valueChanges.pipe(
      debounceTime(RETARDO_BUSQUEDA_MS),
      map((valor) => normalizar(valor)),
      startWith(''),
      distinctUntilChanged(),
    );
  }

  private flujoCategoria(): Observable<string> {
    return this.categoria.valueChanges.pipe(startWith(this.categoria.value), distinctUntilChanged());
  }

  /** Igual que el buscador: el precio también se escribe a mano, así que se controla la frecuencia. */
  private flujoPrecio(control: FormControl<number | null>): Observable<number | null> {
    return control.valueChanges.pipe(
      debounceTime(RETARDO_BUSQUEDA_MS),
      map((valor) => this.aPrecio(valor)),
      startWith(this.aPrecio(control.value)),
      distinctUntilChanged(),
    );
  }

  // ---- Lógica de filtrado -----------------------------------------------

  private aPrecio(valor: number | string | null | undefined): number | null {
    if (valor === null || valor === undefined || valor === '') return null;
    const numero = Number(valor);
    return Number.isFinite(numero) ? Math.max(0, numero) : null;
  }

  private filtrar(texto: string, categoria: string, min: number | null, max: number | null): Resultado {
    const rangoInvalido = min !== null && max !== null && min > max;
    const hayFiltros = texto !== '' || categoria !== TODAS || min !== null || max !== null;

    if (rangoInvalido) {
      return { productos: [], total: 0, rangoInvalido, hayFiltros };
    }

    const productos = this.productos.filter(
      (p) =>
        (texto === '' || normalizar(p.nombre).includes(texto)) &&
        (categoria === TODAS || p.categoria === categoria) &&
        (min === null || p.precio >= min) &&
        (max === null || p.precio <= max),
    );

    return { productos, total: productos.length, rangoInvalido, hayFiltros };
  }

  // ---- Acciones de la vista ---------------------------------------------

  seleccionarCategoria(categoria: string): void {
    this.categoria.setValue(categoria);
  }

  aplicarRango(rango: RangoRapido): void {
    this.precioMin.setValue(rango.min);
    this.precioMax.setValue(rango.max);
  }

  rangoActivo(rango: RangoRapido): boolean {
    return this.precioMin.value === rango.min && this.precioMax.value === rango.max;
  }

  limpiarBusqueda(): void {
    this.busqueda.setValue('');
  }

  limpiarFiltros(): void {
    this.busqueda.setValue('');
    this.categoria.setValue(TODAS);
    this.precioMin.setValue(null);
    this.precioMax.setValue(null);
  }

  // ---- Detalle de producto ----------------------------------------------

  abrirDetalle(producto: Product): void {
    this.origenDelFoco = document.activeElement as HTMLElement | null;
    this.seleccionado.set(producto);
  }

  cerrarDetalle(): void {
    this.seleccionado.set(null);
    const origen = this.origenDelFoco;
    this.origenDelFoco = null;
    queueMicrotask(() => origen?.focus());
  }

  esFavorito(id: number): boolean {
    return this.favoritos().has(id);
  }

  alternarFavorito(id: number): void {
    this.favoritos.update((actuales) => {
      const siguientes = new Set(actuales);
      if (siguientes.has(id)) {
        siguientes.delete(id);
      } else {
        siguientes.add(id);
      }
      return siguientes;
    });
  }

  agregarAlCarrito(): void {
    this.carrito.update((cantidad) => cantidad + 1);
  }
}
