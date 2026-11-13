import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getApiBaseUrl } from './api-config';


@Injectable({
  providedIn:'root'
})
export class RepartidorService {


  private api = getApiBaseUrl();


  constructor(
    private http: HttpClient
  ){}




  private headers(){

    const token = localStorage.getItem('token');


    return new HttpHeaders({

      Authorization:`Bearer ${token}`

    });

  }






  listarRepartidores():Observable<any>{

    return this.http.get(

      `${this.api}/repartidores`,

      {
        headers:this.headers()
      }

    );

  }







  crearRepartidor(data:any):Observable<any>{


    return this.http.post(

      `${this.api}/repartidores`,

      data,

      {
        headers:this.headers()
      }

    );


  }







  actualizarRepartidor(
    id:number,
    data:any
  ):Observable<any>{


    return this.http.put(

      `${this.api}/repartidores/${id}`,

      data,

      {
        headers:this.headers()
      }

    );


  }







  eliminarRepartidor(
    id:number
  ):Observable<any>{


    return this.http.delete(

      `${this.api}/repartidores/${id}`,

      {
        headers:this.headers()
      }

    );


  }



}