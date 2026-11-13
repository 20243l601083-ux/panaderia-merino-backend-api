import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class HomePage {
  @ViewChild('carousel', { read: ElementRef }) carouselEl!: ElementRef<HTMLDivElement>;
  showMenu = false;
  showCart = false;
  cartItems: string[] = [];
  showCartMessage = false;
  cartMessage = '';

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  closeMenu() {
    this.showMenu = false;
  }

  toggleCart() {
    this.showCart = !this.showCart;
  }

  closeCart() {
    this.showCart = false;
  }

  addToCart(item: string) {
    this.cartItems.push(item);
    this.cartMessage = `${item} agregado al carrito`;
    this.showCartMessage = true;
    this.closeMenu();
    setTimeout(() => {
      this.showCartMessage = false;
    }, 1300);
  }

  nextOffer() {
    const carousel = this.carouselEl.nativeElement;
    carousel.scrollBy({ left: carousel.offsetWidth * 0.8, behavior: 'smooth' });
  }

  prevOffer() {
    const carousel = this.carouselEl.nativeElement;
    carousel.scrollBy({ left: -carousel.offsetWidth * 0.8, behavior: 'smooth' });
  }
}
