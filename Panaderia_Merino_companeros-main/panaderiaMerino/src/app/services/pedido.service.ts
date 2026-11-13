import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { getApiBaseUrl } from './api-config';
import { Observable } from 'rxjs';


@Injectable({
  providedIn:'root'
})
export class PedidoService {


private api = getApiBaseUrl();



  constructor(
    private http:HttpClient
  ){}




  private headers(){


    const token =
    localStorage.getItem('token');



    return new HttpHeaders({

      Authorization:
      `Bearer ${token}`

    });


  }







  listarPedidos():Observable<any>{


    return this.http.get(

      `${this.api}/pedidos`,

      {
        headers:this.headers()
      }

    );


  }







  eliminarPedido(id:number):Observable<any>{


    return this.http.delete(

      `${this.api}/pedidos/${id}`,

      {
        headers:this.headers()
      }

    );


  }

  crearPedido(data: any): Observable<any> {
    return this.http.post(
      `${this.api}/pedidos`,
      data,
      {
        headers: this.headers()
      }
    );
  }

  actualizarPedido(id: number, data: any): Observable<any> {
    return this.http.put(
      `${this.api}/pedidos/${id}`,
      data,
      {
        headers: this.headers()
      }
    );
  }

  getSeguimiento(id: string | number): Observable<any> {
    return this.http.get(`${this.api}/pedidos/seguimiento/${id}`);
  }

  actualizarUbicacion(id: string | number, data: any): Observable<any> {
    return this.http.post(`${this.api}/pedidos/seguimiento/${id}/ubicacion`, data);
  }

  getTrackingStream(id: string | number): EventSource {
    return new EventSource(`${this.api}/pedidos/seguimiento/${id}/stream`);
  }

  crearPreferenciaPago(data: any): Observable<any> {
    return this.http.post(`${this.api}/pagos/crear-preferencia`, data);
  }

}