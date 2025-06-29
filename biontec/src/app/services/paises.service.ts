import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Paises_T} from "../interfaces/country-model";
import {HttpClient} from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private baseUrl: string = environment.API_PATH+'/api/paises/';

  constructor(private _http: HttpClient) {  }


  getTodosPaises(): Observable<Paises_T> {
    return this._http.get<Paises_T>(this.baseUrl);
  }

getPaisesPorCod(cod: string): Observable<Paises_T> {
    return this._http.get<Paises_T>(this.baseUrl + cod);
  }
  getPaisesPorNome(nome: string): Observable<Paises_T> {
    return this._http.get<Paises_T>(this.baseUrl+'buscarPorNomeDoPais?' + nome);
  }

}
