import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { EmpleadoService } from '../../../../services/empleado.service';



@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.page.html',
  styleUrls: ['./empleados.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class EmpleadosPage implements OnInit {

  searchText = '';

  isModalOpen = false;

  editingIndex:number|null = null;


  form = {

    nombre:'',
    telefono:'',
    puesto:'',
    salario:'',
    fecha_contratacion:''

  };



  empleados:any[] = [];



  summary = [

    {
      label:'Equipo',
      value:'0',
      hint:'Activos'
    },

    {
      label:'Salario promedio',
      value:'$0',
      hint:'Mensual'
    },

    {
      label:'Puestos',
      value:'0',
      hint:'Registrados'
    }

  ];




  constructor(
    private empleadoService:EmpleadoService
  ){}



  ngOnInit():void{

    this.cargarEmpleados();

  }




  cargarEmpleados(){


    this.empleadoService.listarEmpleados()

    .subscribe({

      next:(resp)=>{


        console.log(
          'EMPLEADOS BACKEND:',
          JSON.stringify(resp,null,2)
        );


        this.empleados = resp.data;


        this.actualizarResumen();



      },


      error:(err)=>{

        console.error(
          'ERROR CARGANDO EMPLEADOS',
          err
        );

      }


    });


  }




  actualizarResumen(){


    this.summary[0].value =
    this.empleados.length.toString();


    let total = 0;


    this.empleados.forEach(

      empleado=>{

        total += Number(
          empleado.salario
        );

      }

    );



    let promedio = 
    this.empleados.length
    ?
    total / this.empleados.length
    :
    0;



    this.summary[1].value =
    '$'+promedio.toFixed(2);



    this.summary[2].value =
    new Set(
      this.empleados.map(
        e=>e.puesto
      )
    )
    .size
    .toString();


  }




  get filteredEmpleados(){


    const term =
    this.searchText.toLowerCase();


    return this.empleados.filter(

      empleado=>


      empleado.nombre
      ?.toLowerCase()
      .includes(term)


      ||


      empleado.puesto
      ?.toLowerCase()
      .includes(term)


      ||


      empleado.telefono
      ?.toLowerCase()
      .includes(term)


    );

  }




  openCreate(){


    this.editingIndex=null;



    this.form={

      nombre:'',
      telefono:'',
      puesto:'',
      salario:'',
      fecha_contratacion:''

    };


    this.isModalOpen=true;


  }




  openEdit(empleado:any){


    this.editingIndex =
    this.empleados.findIndex(

      e=>
      e.id_empleado === empleado.id_empleado

    );



    this.form={

      nombre:empleado.nombre,

      telefono:empleado.telefono,

      puesto:empleado.puesto,

      salario:empleado.salario,

      fecha_contratacion:
      empleado.fecha_contratacion

    };


    this.isModalOpen=true;


  }




  saveEmpleado(){


    if(!this.form.nombre.trim())
      return;


    if(this.editingIndex===null){

      const datosCrear = {
        nombre: this.form.nombre,
        telefono: this.form.telefono,
        puesto: this.form.puesto,
        salario: this.form.salario ? Number(this.form.salario) : null,
        fecha_contratacion: this.form.fecha_contratacion || null
      };

      this.empleadoService
      .crearEmpleado(datosCrear)

      .subscribe({

        next:()=>{

          this.cargarEmpleados();

          this.isModalOpen=false;

        },


        error:(err)=>{

          console.error(
            err
          );

        }


      });



    }else{


      const id = this.empleados[this.editingIndex].id_empleado;

      const datosActualizar = {
        nombre: this.form.nombre,
        telefono: this.form.telefono,
        puesto: this.form.puesto,
        salario: this.form.salario ? Number(this.form.salario) : null,
        fecha_contratacion: this.form.fecha_contratacion || null
      };

      this.empleadoService.actualizarEmpleado(
        id,
        datosActualizar
      )

      .subscribe({

        next:()=>{

          this.cargarEmpleados();

          this.isModalOpen=false;

        }

      });


    }


  }




  deleteEmpleado(empleado:any){


    this.empleadoService
    .eliminarEmpleado(
      empleado.id_empleado
    )

    .subscribe({

      next:()=>{

        this.cargarEmpleados();

      },


      error:(err)=>{

        console.error(err);

      }


    });


  }




}
