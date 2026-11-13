import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { getApiBaseUrl } from './api-config';

export interface Usuario {
  id_usuario: number;
  id_cliente?: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'cliente' | 'repartidor';
  estado?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = getApiBaseUrl();

  private getDemoUsuario(): Usuario {
    return {
      id_usuario: 1,
      nombre: 'Cliente Demo',
      email: 'cliente@demo.com',
      rol: 'cliente'
    };
  }

  constructor(
    private http: HttpClient
  ) {}

  // ==========================
  // LOGIN
  // ==========================
  login(datos: { email: string; password: string }) {
    
    return this.http.post<any>(
    `${this.api}/auth/login`,
     datos 
    ).pipe(

      tap(resp => {

        localStorage.setItem(
          'token',
          resp.data.token
        );

        localStorage.setItem(
          'usuario',
          JSON.stringify(resp.data.usuario)
        );

      })

    );

  }

  // ==========================
  // REGISTRO
  // ==========================
  register(datos: {
    nombre: string;
    email: string;
    password: string;
    rol?: 'admin' | 'cliente' | 'repartidor';
  }) {

    return this.http.post<any>(
      `${this.api}/auth/register`,
      datos
    );

  }

  // ==========================
  // TOKEN
  // ==========================
  getToken(): string | null {

    return localStorage.getItem('token');

  }

  // ==========================
  // USUARIO
  // ==========================
  getUsuario(): Usuario | null {

    const usuario = localStorage.getItem('usuario');

    if (!usuario) {
      return this.getDemoUsuario();
    }

    try {

      const parsed = JSON.parse(usuario) as Usuario;
      return parsed && parsed.id_usuario ? parsed : this.getDemoUsuario();

    } catch {

      return this.getDemoUsuario();

    }

  }

  // ==========================
  // ROLES
  // ==========================
  isAdmin(): boolean {

    return this.getUsuario()?.rol === 'admin';

  }

  isCliente(): boolean {

    return this.getUsuario()?.rol === 'cliente';

  }

  isRepartidor(): boolean {

    return this.getUsuario()?.rol === 'repartidor';

  }

  // ==========================
  // AUTENTICADO
  // ==========================
  estaAutenticado(): boolean {

    return !!this.getToken();

  }

  // ==========================
  // LOGOUT
  // ==========================
  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

  }

}