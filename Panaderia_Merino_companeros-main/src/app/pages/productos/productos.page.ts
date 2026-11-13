import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ViewWillEnter } from '@ionic/angular';
import { RouterLink } from '@angular/router';

import { ProductoService } from '../../services/producto.service';
import { CartService } from '../../services/cart.service';


interface Producto {

  id_producto: number;

  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;

  qty: number;


  // compatibilidad con CartService
  name: string;
  price: number;
  image: string;

}



@Component({

  selector: 'app-productos',

  templateUrl: './productos.page.html',

  styleUrls: ['./productos.page.scss'],

  standalone: true,

  imports: [

    CommonModule,
    IonicModule,
    RouterLink

  ]

})


export class ProductosPage implements OnInit, ViewWillEnter {



  productos: Producto[] = [];

  totalItems = 0;

  showMenu = false;




  constructor(

    private productoService: ProductoService,

    private cartService: CartService

  ){}





  ngOnInit(){
    this.cargarProductos();
  }

  ionViewWillEnter(){
    this.syncCartQuantities();
    this.actualizarCarrito();
  }

  private syncCartQuantities(){
    const cartItems = this.cartService.getItems();
    this.productos.forEach(producto => {
      const inCart = cartItems.find(
        item => item.id_producto === producto.id_producto
      );
      producto.qty = inCart?.qty ?? 0;
    });
  }






  cargarProductos(){


    this.productoService.listarProductos()

    .subscribe({


      next:(resp:any)=>{


        console.log(
          'Productos API:',
          resp
        );



        this.productos = resp.data.map((p:any)=>({
          id_producto:p.id_producto,
          nombre:p.nombre,
          descripcion:p.descripcion,
          precio:Number(p.precio),
          stock:p.stock,
          imagen:p.imagen,
          qty:0,
          name:p.nombre,
          price:Number(p.precio),
          image:p.imagen
        }));

        this.syncCartQuantities();
        this.actualizarCarrito();



      },


      error:(err)=>{


        console.error(
          'Error cargando productos',
          err
        );


      }



    });



  }







  sumar(producto:Producto){
    this.cartService.increase({
      id_producto: producto.id_producto,
      name: producto.name,
      price: producto.price,
      image: producto.image,
      qty: producto.qty
    });
    producto.qty = this.cartService.getItems().find(
      item => item.id_producto === producto.id_producto
    )?.qty ?? producto.qty + 1;
    this.actualizarCarrito();
  }

  restar(producto:Producto){
    if(producto.qty > 0){
      this.cartService.decrease({
        id_producto: producto.id_producto,
        name: producto.name,
        price: producto.price,
        image: producto.image,
        qty: producto.qty
      });
      producto.qty = this.cartService.getItems().find(
        item => item.id_producto === producto.id_producto
      )?.qty ?? 0;
    }
    this.actualizarCarrito();
  }








  actualizarCarrito(){


    this.totalItems = this.cartService.totalItems;


  }







  closeMenu(){


    this.showMenu=false;


  }





}