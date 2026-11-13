import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';

import { CartService, CartItem } from '../../services/cart.service';


@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterLink
  ]
})


export class CarritoPage implements OnInit {


  items: CartItem[] = [];

  showMenu = false;



  constructor(

    private cartService: CartService

  ) {}




  ngOnInit(){


    this.cargarCarrito();


  }






  ionViewWillEnter(){


    this.cargarCarrito();


  }






  cargarCarrito(){


    this.items = this.cartService.getItems();


  }






  get grandTotal(){


    return this.cartService.totalPrice;


  }






  increase(item: CartItem){


    this.cartService.increase(item);


    this.cargarCarrito();


  }






  decrease(item: CartItem){


    this.cartService.decrease(item);


    this.cargarCarrito();


  }






  toggleMenu(){


    this.showMenu = !this.showMenu;


  }






  closeMenu(){


    this.showMenu = false;


  }



}