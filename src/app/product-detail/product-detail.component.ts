import { CurrencyPipe, DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  afterNextRender,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { Product, Talla } from '../models/product.model';
import { reemplazarImagenRota } from '../shared/imagen-fallida';

type SistemaTalla = 'MX' | 'US' | 'EU';

/** Equivalencias aproximadas de calzado a partir de la medida MX. */
const EQUIVALENCIAS_CALZADO: Record<string, Record<'US' | 'EU', string>> = {
  '25': { US: '7', EU: '40' },
  '26': { US: '8', EU: '41' },
  '27': { US: '9', EU: '42' },
  '28': { US: '10', EU: '43' },
  '29': { US: '11', EU: '44' },
};

export interface ProductoAgregado {
  producto: Product;
  talla: string;
  color: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  // ---- Entradas y salidas -------------------------------------------------
  readonly producto = input.required<Product>();
  readonly favorito = input(false);

  readonly cerrar = output<void>();
  readonly alternarFavorito = output<void>();
  readonly agregar = output<ProductoAgregado>();

  // ---- Estado de la vista -------------------------------------------------
  readonly imagenActiva = signal(0);
  readonly tallaElegida = signal<string | null>(null);
  readonly colorElegido = signal<string | null>(null);
  readonly sistema = signal<SistemaTalla>('MX');
  readonly aviso = signal('');
  readonly agregado = signal(false);

  readonly sistemas: SistemaTalla[] = ['MX', 'US', 'EU'];
  readonly esCalzado = computed(() => this.producto().categoria === 'Calzado');
  readonly colorActual = computed(() => {
    const colores = this.producto().colores;
    return colores.find((c) => c.nombre === this.colorElegido()) ?? colores[0];
  });

  readonly imagenFallida = reemplazarImagenRota;

  private readonly documento = inject(DOCUMENT);
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private temporizador: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    // Al abrirse, el foco pasa al panel para que el teclado y los lectores de pantalla lo detecten.
    afterNextRender(() => this.panel()?.nativeElement.focus());
  }

  ngOnInit(): void {
    const { tallas, colores } = this.producto();
    // Si solo hay una talla disponible (por ejemplo "Única"), ya viene elegida.
    if (tallas.length === 1 && !tallas[0].agotada) this.tallaElegida.set(tallas[0].valor);
    this.colorElegido.set(colores[0]?.nombre ?? null);
    this.documento.body.style.overflow = 'hidden'; // evita que la página de fondo se desplace
  }

  ngOnDestroy(): void {
    this.documento.body.style.overflow = '';
    clearTimeout(this.temporizador);
  }

  @HostListener('document:keydown.escape')
  alPulsarEscape(): void {
    this.cerrar.emit();
  }

  /** Muestra la talla en el sistema elegido (solo el calzado tiene equivalencias). */
  etiquetaTalla(valor: string): string {
    const sistema = this.sistema();
    if (!this.esCalzado() || sistema === 'MX') return valor;
    return EQUIVALENCIAS_CALZADO[valor]?.[sistema] ?? valor;
  }

  elegirTalla(talla: Talla): void {
    if (talla.agotada) return;
    this.tallaElegida.set(talla.valor);
    this.aviso.set('');
  }

  agregarAlCarrito(): void {
    const talla = this.tallaElegida();
    if (!talla) {
      this.aviso.set('Elige una talla para continuar.');
      return;
    }

    this.agregar.emit({ producto: this.producto(), talla, color: this.colorActual().nombre });
    this.agregado.set(true);
    clearTimeout(this.temporizador);
    this.temporizador = setTimeout(() => this.agregado.set(false), 2200);
  }
}
