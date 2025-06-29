import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs/index";
import {environment} from "../../environments/environment";
import {iItensVd} from "../interfaces/itens-vd";

@Injectable({
  providedIn: 'root'
})
export class ItensVdService {

  private baseUrl: string = environment.API_PATH + 'api/itensDaVenda/';
  private readonly isLocal = true; //environment.isLocal;

  constructor(private _http: HttpClient) {
  }

  getTodosItensDasVendas(): Observable<iItensVd[]> {
    return this._http.get<iItensVd[]>(this.baseUrl + 'all');
  }

  listarItensVdPorCodVenda(idVd: string):Observable<iItensVd[]>{
    return this._http.get<iItensVd[]>(this.baseUrl +'buscarPorIdVd?id='+idVd);
  }

  getItensVdEntreDatas(d1: string, d2: string):Observable<iItensVd[]>{
    return this._http.get<iItensVd[]>(this.baseUrl +'ItensVdEntreDatas?dtIni='+d1+'&dtFinal='+d2);
  }


}
