import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { DashboardService } from '../../../../services/dashboard.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    RouterModule
  ]
})
export class DashboardPage implements OnInit {


  summary: any[] = [];


  monthlySales: number[] = [];


  months: string[] = [];


  // ESTA VARIABLE FALTABA
  monthlySalesMax = 1;



  constructor(
    private dashboardService: DashboardService
  ) {}



  ngOnInit(): void {

    this.cargarDashboard();

  }




  cargarDashboard(): void {


    this.dashboardService.obtenerResumen()

    .subscribe({


      next:(respuesta)=>{


        console.log(
          "DASHBOARD BACKEND:",
          respuesta
        );



        const data = respuesta.data;



        this.summary = [


          {
            label:'Ventas del día',
            value:'$'+data.ventas_hoy,
            hint:'Ventas registradas hoy',
            icon:'📈'
          },



          {
            label:'Pedidos del día',
            value:data.pedidos_hoy,
            hint:'Pedidos registrados',
            icon:'🧾'
          },



          {
            label:'En preparación',
            value:data.pedidos_preparando,
            hint:'Pedidos activos',
            icon:'🥐'
          },



          {
            label:'Ingresos del mes',
            value:'$'+data.ingresos_mes,
            hint:'Ventas realizadas',
            icon:'💰'
          }


        ];





        this.monthlySales =
        data.ventas_mensuales.map(
          (venta:any)=>Number(venta.total)
        );





        this.months =
        data.ventas_mensuales.map(
          (venta:any)=>venta.mes
        );





        // CALCULAR ALTURA DE GRÁFICA

        this.monthlySalesMax =
        Math.max(
          ...this.monthlySales,
          1
        );




      },



      error:(error)=>{


        console.error(
          "ERROR DASHBOARD:",
          error
        );


      }


    });



  }




}