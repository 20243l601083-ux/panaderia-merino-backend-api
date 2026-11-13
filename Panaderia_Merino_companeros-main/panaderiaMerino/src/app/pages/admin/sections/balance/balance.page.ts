import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';


import { BalanceService } from '../../../../services/balance.service';



@Component({

  selector:'app-balance',

  templateUrl:'./balance.page.html',

  styleUrls:['./balance.page.scss'],

  standalone:true,

  imports:[

    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule

  ]

})


export class BalancePage implements OnInit {



  period = 'mes';



  summary = {


    ventas:'0.00',

    gastos:'0.00',

    ganancias:'0.00'


  };




  constructor(

    private balanceService: BalanceService

  ) {}





  ngOnInit(): void {


    this.cargarBalance();


  }






  cargarBalance(){


    this.balanceService.obtenerBalance()

    .subscribe({



      next:(respuesta)=>{


        console.log(
          'BALANCE BACKEND:',
          respuesta
        );



        const data =
        respuesta.data;



        this.summary = {


          ventas:
          data.ventas,



          gastos:
          data.gastos,



          ganancias:
          data.ganancias


        };



      },



      error:(error)=>{


        console.error(

          'ERROR BALANCE:',
          error

        );


      }



    });



  }





  setPeriod(periodo:string){


    this.period = periodo;


    // Por ahora el backend entrega balance general
    // después podemos agregar filtros por fecha


    this.cargarBalance();


  }



}