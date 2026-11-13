import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

import { PedidoService } from '../../services/pedido.service';
import { calculateTrackingProgress, Coordinates } from './tracking.utils';


declare const L: any;


@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.page.html',
  styleUrls: ['./seguimiento.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    RouterLink
  ]
})


export class SeguimientoPage implements OnInit, AfterViewInit, OnDestroy {


  showMenu = false;


  pedidoId = '1';

  tracking:any = null;


  currentLocation: Coordinates = {
    lat: 19.0438,
    lng: -98.1983
  };


  startPoint: Coordinates = {
    lat: 19.0438,
    lng: -98.1983
  };


  destinationPoint: Coordinates = {
    lat: 19.0444,
    lng: -98.1987
  };


  progress = 0;

  status = 'Pedido en preparación';

  lastUpdate:any = new Date();


  isSimulating = false;



  private map:any;

  private driverMarker:any;

  private destinationMarker:any;

  private routeLine:any;

  private simulationTimer:any;

  private eventSource?: EventSource;



  constructor(
    private pedidoService:PedidoService
  ){}



  ngOnInit(){

    this.loadInitialTracking();

  }




  ngAfterViewInit(){

    setTimeout(()=>{

      this.initMap();

      this.connectToTracking();

    },500);

  }




  ngOnDestroy(){

    if(this.eventSource){

      this.eventSource.close();

    }


    if(this.simulationTimer){

      clearInterval(this.simulationTimer);

    }


  }





  toggleMenu(){

    this.showMenu=!this.showMenu;

  }



  closeMenu(){

    this.showMenu=false;

  }






  private initMap(){


    const mapDiv=document.getElementById('map');


    if(!mapDiv){

      return;

    }



    if(typeof L !== 'undefined'){

      this.buildMap();

      return;

    }



    const script=document.createElement('script');


    script.src=
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';


    script.onload=()=>{

      this.buildMap();

    };


    document.head.appendChild(script);


  }







  private buildMap(){


    const mapDiv=document.getElementById('map');


    if(!mapDiv || typeof L==='undefined'){

      return;

    }




    if(!this.map){



      this.map=L.map('map')
      .setView(
        [
          this.currentLocation.lat,
          this.currentLocation.lng
        ],
        13
      );




      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {

          maxZoom:19,

          attribution:
          '© OpenStreetMap'

        }

      ).addTo(this.map);



    }



    setTimeout(()=>{

      this.map.invalidateSize();

    },500);



    this.renderTracking();



  }







  private renderTracking(){


    if(!this.map){

      return;

    }




    if(this.routeLine){

      this.routeLine.remove();

    }


    if(this.driverMarker){

      this.driverMarker.remove();

    }


    if(this.destinationMarker){

      this.destinationMarker.remove();

    }






    const route=[


      [
        this.startPoint.lat,
        this.startPoint.lng
      ],


      [
        19.0440,
        -98.1985
      ],


      [
        19.0442,
        -98.1986
      ],


      [
        this.destinationPoint.lat,
        this.destinationPoint.lng
      ]


    ];





    this.routeLine=L.polyline(

      route,

      {

        color:'#d97b4a',

        weight:6

      }

    )
    .addTo(this.map);






    this.destinationMarker=
    L.marker(

      [

        this.destinationPoint.lat,

        this.destinationPoint.lng

      ]

    )
    .addTo(this.map);






    this.driverMarker=
    L.marker(

      [

        this.currentLocation.lat,

        this.currentLocation.lng

      ]

    )
    .addTo(this.map);




    this.driverMarker.bindPopup(

      `
      <b>Repartidor</b><br>
      ${this.tracking?.driverName || 'Carlos López'}
      <br>
      Progreso: ${this.progress}%
      `

    );





    this.map.fitBounds(

      this.routeLine.getBounds(),

      {
        padding:[30,30]
      }

    );


  }







  private loadInitialTracking(){


    this.pedidoService
    .getSeguimiento(this.pedidoId)
    .subscribe({

      next:(response)=>{


        const data=response?.data || response;


        this.tracking=data;



        if(data?.currentLocation){

          this.currentLocation=data.currentLocation;

        }



        this.progress=
        calculateTrackingProgress(

          this.currentLocation,

          this.startPoint,

          this.destinationPoint

        );



        this.status=
        data?.estado ||
        'Pedido en preparación';



        this.lastUpdate=
        new Date();



      },



      error:()=>{


        this.status=
        'Modo demostración';



      }


    });



  }







  private connectToTracking(){


    try{


      this.eventSource=
      this.pedidoService
      .getTrackingStream(this.pedidoId);



      this.eventSource.onmessage=(event)=>{


        const data=
        JSON.parse(event.data);


        this.applyTracking(data);


      };



    }catch(e){


      console.log(
        'Sin conexión SSE'
      );


    }


  }







  private applyTracking(data:any){


    if(!data){

      return;

    }



    this.currentLocation=
    data.currentLocation ||
    this.currentLocation;



    this.progress=
    data.progress ??
    calculateTrackingProgress(

      this.currentLocation,

      this.startPoint,

      this.destinationPoint

    );



    this.status=
    data.estado ||
    'En camino';



    this.lastUpdate=
    new Date();



    this.renderTracking();


  }







  simularRecorrido(){



    if(this.isSimulating){

      return;

    }


    this.isSimulating=true;



    let paso=0;


    const pasos=8;



    this.simulationTimer=
    setInterval(()=>{



      paso++;



      this.currentLocation={


        lat:
        this.startPoint.lat +
        (
          (this.destinationPoint.lat -
          this.startPoint.lat)
          /
          pasos
        )
        *
        paso,



        lng:
        this.startPoint.lng +
        (
          (this.destinationPoint.lng -
          this.startPoint.lng)
          /
          pasos
        )
        *
        paso


      };




      this.progress=
      calculateTrackingProgress(

        this.currentLocation,

        this.startPoint,

        this.destinationPoint

      );




      this.status=
      paso>=pasos
      ?
      'Pedido entregado'
      :
      'Repartidor en camino';




      this.renderTracking();




      if(paso>=pasos){


        clearInterval(
          this.simulationTimer
        );


        this.isSimulating=false;


      }



    },1500);



  }







  usarMiUbicacion(){



    navigator.geolocation.getCurrentPosition(

      position=>{


        this.currentLocation={


          lat:
          position.coords.latitude,


          lng:
          position.coords.longitude


        };



        this.progress=
        calculateTrackingProgress(

          this.currentLocation,

          this.startPoint,

          this.destinationPoint

        );



        this.status=
        'Ubicación actualizada';



        this.renderTracking();



      },



      ()=>{


        this.status=
        'No se pudo obtener ubicación';


      }


    );



  }



}