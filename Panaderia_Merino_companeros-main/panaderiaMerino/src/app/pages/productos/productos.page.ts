import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductoService } from '../../services/producto.service';


export interface Producto {
  id_producto?: number;
  name: string;
  price: number;
  image: string;
  qty: number;
}



export function getFallbackProductos(): Producto[] {

  return [

    {
      id_producto: 1,
      name: 'Concha de vainilla',
      price: 18,
      image: 'assets/imagenes/concha.jpeg',
      qty: 0
    },

    {
      id_producto: 2,
      name: 'Mantecada tradicional',
      price: 20,
      image: 'assets/imagenes/mantecada.jpeg',
      qty: 0
    },

    {
      id_producto: 3,
      name: 'Bolillo suave',
      price: 16,
      image: 'assets/imagenes/bolillo.jpeg',
      qty: 0
    },

    {
      id_producto: 4,
      name: 'Cuernito crujiente',
      price: 22,
      image: 'assets/imagenes/cuernito.jpeg',
      qty: 0
    }

  ];

}



@Component({

  selector: 'app-productos',

  templateUrl: './productos.page.html',

  styleUrls: ['./productos.page.scss'],

  standalone: true,

  imports: [

    IonicModule,

    CommonModule,

    FormsModule,

    RouterLink

  ]

})


export class ProductosPage implements OnInit {


  showMenu = false;


  productos: Producto[] = getFallbackProductos();


  loadingError = '';



  constructor(

    private cartService: CartService,

    private productoService: ProductoService

  ) {}



  ngOnInit() {

    this.cargarProductos();

  }



  toggleMenu() {

    this.showMenu = !this.showMenu;

  }



  closeMenu() {

    this.showMenu = false;

  }





  private cargarProductos() {


    this.productoService.listarProductos()

    .subscribe({


      next: (resp: any) => {



        const lista =

          resp?.data ??

          resp ??

          [];



        console.log(
          'PRODUCTOS API:',
          lista
        );



        if (

          Array.isArray(lista)

          &&

          lista.length > 0

        ) {



          this.productos =

          lista.map((producto: any) => {



            return {



              id_producto:

                producto.id_producto,



              name:

                producto.nombre ??

                producto.name ??

                'Producto',



              price:

                Number(

                  producto.precio ??

                  producto.price ??

                  0

                ),



              image:

                this.obtenerImagen(producto),



              qty: 0



            };



          });



        }

        else {



          this.productos =

            getFallbackProductos();



        }



        this.syncQtyFromCart();



      },



      error: (error) => {



        console.error(

          'Error cargando productos',

          error

        );



        this.productos =

          getFallbackProductos();



        this.syncQtyFromCart();



      }



    });



  }






  private obtenerImagen(producto: any): string {



    let imagen =



      producto.imagen_url ??

      producto.imagen ??

      producto.image ??

      producto.url_imagen ??

      producto.foto ??

      '';





    if (!imagen) {



      return this.getFallbackImage(

        producto.nombre ??

        producto.name ??

        ''

      );

    }





    if (



      imagen.startsWith('http://')

      ||

      imagen.startsWith('https://')

      ||

      imagen.startsWith('assets/')



    ) {



      return imagen;



    }





    return `assets/imagenes/${imagen}`;



  }







  private getFallbackImage(nombre: string): string {



    const texto =

      (nombre || '')

      .toLowerCase();


if (texto.includes('concha')) {
    return 'assets/imagenes/concha.jpeg';
  }


  if (texto.includes('bolillo')) {
    return 'assets/imagenes/bolillo.jpeg';
  }


  if (texto.includes('pastelito')) {
    return 'assets/imagenes/pastelito.png';
  }


  if (texto.includes('mantecada')) {
    return 'assets/imagenes/mantecada.jpeg';
  }


  if (texto.includes('polvoron') || texto.includes('polvorón')) {
    return 'assets/imagenes/polvoron.png';
  }


  if (texto.includes('cuernito') || texto.includes('cuern')) {
    return 'assets/imagenes/cuernito.jpeg';
  }


  if (texto.includes('bisquet')) {
    return 'assets/imagenes/bisquets.webp';
  }


  if (texto.includes('barquillo')) {
    return 'assets/imagenes/barquillo.jpg';
  }


  if (texto.includes('croissant')) {
    return 'assets/imagenes/crossaint.webp';
  }


  if (texto.includes('budin') || texto.includes('budín')) {
    return 'assets/imagenes/budin.jpg';
  }


  if (texto.includes('borracho')) {
    return 'assets/imagenes/borracho.webp';
  }


  if (texto.includes('beso')) {
    return 'assets/imagenes/beso.jpg';
  }


  if (texto.includes('dona rellena') || texto.includes('donas rellenas')) {
    return 'assets/imagenes/donas-rellenas.webp';
  }


  if (texto.includes('dona') || texto.includes('dona azucarada')) {
    return 'assets/imagenes/dona-azucarada.jpg';
  }


  if (texto.includes('oreja')) {
    return 'assets/imagenes/oreja.jpg';
  }


  if (texto.includes('hojaldra')) {
    return 'assets/imagenes/hojaldra.png';
  }


  if (texto.includes('pan de queso') || texto.includes('queso')) {
    return 'assets/imagenes/pan-de-queso.jpg';
  }


  if (texto.includes('rebanadas') || texto.includes('mantecada')) {
    return 'assets/imagenes/rebanadas-con-mantecada.jpg';
  }

    return 'assets/imagenes/cuernito.jpeg';

  }




  private syncQtyFromCart() {



    const items =

      this.cartService.getItems();





    this.productos.forEach(producto => {



      const encontrado =

      items.find(item => {



        if (

          producto.id_producto

          &&

          item.id_producto

        ) {



          return (

            producto.id_producto ===

            item.id_producto

          );



        }



        return (

          item.name ===

          producto.name

        );



      });





      producto.qty =

        encontrado

        ? encontrado.qty

        : 0;



    });



  }







  sumar(producto: Producto) {



    producto.qty++;





    this.cartService.updateItem({

      ...producto,

      id_producto:

        producto.id_producto

    });



  }







  restar(producto: Producto) {



    if (producto.qty > 0) {



      producto.qty--;



      this.cartService.updateItem({

        ...producto,

        id_producto:

          producto.id_producto

      });



    }



  }







  get totalItems(): number {



    return this.productos.reduce(

      (total, producto) =>

        total + producto.qty,

      0

    );



  }







  get totalPrecio(): number {



    return this.productos.reduce(

      (total, producto) =>

        total +

        (

          producto.qty *

          producto.price

        ),

      0

    );



  }



}