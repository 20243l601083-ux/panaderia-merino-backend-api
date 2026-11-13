import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getApiBaseUrl } from './api-config';


@Injectable({
  providedIn: 'root'
})
export class BalanceService {


  private api = `${getApiBaseUrl()}/balance`;


  constructor(
    private http: HttpClient
  ) {}



  obtenerBalance(): Observable<any>{


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