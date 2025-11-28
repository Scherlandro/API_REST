import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {iItensOS} from "../interfaces/itens-os";

@Injectable({
  providedIn: 'root'
})
export class ItensOsService {

  private baseUrl: string = environment.API_PATH + 'api/itensDaOS/';


  constructor(private _http: HttpClient) {
  }

  getTodosItensDasOSs(): Observable<iItensOS[]> {
    return this._http.get<iItensOS[]>(this.baseUrl + 'all');
  }

  listarItensOSPorCodOS(idOS: string):Observable<iItensOS[]>{
    return this._http.get<iItensOS[]>(this.baseUrl +'buscarPorIdOS?id='+idOS);
  }

  getItensOSEntreDatas(d1: string, d2: string):Observable<iItensOS[]>{
    return this._http.get<iItensOS[]>(this.baseUrl +'ItensOSEntreDatas?dtIni='+d1+'&dtFinal='+d2);
  }

  adicionarItem(element: iItensOS): Observable<iItensOS> {
    console.log("ItenOs chegou no service", element)
    return this._http.post<iItensOS>(this.baseUrl+'salvar',element);
  }

  editItem(element: iItensOS): Observable<iItensOS> {
    return this._http.put<iItensOS>(this.baseUrl+'editar', element);
  }


}
