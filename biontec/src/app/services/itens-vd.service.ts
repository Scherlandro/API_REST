import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/index";
import { environment } from "../../environments/environment";
import { iItensVd } from "../interfaces/itens-vd";

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


  createElements(element: iItensVd): Observable<iItensVd> {
    console.log('Foi para Post ', element)
    return this._http.post<iItensVd>(this.baseUrl+'salvar',element);
  }

  editElement(element: iItensVd): Observable<iItensVd> {
    return this._http.put<iItensVd>(this.baseUrl+'editar', element);
  }

  deleteItensVd(item: iItensVd): Observable<iItensVd>{
    console.log('Id do Item a Deletar ', item.idItensVd)
    return this._http.delete<iItensVd>(this.baseUrl + item.idItensVd);
  }


}
