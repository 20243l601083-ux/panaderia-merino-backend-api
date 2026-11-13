import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getApiBaseUrl } from './api-config';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {


  private api = `${getApiBaseUrl()}/dashboard`;


  constructor(
    private http: HttpClient
  ) {}



  obtenerResumen(): Observable<any> {


    const token =
    localStorage.getItem('token');



    const headers =
    new HttpHeaders({

      Authorization:
      `Bearer ${token}`

    });



    return this.http.get<any>(
      this.api,
      {
        headers
      }
    );


  }


}