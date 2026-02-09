import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContasReceberService {
  private readonly baseUrl = environment.API_PATH + 'api/contas-receber/';
  private readonly isLocal = true; //environment.isLocal;


  constructor(private http: HttpClient) {
  }

  quitarParcela(idConta: number, formaPagamento: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/quitar`, { idConta, formaPagamento });
  }


  getInadimplentes():Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`, );
  }
}


