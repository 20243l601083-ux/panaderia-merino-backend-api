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

  seleccionarMetodo(method: string) {
    this.selectedMethod = method;
    this.errorMessage = '';
  }

  /**
   * Verifica que haya productos y usuario antes de pagar.
   */
  private validarPedido(): boolean {

    this.errorMessage = '';

    const items = this.cartService
      .getItems()
      .filter(item => item.qty > 0);

    if (items.length === 0) {
      this.errorMessage =
        'Agrega productos al carrito antes de pagar.';
      return false;
    }

    const usuario = this.authService.getUsuario();

    if (!usuario?.id_usuario) {
      this.errorMessage =
        'Inicia sesión para completar tu pedido.';

      this.router.navigate(['/login']);
      return false;
    }

    if (!this.address.trim()) {
      this.errorMessage =
        'Escribe la dirección donde deseas recibir tu pedido.';
      return false;
    }

    return true;
  }

  /**
   * Convierte los productos del carrito
   * al formato esperado por el backend.
   */
  private obtenerDetalles() {

    const items = this.cartService
      .getItems()
      .filter(item => item.qty > 0);

    const detalles = items
      .map(item => ({
        id_producto: item.id_producto ?? 0,
        cantidad: item.qty
      }))
      .filter(detalle => detalle.id_producto > 0);

    if (detalles.length !== items.length) {
      this.errorMessage =
        'No fue posible construir el pedido con los productos del carrito.';

      return null;
    }

    return detalles;
  }

  /**
   * 💳 PAGO CON MERCADO PAGO
   */
  pagarConMercadoPago() {

    if (this.processing) {
      return;
    }

    if (!this.validarPedido()) {
      return;
    }

    this.processing = true;

    const total = this.cartService.totalPrice;

    this.pedidoService.crearPreferenciaPago({
      title: 'Pedido Panadería Merino',
      description: 'Pago de pedido mediante Mercado Pago',
      amount: total,
      external_reference: `pedido-${Date.now()}`
    }).subscribe({

      next: (response) => {

        const initPoint =
          response?.data?.init_point ||
          response?.init_point;

        if (!initPoint) {

          this.processing = false;

          this.errorMessage =
            'Mercado Pago no devolvió el enlace de pago.';

          return;
        }

        /*
         * Enviamos al cliente directamente
         * al checkout de Mercado Pago.
         */
        window.location.href = initPoint;
      },

      error: (err) => {

        this.processing = false;

        this.errorMessage =
          err?.error?.message ||
          'No fue posible iniciar el pago con Mercado Pago.';
      }

    });
  }

  /**
   * 🏪 PAGO PRESENCIAL
   */
  pagarPresencialmente() {

    if (this.processing) {
      return;
    }

    if (!this.validarPedido()) {
      return;
    }

    const detalles = this.obtenerDetalles();

    if (!detalles) {
      return;
    }

    const usuario = this.authService.getUsuario();

    if (!usuario?.id_usuario) {
      return;
    }

    this.processing = true;

    const total = this.cartService.totalPrice;

    console.log("USUARIO COMPLETO:");
    console.log(usuario);

    console.log("ID USUARIO:");
    console.log(usuario.id_usuario);

    console.log("ID CLIENTE:");
    console.log(usuario.id_cliente);

    this.pedidoService.crearPedido({

      id_cliente: Number(usuario.id_cliente),

      /*
       * El backend podrá identificar
       * que este pedido se pagará presencialmente.
       */
      metodo_pago: 'Presencial',

      direccion_entrega: this.address.trim(),

      detalles

    }).subscribe({

      next: (response) => {

        this.processing = false;

        /*
         * Vaciar carrito después de crear
         * correctamente el pedido.
         */
        this.cartService.clear();

        const pedidoId =
          response?.data?.id_pedido ||
          response?.id_pedido ||
          response?.pedido?.id_pedido;

        this.router.navigate(
          ['/exito'],
          {
            queryParams: {
              total,
              pedido: pedidoId || ''
            }
          }
        );
      },

      error: (err) => {

        this.processing = false;

        this.errorMessage =
          err?.error?.message ||
          'No fue posible registrar el pedido presencial.';
      }

    });
  }
}