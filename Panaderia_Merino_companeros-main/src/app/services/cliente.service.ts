import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getApiBaseUrl } from './api-config';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private api = getApiBaseUrl();

  constructor(private http: HttpClient) {}

  private headers(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  listarClientes(): Observable<any> {
    return this.http.get(
      `${this.api}/clientes`,
      {
        headers: this.headers()
      }
    );
  }

  obtenerClientePorUsuario(id_usuario: number): Observable<any> {
    return this.http.get(
      `${this.api}/clientes/usuario/${id_usuario}`,
      {
        headers: this.headers()
      }
    );
  }

  actualizarCliente(id: number, data: any): Observable<any> {
    return this.http.put(
      `${this.api}/clientes/${id}`,
      data,
      {
        headers: this.headers()
      }
    );
  }

  eliminarCliente(id: number): Observable<any> {
    return this.http.delete(
      `${this.api}/clientes/${id}`,
      {
        headers: this.headers()
      }
    );
  }

}