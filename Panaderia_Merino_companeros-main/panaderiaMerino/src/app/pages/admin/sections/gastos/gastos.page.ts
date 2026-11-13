import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { getApiBaseUrl } from '../../../../services/api-config';

@Component({
selector: 'app-gastos',
templateUrl: './gastos.page.html',
styleUrls: ['./gastos.page.scss'],
standalone: true,
imports: [
IonicModule,
CommonModule,
FormsModule,
RouterModule
]
})
export class GastosPage implements OnInit {

api = `${getApiBaseUrl()}/gastos`;

gastos: any[] = [];

gastosFiltrados: any[] = [];

searchText = '';

totalGastos = 0;

isModalOpen = false;

editing = false;

gastoActual: any = {
id_gasto: null,
descripcion: '',
monto: null
};

form: any = {
id_gasto: null,
descripcion: '',
monto: null
};

constructor(
private http: HttpClient
) {}

ngOnInit() {
this.cargarGastos();
}

// ==========================
// TOKEN
// ==========================

headers() {
return {
headers: new HttpHeaders({
Authorization:
`Bearer ${localStorage.getItem('token')}`
})
};
}

// ==========================
// LISTAR
// ==========================

cargarGastos() {

this.http.get<any>(
  this.api,
  this.headers()
)
.subscribe({

  next: (response) => {

    const gastos = Array.isArray(response)
      ? response
      : response?.data ?? [];

    this.gastos = gastos;

    this.gastosFiltrados = [...gastos];

    this.calcularTotal();

    this.filtrar();
  },

  error: (err) => {

    console.error(
      'Error cargando gastos',
      err
    );

  }

});

}

// TOTAL

calcularTotal() {

if (!Array.isArray(this.gastos)) {

  this.totalGastos = 0;

  return;
}

this.totalGastos = this.gastos.reduce(
  (total, gasto) =>
    total + Number(gasto.monto || 0),
  0
);

}

// BUSCADOR

filtrar() {

const texto =
  this.searchText.toLowerCase();

this.gastosFiltrados =
  this.gastos.filter(gasto =>

    (gasto.descripcion || '')
      .toLowerCase()
      .includes(texto)

  );

}

// CREAR

openCreate() {

this.editing = false;

this.form = {

  id_gasto: null,

  descripcion: '',

  monto: null

};

this.isModalOpen = true;

}

// EDITAR

openEdit(gasto: any) {

this.editing = true;

this.form = {
  ...gasto
};

this.isModalOpen = true;

}

// GUARDAR

saveGasto() {

if (this.editing) {

  this.http.put(

    `${this.api}/${this.form.id_gasto}`,

    {
      descripcion: this.form.descripcion,
      monto: Number(this.form.monto)
    },

    this.headers()

  )
  .subscribe({

    next: () => {

      this.isModalOpen = false;

      this.cargarGastos();

    },

    error: (err) => {

      console.error(
        'Error actualizando gasto',
        err
      );

    }

  });

} else {

  this.http.post(

    this.api,

    {
      descripcion: this.form.descripcion,
      monto: Number(this.form.monto)
    },

    this.headers()

  )
  .subscribe({

    next: () => {

      this.isModalOpen = false;

      this.cargarGastos();

    },

    error: (err) => {

      console.error(
        'Error creando gasto',
        err
      );

    }

  });

}

}

// ELIMINAR

deleteGasto(id: number) {

this.http.delete(

  `${this.api}/${id}`,

  this.headers()

)
.subscribe({

  next: () => {

    this.cargarGastos();

  },

  error: (err) => {

    console.error(
      'Error eliminando gasto',
      err
    );

  }

});
}

}
