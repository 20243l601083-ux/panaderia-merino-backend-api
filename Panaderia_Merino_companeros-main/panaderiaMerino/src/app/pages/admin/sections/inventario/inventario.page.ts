import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { ProductoService } from '../../../../services/producto.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class InventarioPage implements OnInit {

  searchText = '';

  isModalOpen = false;

  editingIndex: number | null = null;

  productos: any[] = [];

  form = {

    producto: '',
    categoria: '',
    precio: '',
    cantidad: '',

    id_categoria: 1,
    descripcion: '',
    imagen_url: ''

  };


  summary = [

    {
      label: 'Productos activos',
      value: '0',
      hint: 'En stock'
    },

    {
      label: 'Stock bajo',
      value: '0',
      hint: 'Reabastecer'
    },

    {
      label: 'Valor estimado',
      value: '$0',
      hint: 'Inventario'
    }

  ];


  constructor(
    private productoService: ProductoService
  ) {}


  ngOnInit(): void {

    this.cargarProductos();

  }



  cargarProductos() {


    this.productoService.listarProductos()
    .subscribe({

      next:(resp:any)=>{


        console.log(
          "PRODUCTOS BACKEND:",
          resp
        );


        this.productos = resp.data.map((p:any)=>({


          id:
          p.id_producto,


          producto:
          p.nombre,


          categoria:
          p.categoria?.nombre || 'Sin categoría',


          precio:
          '$'+Number(p.precio).toFixed(2),


          cantidad:
          p.stock,


          id_categoria:
          p.id_categoria,


          descripcion:
          p.descripcion,


          imagen_url:
          p.imagen_url || this.asignarImagen(p.nombre),


          // Detecta si venía vacío de BD
          sinImagen:
          !p.imagen_url,


          estado:
          p.estado


        }));


        // GUARDAR IMÁGENES AUTOMÁTICAMENTE
        this.guardarImagenesFaltantes();


        this.actualizarResumen();



      },


      error:(err)=>{

        console.error(
          "ERROR PRODUCTOS:",
          err
        );

      }


    });


  }




  private guardarImagenesFaltantes(){


    this.productos.forEach((producto:any)=>{


      if(producto.sinImagen && producto.id){


        const imagen =
        this.asignarImagen( producto.producto);


        this.productoService
        .actualizarProducto(

          producto.id,

          {

            id_categoria:
            producto.id_categoria,


            nombre:
            producto.producto,


            descripcion:
            producto.descripcion,


            precio:
            Number(
              String(producto.precio)
              .replace('$','')
            ),


            stock:
            producto.cantidad,


            imagen_url:
            imagen

          }

        )
        .subscribe({


          next:()=>{


            console.log(
              'Imagen guardada:',
              producto.producto,
              imagen
            );


          },


          error:(err)=>{


            console.error(
              'ERROR GUARDANDO IMAGEN:',
              err
            );


          }


        });


      }


    });


  }




  private asignarImagen(nombre:string):string{


    const producto =
    nombre.toLowerCase();



    if(producto.includes('barquillo'))
    return 'assets/imagenes/barquillo.jpg';



    if(producto.includes('beso'))
    return 'assets/imagenes/beso.jpg';



    if(producto.includes('bisquet'))
    return 'assets/imagenes/bisquets.webp';



    if(producto.includes('bolillo'))
    return 'assets/imagenes/bolillo.jpeg';



    if(producto.includes('borracho'))
    return 'assets/imagenes/borracho.webp';



    if(producto.includes('budin') || producto.includes('budín'))
    return 'assets/imagenes/budin.jpg';



    if(producto.includes('concha'))
    return 'assets/imagenes/concha.jpeg';



    if(producto.includes('croissant') ||
       producto.includes('crossaint'))
    return 'assets/imagenes/crossaint.webp';



    if(producto.includes('cuernito'))
    return 'assets/imagenes/cuernito.jpeg';



    if(producto.includes('donas rellenas'))
    return 'assets/imagenes/donas-rellenas.webp';


    if(producto.includes('dona azucarada'))
    return 'assets/imagenes/dona-azucarada.jpg';


    if(producto.includes('hojaldra'))
    return 'assets/imagenes/hojaldra.png';


    if(producto.includes('mantecada'))
    return 'assets/imagenes/mantecada.jpeg';


    if(producto.includes('oreja'))
    return 'assets/imagenes/oreja.jpg';


    if(producto.includes('queso'))
    return 'assets/imagenes/pan-de-queso.jpg';


    if(producto.includes('pastel'))
    return 'assets/imagenes/pastelito.png';


    if(producto.includes('polvoron'))
    return 'assets/imagenes/polvoron.png';


    if(producto.includes('rebanada'))
    return 'assets/imagenes/rebanadas-con-mantecada.jpg';


    return 'assets/imagenes/concha.jpeg';

  }




  actualizarResumen(){


    const activos =
    this.productos.filter(
      p=>p.estado
    ).length;



    const bajo =
    this.productos.filter(
      p=>Number(p.cantidad)<=5
    ).length;



    const valor =
    this.productos.reduce(

      (total,p)=>

      total +

      (
        Number(
          String(p.precio)
          .replace('$','')
        )
        *
        Number(p.cantidad)
      ),

      0

    );



    this.summary[0].value =
    activos.toString();



    this.summary[1].value =
    bajo.toString();



    this.summary[2].value =
    '$'+valor.toFixed(2);


  }



  get filteredProductos(){


    const term =
    this.searchText.toLowerCase();


    return this.productos.filter(

      p=>

      p.producto
      .toLowerCase()
      .includes(term)

      ||

      p.categoria
      .toLowerCase()
      .includes(term)

    );

  }



  openCreate(){


    this.editingIndex=null;


    this.form={

      producto:'',
      categoria:'',
      precio:'',
      cantidad:'',
      id_categoria:1,
      descripcion:'',
      imagen_url:''

    };


    this.isModalOpen=true;


  }



  openEdit(producto:any){


    this.editingIndex =
    this.productos.findIndex(
      p=>p.id===producto.id
    );


    this.form={

      producto: producto.producto,

      categoria: producto.categoria,

      precio:
      Number(
        producto.precio.replace('$','')
      )
      .toFixed(2),

      cantidad:
      producto.cantidad,

      id_categoria:
      producto.id_categoria,

      descripcion:
      producto.descripcion || '',

      imagen_url:
      producto.imagen_url || ''

    };


    this.isModalOpen=true;


  }




  saveProducto(){


    const datos={


      id_categoria:
      this.form.id_categoria,


      nombre:
      this.form.producto,


      descripcion:
      this.form.descripcion,


      precio:
      Number(this.form.precio),


      stock:
      Number(this.form.cantidad),


      imagen_url:
      this.asignarImagen(
        this.form.producto
      )


    };


    console.log(
      "DATOS QUE ENVIO AL BACKEND:",
      datos
    );



    if(this.editingIndex===null){


      this.productoService
      .crearProducto(datos)
      .subscribe({

        next:()=>{

          this.cargarProductos();

          this.isModalOpen=false;

        },

        error:(err)=>{

          console.error(
            "ERROR CREAR:",
            err
          );

        }

      });



    }else{


      const id =
      this.productos[
        this.editingIndex
      ].id;



      this.productoService
      .actualizarProducto(id,datos)
      .subscribe({

        next:()=>{

          this.cargarProductos();

          this.isModalOpen=false;

        },

        error:(err)=>{

          console.error(
            "ERROR ACTUALIZAR:",
            err
          );

        }

      });



    }


  }




  deleteProducto(producto:any){


    this.productoService
    .desactivarProducto(producto.id)
    .subscribe({

      next:()=>{

        this.cargarProductos();

      },


      error:(err)=>{

        console.error(
          "ERROR DESACTIVAR:",
          err
        );

      }

    });


  }


}