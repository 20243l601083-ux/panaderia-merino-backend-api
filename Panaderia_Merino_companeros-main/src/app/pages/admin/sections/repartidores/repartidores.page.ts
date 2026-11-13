import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { RepartidorService } from '../../../../services/repartidor.service';
import { UsuarioService } from '../../../../services/usuario.service';


@Component({
  selector: 'app-repartidores',
  templateUrl: './repartidores.page.html',
  styleUrls: ['./repartidores.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class RepartidoresPage implements OnInit {


  searchText = '';

  isModalOpen = false;


  editingIndex: number | null = null;

  repartidores:any[] = [];

  form:any = {
    id_repartidor: null,
    id_usuario: null,
    telefono: '',
    disponibilidad: 'libre',
    ubicacion_actual_lat: '',
    ubicacion_actual_lng: ''
  };





  summary = [

    {
      label:'Repartidores',
      value:'0',
      hint:'Registrados'
    },

    {
      label:'Disponibles',
      value:'0',
      hint:'Libres'
    },

    {
      label:'Ocupados',
      value:'0',
      hint:'En ruta'
    }

  ];






  constructor(
    private repartidorService: RepartidorService,
    private usuarioService: UsuarioService
  ){}





  ngOnInit():void{

    this.cargarRepartidores();

  }







  cargarRepartidores(){


    this.repartidorService
    .listarRepartidores()

    .subscribe({

      next:(resp)=>{


        console.log(
          'REPARTIDORES BACKEND:',
          resp
        );


        this.repartidores = resp.data;


        this.actualizarResumen();


      },


      error:(error)=>{


        console.error(
          'ERROR REPARTIDORES:',
          error
        );


      }


    });


  }







  actualizarResumen(){


    this.summary[0].value =
    this.repartidores.length.toString();



    this.summary[1].value =
    this.repartidores.filter(
      r => r.disponibilidad === 'libre'
    )
    .length
    .toString();




    this.summary[2].value =
    this.repartidores.filter(
      r => r.disponibilidad === 'ocupado'
    )
    .length
    .toString();


  }








  get filteredRepartidores(){


    const term =
    this.searchText.toLowerCase();



    return this.repartidores.filter(

      r =>

      r.usuario?.nombre
      ?.toLowerCase()
      .includes(term)


      ||

      r.telefono
      ?.includes(term)


      ||

      r.disponibilidad
      ?.toLowerCase()
      .includes(term)


    );


  }








  openCreate(){

    this.editingIndex = null;

    this.form = {
      id_repartidor: null,
      id_usuario: null,
      telefono: '',
      disponibilidad: 'libre',
      ubicacion_actual_lat: '',
      ubicacion_actual_lng: ''
    };

    this.isModalOpen = true;

  }








  openEdit(repartidor:any){


    this.editingIndex =
    this.repartidores.findIndex(

      r =>
      r.id_repartidor === repartidor.id_repartidor

    );



    this.form = {
      id_repartidor: repartidor.id_repartidor,
      id_usuario: repartidor.id_usuario ?? repartidor.usuario?.id_usuario ?? null,
      telefono: repartidor.telefono,
      disponibilidad: repartidor.disponibilidad,
      ubicacion_actual_lat: repartidor.ubicacion_actual_lat,
      ubicacion_actual_lng: repartidor.ubicacion_actual_lng
    };



    this.isModalOpen = true;


  }








  saveRepartidor(){

    const repartidorPayload = {
      id_usuario: this.form.id_usuario ? Number(this.form.id_usuario) : null,
      telefono: this.form.telefono,
      disponibilidad: this.form.disponibilidad,
      ubicacion_actual_lat: this.form.ubicacion_actual_lat ? Number(this.form.ubicacion_actual_lat) : null,
      ubicacion_actual_lng: this.form.ubicacion_actual_lng ? Number(this.form.ubicacion_actual_lng) : null
    };

    if(this.editingIndex !== null && this.form.id_repartidor){
      this.repartidorService
        .actualizarRepartidor(this.form.id_repartidor, repartidorPayload)
        .subscribe({
          next:()=>{
            this.isModalOpen = false;
            this.cargarRepartidores();
          },
          error:(err:any)=>{
            console.error('ERROR ACTUALIZANDO REPARTIDOR:', err);
          }
        });

    } else {
      // If no id_usuario provided, create a backend usuario first
      if (!repartidorPayload.id_usuario) {
        const tempEmail = `repartidor_${Date.now()}@example.com`;
        const usuario = {
          nombre: 'Repartidor',
          email: tempEmail,
          password: 'Default123',
          rol: 'repartidor'
        };

        this.usuarioService.crearUsuario(usuario).subscribe({
          next: (resp:any) => {
            const id_usuario = resp?.data?.id_usuario ?? resp?.id_usuario ?? null;
            if (id_usuario) {
              repartidorPayload.id_usuario = id_usuario;
              this.repartidorService.crearRepartidor(repartidorPayload).subscribe({
                next: ()=>{
                  this.isModalOpen = false;
                  this.cargarRepartidores();
                },
                error:(err:any)=>{
                  console.error('ERROR CREANDO REPARTIDOR DESPUES DE USUARIO:', err);
                }
              });
            } else {
              console.error('No se obtuvo id_usuario al crear usuario repartidor');
            }
          },
          error: (err:any) => {
            console.error('Error creando usuario para repartidor:', err);
          }
        });

      } else {
        this.repartidorService
          .crearRepartidor(repartidorPayload)
          .subscribe({
            next:()=>{
              this.isModalOpen = false;
              this.cargarRepartidores();
            },
            error:(err:any)=>{
              console.error('ERROR CREANDO REPARTIDOR:', err);
            }
          });
      }
    }

  }








  deleteRepartidor(repartidor:any){


    this.repartidorService
    .eliminarRepartidor(
      repartidor.id_repartidor
    )

    .subscribe({

      next:()=>{


        this.cargarRepartidores();


      },

      error:(err)=>{


        console.error(err);


      }


    });



  }




}