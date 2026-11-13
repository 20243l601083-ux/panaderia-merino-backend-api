import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductosPage, getFallbackProductos } from './productos.page';

describe('ProductosPage', () => {
  let component: ProductosPage;
  let fixture: ComponentFixture<ProductosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe devolver tarjetas de panes para mostrar en la pantalla', () => {
    const productos = getFallbackProductos();

    expect(productos.length).toBeGreaterThan(0);
    expect(productos[0].name).toContain('Concha');
    expect(productos.some(producto => producto.name.includes('Bolillo'))).toBeTrue();
  });
});
