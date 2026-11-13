import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,  RouterLink]
})

export class CarritoPage {
  showMenu = false;

  constructor(private cartService: CartService) {}

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  closeMenu() {
    this.showMenu = false;
  }

  get items(): CartItem[] {
    return this.cartService.getItems();
  }

  increase(item: CartItem) {
    this.cartService.increase(item);
  }

  decrease(item: CartItem) {
    this.cartService.decrease(item);
  }

  get grandTotal(): number {
    return this.cartService.totalPrice;
  }

}
