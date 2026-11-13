import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getApiBaseUrl } from './api-config';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
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

  listarUsuarios(): Observable<any> {
    return this.http.get<any>(
      `${this.api}/usuarios`,
      { headers: this.headers() }
    );
  }

  crearUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(
      `${this.api}/usuarios`,
      usuario,
      { headers: this.headers() }
    );
  }

  actualizarUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put<any>(
      `${this.api}/usuarios/${id}`,
      usuario,
      { headers: this.headers() }
    );
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete<any>(
      `${this.api}/usuarios/${id}`,
      { headers: this.headers() }
    );
  }
}