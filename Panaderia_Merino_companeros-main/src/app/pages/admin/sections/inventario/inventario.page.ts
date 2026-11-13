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

    producto:'',
    categoria:'',
    precio:'',
    cantidad:'',

    id_categoria:1,
    descripcion:''
  };



  summary = [

    {
      label:'Productos activos',
      value:'0',
      hint:'En stock'
    },

    {
      label:'Stock bajo',
      value:'0',
      hint:'Reabastecer'
    },

    {
      label:'Valor estimado',
      value:'$0',
      hint:'Inventario'
    }

  ];



  constructor(
    private productoService: ProductoService
  ){}



  ngOnInit(): void {

    this.cargarProductos();

  }




  cargarProductos(){


    this.productoService.listarProductos()
    .subscribe({

      next:(resp)=>{


        console.log(
          'PRODUCTOS BACKEND:',
          resp
        );


        this.productos = resp.data.map((p:any)=>({

          id:p.id_producto,

          producto:p.nombre,

          categoria:
          p.categoria?.nombre || 'Sin categoría',

          precio:
          '$'+p.precio,

          cantidad:
          p.stock,


          id_categoria:
          p.id_categoria,

          descripcion:
          p.descripcion,

          estado:
          p.estado


        }));



        this.actualizarResumen();


      },


      error:(err)=>{

        console.error(
          'ERROR PRODUCTOS:',
          err
        );

      }


    });


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
      total + Number(
        String(p.precio)
        .replace('$','')
      ) *
      Number(p.cantidad),

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
      descripcion:''

    };


    this.isModalOpen=true;


  }





  openEdit(producto:any){


    this.editingIndex =
    this.productos.findIndex(
      p=>p.id===producto.id
    );



    this.form={


      producto:
      producto.producto,


      categoria:
      producto.categoria,


      precio:
      producto.precio
      .replace('$',''),


      cantidad:
      producto.cantidad,


      id_categoria:
      producto.id_categoria,


      descripcion:
      producto.descripcion || ''


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
      Number(this.form.cantidad)


    };



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
            'ERROR CREAR:',
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
            'ERROR ACTUALIZAR:',
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
          'ERROR DESACTIVAR:',
          err
        );

      }


    });


  }



}