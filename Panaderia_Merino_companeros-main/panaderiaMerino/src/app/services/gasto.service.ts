import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GastoService {


  private api = `${getApiBaseUrl()}/gastos`;


  constructor(
    private http: HttpClient
  ) {}



  private headers(){

    return {
      headers: new HttpHeaders({

        Authorization:
        `Bearer ${localStorage.getItem('token')}`

      })
    };

  }




  listar(): Observable<any>{

    return this.http.get(
      this.api,
      this.headers()
    );

  }




  crear(gasto:any): Observable<any>{

    return this.http.post(
      this.api,
      gasto,
      this.headers()
    );

  }





  actualizar(id:number,gasto:any):Observable<any>{

    return this.http.put(

      `${this.api}/${id}`,
      gasto,
      this.headers()

    );

  }





  eliminar(id:number):Observable<any>{

    return this.http.delete(

      `${this.api}/${id}`,
      this.headers()

    );

  }


}