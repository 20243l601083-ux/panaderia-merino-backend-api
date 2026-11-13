import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { PedidoService } from '../../../../services/pedido.service';


@Component({
  selector: 'app-pedidos-cliente',
  templateUrl: './pedidos-cliente.page.html',
  styleUrls: ['./pedidos-cliente.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class PedidosClientePage implements OnInit {


  searchText = '';

  isModalOpen = false;

  editingIndex: number | null = null;



  form = {

    cliente: '',
    fecha: '',
    producto: '',
    total: '',
    estado: ''

  };



  pedidos: any[] = [];



  summary = [

    {
      label: 'Pedidos del día',
      value: '0',
      hint: 'Registrados'
    },

    {
      label: 'En preparación',
      value: '0',
      hint: 'Pedidos activos'
    },

    {
      label: 'Ingresos',
      value: '$0',
      hint: 'Ventas realizadas'
    }

  ];





  constructor(
    private pedidoService: PedidoService
  ) {}





  ngOnInit(): void {

    this.cargarPedidos();

  }







  cargarPedidos(){


    this.pedidoService.listarPedidos()

    .subscribe({


      next:(resp)=>{


        console.log(
          'PEDIDOS BACKEND:',
          JSON.stringify(resp,null,2)
        );



        this.pedidos = resp.data.map(
          (pedido:any)=>({


            id:
            pedido.id_pedido,


            cliente:
            pedido.cliente?.usuario?.nombre
            || 'Cliente',


            fecha:
            pedido.fecha_pedido
            || '',



            producto:
            pedido.detalles
            ?.map(
              (detalle:any)=>
              detalle.producto?.nombre
            )
            .join(', ')
            ||
            'Sin productos',



            total:
            '$'+pedido.total,



            estado:
            pedido.estado



          })
        );



        this.actualizarResumen();


      },



      error:(error)=>{


        console.error(
          'ERROR CARGANDO PEDIDOS:',
          error
        );


      }


    });


  }








  actualizarResumen(){


    this.summary[0].value =
    this.pedidos.length.toString();



    this.summary[1].value =
    this.pedidos.filter(
      p =>
      p.estado === 'preparando'
      ||
      p.estado === 'En preparación'
    )
    .length
    .toString();



    let total = 0;


    this.pedidos.forEach(
      pedido=>{

        total += Number(
          pedido.total
          .replace('$','')
        );

      }
    );



    this.summary[2].value =
    '$'+total.toFixed(2);



  }







  get filteredPedidos(){


    const term =
    this.searchText.toLowerCase();



    return this.pedidos.filter(
      pedido =>


      pedido.cliente
      ?.toLowerCase()
      .includes(term)



      ||



      pedido.producto
      ?.toLowerCase()
      .includes(term)



      ||



      pedido.estado
      ?.toLowerCase()
      .includes(term)


    );


  }








  openCreate(){


    this.editingIndex = null;


    this.form = {

      cliente:'',
      fecha:'',
      producto:'',
      total:'',
      estado:''

    };


    this.isModalOpen = true;


  }







  openEdit(pedido:any){


    this.editingIndex =
    this.pedidos.findIndex(
      item =>
      item.id === pedido.id
    );



    this.form = {

      cliente:
      pedido.cliente,


      fecha:
      pedido.fecha,


      producto:
      pedido.producto,


      total:
      pedido.total,


      estado:
      pedido.estado

    };



    this.isModalOpen = true;


  }








  savePedido(){


    console.log(
      'GUARDAR PEDIDO:',
      this.form
    );

    // Transform form data to match backend schema
    const id_cliente = Number(this.form.cliente);

    if (!id_cliente || isNaN(id_cliente)) {
      console.error('Debe indicar un id_cliente numérico en el campo Cliente');
      return;
    }

    const id_producto = Number(this.form.producto);

    if (!id_producto || isNaN(id_producto)) {
      console.error('Debe indicar un id_producto numérico en el campo Producto');
      return;
    }

    const pedidoData = {
      id_cliente: id_cliente,
      metodo_pago: 'efectivo', // default value
      direccion_entrega: this.form.cliente,
      estado: this.form.estado || 'pendiente',
      detalles: [
        {
          id_producto: id_producto,
          cantidad: 1
        }
      ]
    };

    if (this.editingIndex === null) {
      // Crear nuevo pedido
      this.pedidoService.crearPedido(pedidoData).subscribe({
        next: (resp) => {
          console.log('Pedido creado:', resp);
          this.cargarPedidos();
          this.isModalOpen = false;
        },
        error: (err) => {
          console.error('Error creando pedido:', err);
        }
      });
    } else {
      // Actualizar pedido existente
      const pedido = this.pedidos[this.editingIndex];
      this.pedidoService.actualizarPedido(pedido.id, pedidoData).subscribe({
        next: (resp) => {
          console.log('Pedido actualizado:', resp);
          this.cargarPedidos();
          this.isModalOpen = false;
        },
        error: (err) => {
          console.error('Error actualizando pedido:', err);
        }
      });
    }


  }








  deletePedido(pedido:any){


    this.pedidoService
    .eliminarPedido(pedido.id)

    .subscribe({


      next:()=>{


        this.cargarPedidos();


      },


      error:(err)=>{


        console.error(
          'ERROR ELIMINANDO PEDIDO:',
          err
        );


      }


    });



  }




}