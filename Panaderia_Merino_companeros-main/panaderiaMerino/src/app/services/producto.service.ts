import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getApiBaseUrl } from './api-config';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {


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




  listarProductos(): Observable<any>{

    return this.http.get(`${this.api}/productos`);

  }



  crearProducto(producto:any): Observable<any>{

    return this.http.post(
      `${this.api}/productos`,
      producto,
      {
        headers:this.headers()
      }
    );

  }



  actualizarProducto(id:number, producto:any): Observable<any>{

    return this.http.put(
      `${this.api}/productos/${id}`,
      producto,
      {
        headers:this.headers()
      }
    );

  }



  desactivarProducto(id:number): Observable<any>{

    return this.http.delete(
      `${this.api}/productos/${id}`,
      {
        headers:this.headers()
      }
    );

  }



}