import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { RepartidorService } from '../../../../services/repartidor.service';

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

repartidores: any[] = [];

form: any = {
id_repartidor: null,
id_usuario: null,
telefono: '',
disponibilidad: 'libre',
ubicacion_actual_lat: '',
ubicacion_actual_lng: ''
};

summary = [
{
label: 'Repartidores',
value: '0',
hint: 'Registrados'
},
{
label: 'Disponibles',
value: '0',
hint: 'Libres'
},
{
label: 'Ocupados',
value: '0',
hint: 'En ruta'
}
];

constructor(
private repartidorService: RepartidorService
) {}

ngOnInit(): void {
this.cargarRepartidores();
}

// Obtiene los repartidores registrados desde el backend.
  cargarRepartidores(): void {

this.repartidorService.listarRepartidores().subscribe({

  next: (resp: any) => {

    console.log('REPARTIDORES BACKEND:', resp);

    this.repartidores = Array.isArray(resp?.data)
      ? resp.data
      : [];

    this.actualizarResumen();
  },

  error: (error: any) => {

    console.error(
      'ERROR AL CARGAR REPARTIDORES:',
      error
    );

    this.repartidores = [];

    this.actualizarResumen();
  }

});

}

// Actualiza las tarjetas de estadísticas.
actualizarResumen(): void {

const total = this.repartidores.length;

const libres = this.repartidores.filter(
  r => String(r.disponibilidad ?? '').toLowerCase() === 'libre'
).length;

const ocupados = this.repartidores.filter(
  r => String(r.disponibilidad ?? '').toLowerCase() === 'ocupado'
).length;

this.summary[0].value = total.toString();
this.summary[1].value = libres.toString();
this.summary[2].value = ocupados.toString();

}

// Filtra por nombre, teléfono, disponibilidad o ubicación.
  get filteredRepartidores(): any[] {

const term = this.searchText

  .trim()
  .toLowerCase();

if (!term) {
  return this.repartidores;
}

return this.repartidores.filter((r: any) => {

  const nombre =
    String(r.usuario?.nombre ?? '').toLowerCase();

  const telefono =
    String(r.telefono ?? '').toLowerCase();

  const disponibilidad =
    String(r.disponibilidad ?? '').toLowerCase();

  const latitud =
    String(r.ubicacion_actual_lat ?? '').toLowerCase();

  const longitud =
    String(r.ubicacion_actual_lng ?? '').toLowerCase();

  return (
    nombre.includes(term) ||
    telefono.includes(term) ||
    disponibilidad.includes(term) ||
    latitud.includes(term) ||
    longitud.includes(term)
  );
});
}

// Abre el formulario únicamente para EDITAR.
// No crea repartidores.

  openEdit(repartidor: any): void {

this.form = {
id_repartidor: repartidor.id_repartidor,

  id_usuario:
    repartidor.id_usuario ??
    repartidor.usuario?.id_usuario ??
    null,

  nombre_usuario:
    repartidor.usuario?.nombre ?? 'Sin nombre',

  telefono: repartidor.telefono ?? '',

  disponibilidad:
    repartidor.disponibilidad ?? 'libre',

  ubicacion_actual_lat:
    repartidor.ubicacion_actual_lat ?? '',

  ubicacion_actual_lng:
    repartidor.ubicacion_actual_lng ?? ''
};

this.isModalOpen = true;
}

// Guarda los cambios de un repartidor existente.
  saveRepartidor(): void {

if (!this.form.id_repartidor) {

  console.error(
    'No se puede actualizar: falta id_repartidor.'
  );

  return;
}

const repartidorPayload = {

  telefono:
    String(this.form.telefono ?? '').trim(),

  disponibilidad:
    this.form.disponibilidad,

  ubicacion_actual_lat:
    this.form.ubicacion_actual_lat !== '' &&
    this.form.ubicacion_actual_lat !== null
      ? Number(this.form.ubicacion_actual_lat)
      : null,

  ubicacion_actual_lng:
    this.form.ubicacion_actual_lng !== '' &&
    this.form.ubicacion_actual_lng !== null
      ? Number(this.form.ubicacion_actual_lng)
      : null

};

console.log(
  'ACTUALIZANDO REPARTIDOR:',
  repartidorPayload
);

this.repartidorService
  .actualizarRepartidor(
    Number(this.form.id_repartidor),
    repartidorPayload
  )
  .subscribe({

    next: (resp: any) => {

      console.log(
        'REPARTIDOR ACTUALIZADO:',
        resp
      );

      this.isModalOpen = false;

      this.cargarRepartidores();
    },

    error: (err: any) => {

      console.error(
        'ERROR ACTUALIZANDO REPARTIDOR:',
        err
      );

    }

  });

}

//Elimina un repartidor existente.
  deleteRepartidor(repartidor: any): void {

if (!repartidor?.id_repartidor) {

  console.error(
    'No se puede eliminar: falta id_repartidor.'
  );

  return;
}

const confirmar = window.confirm(
  `¿Deseas eliminar al repartidor ${repartidor.usuario?.nombre ?? ''}?`
);

if (!confirmar) {
  return;
}

this.repartidorService
  .eliminarRepartidor(
    Number(repartidor.id_repartidor)
  )
  .subscribe({

    next: (resp: any) => {

      console.log(
        'REPARTIDOR ELIMINADO:',
        resp
      );

      this.cargarRepartidores();
    },

    error: (err: any) => {

      console.error(
        'ERROR ELIMINANDO REPARTIDOR:',
        err
      );

    }

  });
}

// Cierra el modal de edición.
  cerrarModal(): void {
  this.isModalOpen = false;
  }

}
