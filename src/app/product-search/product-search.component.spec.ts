import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { PRODUCTOS } from '../data/products.data';
import { ProductSearchComponent } from './product-search.component';

describe('ProductSearchComponent', () => {
  let fixture: ComponentFixture<ProductSearchComponent>;
  let component: ProductSearchComponent;
  let el: HTMLElement;

  const tarjetas = () => el.querySelectorAll('.card').length;
  const contador = () => el.querySelector('.contador__numero')?.textContent?.trim();

  /** Simula escribir en el buscador y deja pasar el debounce de 300 ms. */
  const escribir = (texto: string, esperarMs = 300) => {
    component.busqueda.setValue(texto);
    vi.advanceTimersByTime(esperarMs);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({ imports: [ProductSearchComponent] }).compileComponents();
    fixture = TestBed.createComponent(ProductSearchComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  afterEach(() => vi.useRealTimers());

  it('define al menos 20 productos y los muestra todos al iniciar', () => {
    expect(PRODUCTOS.length).toBeGreaterThanOrEqual(20);
    expect(tarjetas()).toBe(PRODUCTOS.length);
    expect(contador()).toBe(String(PRODUCTOS.length));
  });

  it('debounceTime: no filtra antes de 300 ms y sí después', () => {
    escribir('camisa', 299);
    expect(tarjetas()).toBe(PRODUCTOS.length);

    vi.advanceTimersByTime(1);
    fixture.detectChanges();
    expect(tarjetas()).toBe(4); // 4 camisas en el catálogo
    expect(contador()).toBe('4');
  });

  it('debounceTime: solo cuenta la última pulsación de una ráfaga', () => {
    const emisiones: number[] = [];
    component.resultado$.subscribe((r) => emisiones.push(r.total));

    for (const texto of ['j', 'je', 'jea', 'jean', 'jeans']) {
      component.busqueda.setValue(texto);
      vi.advanceTimersByTime(100); // menos que el debounce
    }
    vi.advanceTimersByTime(300);

    // Emisión inicial (24) + una sola con el texto final (1 producto: jeans)
    expect(emisiones).toEqual([PRODUCTOS.length, 1]);
  });

  it('distinctUntilChanged: no repite la búsqueda si el valor normalizado es igual', () => {
    const emisiones: number[] = [];
    component.resultado$.subscribe((r) => emisiones.push(r.total));

    escribir('botas');
    escribir('botas'); // mismo valor
    escribir('  BOTAS '); // mismo valor tras normalizar

    expect(emisiones).toEqual([PRODUCTOS.length, 1]);
  });

  it('busca sin importar mayúsculas ni acentos', () => {
    escribir('CARDIGAN');
    expect(tarjetas()).toBe(1);
    expect(el.querySelector('.card__nombre')?.textContent).toContain('Cárdigan');
  });

  it('filtra por categoría', () => {
    component.seleccionarCategoria('Calzado');
    vi.advanceTimersByTime(0);
    fixture.detectChanges();

    expect(tarjetas()).toBe(PRODUCTOS.filter((p) => p.categoria === 'Calzado').length);
    expect(tarjetas()).toBe(3);
  });

  it('filtra por rango de precios', () => {
    component.precioMin.setValue(500);
    component.precioMax.setValue(800);
    vi.advanceTimersByTime(300);
    fixture.detectChanges();

    const esperados = PRODUCTOS.filter((p) => p.precio >= 500 && p.precio <= 800).length;
    expect(tarjetas()).toBe(esperados);
    expect(contador()).toBe(String(esperados));
  });

  it('combina búsqueda, categoría y precio', () => {
    escribir('camisa');
    component.precioMax.setValue(600);
    vi.advanceTimersByTime(300);
    fixture.detectChanges();

    expect(tarjetas()).toBe(1);
    expect(el.querySelector('.card__nombre')?.textContent).toContain('franela');
  });

  it('muestra un mensaje cuando no hay coincidencias', () => {
    escribir('zzzzz');

    expect(tarjetas()).toBe(0);
    expect(contador()).toBe('0');
    expect(el.querySelector('.vacio__titulo')?.textContent).toContain('No encontramos coincidencias');
  });

  it('avisa cuando el precio mínimo es mayor que el máximo', () => {
    component.precioMin.setValue(1000);
    component.precioMax.setValue(500);
    vi.advanceTimersByTime(300);
    fixture.detectChanges();

    expect(tarjetas()).toBe(0);
    expect(el.querySelector('.vacio__titulo')?.textContent).toContain('Revisa el rango de precios');
  });

  it('limpiarFiltros restablece el catálogo completo', () => {
    escribir('zzzzz');
    component.limpiarFiltros();
    vi.advanceTimersByTime(300);
    fixture.detectChanges();

    expect(tarjetas()).toBe(PRODUCTOS.length);
  });

  describe('vista de detalle', () => {
    const detalle = () => el.querySelector('app-product-detail');
    const clic = (selector: string, indice = 0) => {
      (el.querySelectorAll(selector)[indice] as HTMLButtonElement).click();
      fixture.detectChanges();
    };
    const abrirPrimero = () => clic('.card__abrir');

    it('se abre al seleccionar una tarjeta y muestra los datos del producto', () => {
      expect(detalle()).toBeNull();
      abrirPrimero();

      expect(detalle()).not.toBeNull();
      expect(el.querySelector('.info__nombre')?.textContent).toContain(PRODUCTOS[0].nombre);
      expect(el.querySelectorAll('.miniatura').length).toBe(3);
      expect(el.querySelectorAll('.color').length).toBeGreaterThan(0);
    });

    it('se cierra con la tecla Escape y con el botón de volver', () => {
      abrirPrimero();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      fixture.detectChanges();
      expect(detalle()).toBeNull();

      abrirPrimero();
      clic('[aria-label="Volver al catálogo"]');
      expect(detalle()).toBeNull();
    });

    it('exige elegir una talla antes de agregar al carrito', () => {
      abrirPrimero();
      clic('.boton-carrito');

      expect(el.querySelector('.aviso')?.textContent).toContain('Elige una talla');
      expect(component.carrito()).toBe(0);
    });

    it('agrega al carrito con talla elegida y actualiza el contador', () => {
      abrirPrimero();
      clic('.talla:not(:disabled)');
      clic('.boton-carrito');

      expect(component.carrito()).toBe(1);
      expect(el.querySelector('.confirmacion')?.textContent).toContain('Agregado');
      expect(el.querySelector('.bolsa__cuenta')?.textContent?.trim()).toBe('1');
    });

    it('marca favoritos y cambia la imagen principal desde las miniaturas', () => {
      abrirPrimero();
      clic('[aria-label="Guardar en favoritos"]');
      expect(component.esFavorito(PRODUCTOS[0].id)).toBe(true);

      clic('.miniatura', 1);
      const principal = el.querySelector('.galeria__principal img') as HTMLImageElement;
      expect(principal.src).toBe(PRODUCTOS[0].imagenes[1]);
    });

    it('en calzado permite ver las tallas en MX, US o EU', () => {
      component.seleccionarCategoria('Calzado');
      vi.advanceTimersByTime(0);
      fixture.detectChanges();
      abrirPrimero();

      expect(el.querySelector('.talla')?.textContent?.trim()).toBe('25');
      const botonEU = Array.from(el.querySelectorAll('.sistema')).findIndex((b) => b.textContent?.trim() === 'EU');
      clic('.sistema', botonEU);
      expect(el.querySelector('.talla')?.textContent?.trim()).toBe('40');
    });
  });
});
