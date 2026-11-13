import { Injectable } from '@angular/core';

export interface CartItem {
  id_producto?: number;
  name: string;
  price: number;
  image: string;
  qty: number;
}


@Injectable({
  providedIn: 'root'
})
export class CartService {


  private items: CartItem[] = [];



  getItems(): CartItem[] {
    return this.items;
  }



  private getItemKey(product: CartItem): string {
    return String(product.id_producto ?? product.name);
  }



  updateItem(product: CartItem) {

    const key = this.getItemKey(product);

    const existing = this.items.find(
      item => this.getItemKey(item) === key
    );


    // Eliminar cuando cantidad sea 0

    if (product.qty <= 0) {

      this.items = this.items.filter(
        item => this.getItemKey(item) !== key
      );

      return;
    }



    // Actualizar producto existente

    if (existing) {

      existing.qty = product.qty;
      existing.price = product.price;
      existing.image = product.image;

      if (product.id_producto) {
        existing.id_producto = product.id_producto;
      }


    } else {


      // Agregar producto nuevo

      this.items.push({
        ...product
      });


    }

  }





  // Agregar producto al carrito

  addItem(product: CartItem) {


    const existing = this.items.find(
      item => this.getItemKey(item) === this.getItemKey(product)
    );



    if (existing) {


      existing.qty += product.qty;


    } else {


      this.items.push({
        ...product
      });


    }


  }






  // Aumentar cantidad

  increase(product: CartItem) {


    this.updateItem({

      ...product,

      qty: product.qty + 1

    });


  }






  // Disminuir cantidad

  decrease(product: CartItem) {


    this.updateItem({

      ...product,

      qty: Math.max(0, product.qty - 1)

    });


  }







  get totalItems(): number {


    return this.items.reduce(

      (sum, item) => sum + item.qty,

      0

    );


  }







  get totalPrice(): number {


    return this.items.reduce(

      (sum, item) => sum + (item.price * item.qty),

      0

    );


  }







  clear() {

    this.items = [];

  }



}