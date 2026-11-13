import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { ClienteService } from '../../../../services/cliente.service';
import { UsuarioService } from '../../../../services/usuario.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class ClientesPage implements OnInit {


  searchText = '';

  isModalOpen = false;

  editingIndex: number | null = null;



  form = {

    nombre: '',
    telefono: '',
    direccion: '',
    correo: ''

  };



  // Usuarios que vienen del backend
  clients: any[] = [];



  summary = [

    {
      label: 'Clientes activos',
      value: '0',
      hint: 'Registrados'
    },

    {
      label: 'Nuevos hoy',
      value: '0',
      hint: 'Este día'
    },

    {
      label: 'Retención',
      value: '94%',
      hint: 'Satisfacción'
    }

  ];




  constructor(
    private clienteService: ClienteService,
    private usuarioService: UsuarioService
  ) {}




  ngOnInit() {

    this.cargarClientes();

  }





  cargarClientes() {


    this.clienteService.listarClientes()
      .subscribe({

        next: (resp) => {


          console.log(
            'CLIENTES BACKEND:',
            JSON.stringify(resp, null, 2)
          );



          // Solo clientes
          this.clients = resp.data.map((cliente: any) => ({
            id_cliente: cliente.id_cliente,
            id_usuario: cliente.id_usuario,

            nombre: cliente.usuario.nombre,
            email: cliente.usuario.email,

            telefono: cliente.telefono || '',
            direccion: cliente.direccion || '',

            rol: cliente.usuario.rol,
            estado: cliente.usuario.estado
          }));


          this.summary[0].value =
            this.clients.length.toString();


        },


        error: (err) => {


          console.error(
            'ERROR CARGANDO CLIENTES:',
            err
          );


        }


      });


  }





  get filteredClients() {


    const term =
      this.searchText.toLowerCase();



    return this.clients.filter(cliente =>


      cliente.nombre
      ?.toLowerCase()
      .includes(term)


      ||


      cliente.email
      ?.toLowerCase()
      .includes(term)


    );


  }





  openCreate() {


    this.editingIndex = null;


    this.form = {

      nombre: '',
      telefono: '',
      direccion: '',
      correo: ''

    };


    this.isModalOpen = true;


  }





  openEdit(cliente:any) {


    this.editingIndex =
      this.clients.findIndex(
        item =>
        item.id_usuario === cliente.id_usuario
      );



    this.form = {


      nombre: cliente.nombre,

      telefono:
      cliente.telefono || '',


      direccion:
      cliente.direccion || '',


      correo:
      cliente.email


    };



    this.isModalOpen = true;


  }





  saveClient() {


    console.log(
      'GUARDAR CLIENTE:',
      this.form
    );
    const usuarioData = {
      nombre: this.form.nombre,
      email: this.form.correo,
      rol: 'cliente',
      // backend requires a password on register; provide a safe default for admin-created accounts
      password: 'Default123'
    };

    if (this.editingIndex === null) {
      // Crear nuevo usuario/cliente
      this.usuarioService.crearUsuario(usuarioData).subscribe({
        next: (resp: any) => {
          console.log('Usuario creado:', resp);

          // backend crea el perfil de cliente automáticamente, update telefono/direccion si vienen en el form
          const id_usuario = resp?.data?.id_usuario ?? resp?.id_usuario ?? null;

          if (id_usuario) {
            this.clienteService.obtenerClientePorUsuario(id_usuario).subscribe({
              next: (cresp: any) => {
                const cliente = cresp.data;
                if (cliente && (this.form.telefono || this.form.direccion)) {
                  this.clienteService.actualizarCliente(cliente.id_cliente, {
                    telefono: this.form.telefono,
                    direccion: this.form.direccion
                  }).subscribe({
                    next: () => {
                      this.cargarClientes();
                      this.isModalOpen = false;
                    },
                    error: (err) => {
                      console.error('Error actualizando cliente:', err);
                      this.cargarClientes();
                      this.isModalOpen = false;
                    }
                  });
                } else {
                  this.cargarClientes();
                  this.isModalOpen = false;
                }
              },
              error: (err) => {
                console.error('Error obteniendo cliente recien creado:', err);
                this.cargarClientes();
                this.isModalOpen = false;
              }
            });
          } else {
            this.cargarClientes();
            this.isModalOpen = false;
          }

        },
        error: (err) => {
          console.error('Error creando usuario:', err);
        }
      });
    } else {
      // Actualizar usuario existente
      const cliente = this.clients[this.editingIndex];
      this.usuarioService.actualizarUsuario(cliente.id_usuario, usuarioData).subscribe({
        next: (resp) => {
          console.log('Usuario actualizado:', resp);
          // actualizar datos del perfil (telefono/direccion) requiere actualizar el cliente
          this.clienteService.obtenerClientePorUsuario(cliente.id_usuario).subscribe({
            next: (cresp:any) => {
              const perfil = cresp.data;
              if (perfil) {
                this.clienteService.actualizarCliente(perfil.id_cliente, {
                  telefono: this.form.telefono,
                  direccion: this.form.direccion
                }).subscribe({
                  next: () => {
                    this.cargarClientes();
                    this.isModalOpen = false;
                  },
                  error: (err) => {
                    console.error('Error actualizando cliente:', err);
                    this.cargarClientes();
                    this.isModalOpen = false;
                  }
                });
              } else {
                this.cargarClientes();
                this.isModalOpen = false;
              }
            },
            error: (err) => {
              console.error('Error obteniendo cliente para actualizar:', err);
              this.cargarClientes();
              this.isModalOpen = false;
            }
          });
        },
        error: (err) => {
          console.error('Error actualizando usuario:', err);
        }
      });
    }


  }



  deleteClient(cliente:any) {


    console.log(
      'ELIMINAR CLIENTE:',
      cliente
    );

    this.usuarioService.eliminarUsuario(cliente.id_usuario).subscribe({
      next: (resp) => {
        console.log('Usuario eliminado:', resp);
        this.cargarClientes();
      },
      error: (err) => {
        console.error('Error eliminando usuario:', err);
      }
    });


  }



}