import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getApiBaseUrl } from './api-config';


@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {


  private api = getApiBaseUrl();



  constructor(
    private http: HttpClient
  ) {}




  private headers(): HttpHeaders {

    const token = localStorage.getItem('token');


    return new HttpHeaders({

      Authorization: `Bearer ${token}`

    });

  }





  listarEmpleados(): Observable<any>{

    return this.http.get(

      `${this.api}/empleados`,

      {
        headers:this.headers()
      }

    );

  }





  crearEmpleado(empleado:any): Observable<any>{


    return this.http.post(

      `${this.api}/empleados`,

      empleado,

      {
        headers:this.headers()
      }

    );


  }





  actualizarEmpleado(
    id:number,
    empleado:any
  ): Observable<any>{


    return this.http.put(

      `${this.api}/empleados/${id}`,

      empleado,

      {
        headers:this.headers()
      }

    );


  }





  eliminarEmpleado(id:number): Observable<any>{


    return this.http.delete(

      `${this.api}/empleados/${id}`,

      {
        headers:this.headers()
      }

    );


  }


}