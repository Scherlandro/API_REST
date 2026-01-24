import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { iVendas } from '../interfaces/vendas';
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class VendasService {

  baseUrl: string = environment.API_PATH + 'api/vendas/';

  constructor(private _http: HttpClient) { }

  getAllSales(): Observable<iVendas[]>{
    return this._http.get<iVendas[]>(this.baseUrl + 'all')
  }

  listarVdPorCliente(valor: string): Observable<any> {
    return this._http.get(this.baseUrl+'buscarVdPorCliente?nomeCliente='+valor)
      .pipe(map(resp => resp ));
  }

  getVendaPorCod(cod: string | null): Observable<iVendas>{
    return this._http.get<iVendas>(this.baseUrl+cod)
  }

  addVenda(venda: iVendas): Observable<iVendas>{
    return this._http.put<iVendas>(this.baseUrl, venda)
  }

  updateVd(venda: iVendas): Observable<iVendas>{
    console.log('Venda foi atualizada', venda);
    return this._http.put<iVendas>(this.baseUrl+'/'+venda.idVenda, venda)
  }

  updateVenda(venda: iVendas): Observable<iVendas>{
    console.log('Venda foi atualizada', venda);
    return this._http.patch<iVendas>(this.baseUrl+'/'+venda.idVenda, venda)
  }

  trashSales(cid:number|undefined): Observable<iVendas>{
    return this._http.delete<iVendas>(this.baseUrl+'/trash/'+cid)
  }

  untrashSales(cid:number|undefined): Observable<iVendas>{
    return this._http.post<iVendas>(this.baseUrl+'/untrash/'+cid, {})
  }

  delete(id: number): Observable<any> {
    return this._http.delete<any>(`${this.baseUrl}/delete/${id}`);
  }

}
