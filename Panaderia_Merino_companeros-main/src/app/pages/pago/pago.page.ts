import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.page.html',
  styleUrls: ['./pago.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    CommonModule,
    FormsModule,
    RouterLink
  ]
})
export class PagoPage {
  showMenu = false;
  processing = false;
  alias = '';
  cardNumber = '';
  cvc = '';
  expiry = '';
  address = '';
  selectedMethod = '';
  errorMessage = '';

  constructor(
    private router: Router,
    private cartService: CartService,
    private pedidoService: PedidoService,
    private authService: AuthService
  ) {}

  get cartCount() {
    return this.cartService.totalItems;
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  closeMenu() {
    this.showMenu = false;
  }

  selectMethod(method: string) {
    this.selectedMethod = method;
  }

  private buildDetalles() {
    const items = this.cartService.getItems().filter(item => item.qty > 0);
    const detalles = items.map(item => ({
      id_producto: item.id_producto ?? 0,
      cantidad: item.qty
    })).filter(detalle => detalle.id_producto > 0);

    return { items, detalles };
  }

  pagarConMercadoPago() {
    if (this.processing) {
      return;
    }

    this.errorMessage = '';
    const { items, detalles } = this.buildDetalles();

    if (items.length === 0) {
      this.errorMessage = 'Agrega productos al carrito antes de pagar.';
      return;
    }

    if (detalles.length !== items.length) {
      this.errorMessage = 'No fue posible construir el pedido con los productos del carrito.';
      return;
    }

    const usuario = this.authService.getUsuario();
    if (!usuario?.id_usuario) {
      this.errorMessage = 'Inicia sesión para completar tu pedido.';
      this.router.navigate(['/login']);
      return;
    }

    this.processing = true;
    const total = this.cartService.totalPrice;

    this.pedidoService.crearPedido({
      id_cliente: Number(usuario.id_usuario),
      metodo_pago: 'Mercado Pago',
      direccion_entrega: this.address.trim() || 'Sin dirección',
      estado: 'pendiente',
      detalles
    }).subscribe({
      next: (pedidoResp) => {
        const pedidoId = pedidoResp?.data?.id_pedido;

        if (!pedidoId) {
          this.processing = false;
          this.errorMessage = 'No fue posible registrar el pedido.';
          return;
        }

        this.pedidoService.crearPreferenciaPago({
          title: 'Pedido Panadería Merino',
          description: `Pedido #${pedidoId}`,
          amount: total,
          external_reference: String(pedidoId)
        }).subscribe({
          next: (response) => {
            const initPoint = response?.data?.init_point || response?.init_point;
            const isSandbox = response?.data?.sandbox;

            if (!initPoint) {
              this.processing = false;
              this.errorMessage = 'No fue posible iniciar el pago con Mercado Pago.';
              return;
            }

            if (isSandbox) {
              this.pedidoService.confirmarPago(pedidoId).subscribe({
                next: () => {
                  this.processing = false;
                  this.cartService.clear();
                  this.router.navigate(['/exito'], {
                    queryParams: { total, pedido: pedidoId }
                  });
                },
                error: (err) => {
                  this.processing = false;
                  this.errorMessage = err?.error?.message || 'No fue posible confirmar el pago.';
                }
              });
              return;
            }

            window.open(initPoint, '_blank', 'noopener,noreferrer');
            this.processing = false;
            this.cartService.clear();
            this.router.navigate(['/seguimiento'], {
              queryParams: { pedido: pedidoId }
            });
          },
          error: (err) => {
            this.processing = false;
            this.errorMessage = err?.error?.message || 'No fue posible crear la preferencia de pago.';
          }
        });
      },
      error: (err) => {
        this.processing = false;
        this.errorMessage = err?.error?.message || 'No fue posible crear el pedido.';
      }
    });
  }

  pagar() {
    if (this.processing) {
      return;
    }

    this.errorMessage = '';
    const { items, detalles } = this.buildDetalles();

    if (items.length === 0) {
      this.errorMessage = 'Agrega productos al carrito antes de pagar.';
      return;
    }

    const usuario = this.authService.getUsuario();
    if (!usuario?.id_usuario) {
      this.errorMessage = 'Inicia sesión para completar tu pedido.';
      this.router.navigate(['/login']);
      return;
    }

    if (detalles.length !== items.length) {
      this.errorMessage = 'No fue posible construir el pedido con los productos del carrito.';
      return;
    }

    this.processing = true;
    const total = this.cartService.totalPrice;

    this.pedidoService.crearPedido({
      id_cliente: Number(usuario.id_usuario),
      metodo_pago: this.selectedMethod || 'Efectivo',
      direccion_entrega: this.address.trim() || 'Sin dirección',
      estado: 'pagado',
      detalles
    }).subscribe({
      next: () => {
        this.processing = false;
        this.cartService.clear();
        this.router.navigate(['/exito'], { queryParams: { total } });
      },
      error: (err) => {
        this.processing = false;
        this.errorMessage = err?.error?.message || 'No fue posible crear el pedido.';
      }
    });
  }
}
