import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";
import {iCartItens} from "../interfaces/cart-itens";

@Injectable({
  providedIn: 'root'
})
export class CartItensService {

  baseUrl: string = environment.API_PATH + 'api/cartItens/';

  constructor(private _http: HttpClient) { }

  getAllCarts(): Observable<iCartItens[]>{
    return this._http.get<iCartItens[]>(this.baseUrl + 'all')
  }

  getCartofUser(cod: any): Observable<iCartItens[]>{
    return this._http.get<iCartItens[]>(this.baseUrl + cod)
  }

  selectProdForUser(email: any, cod: any): Observable<iCartItens[]>{
    return this._http.get<iCartItens[]>(this.baseUrl+ 'selectProd/'+email+'/' + cod)
  }

  addCartItens(CartItens: any): Observable<iCartItens>{
    return this._http.post<iCartItens>(this.baseUrl +'salvar', CartItens)
  }

  updateCart(CartItens: iCartItens): Observable<iCartItens>{
    return this._http.put<iCartItens>(this.baseUrl +'editar', CartItens)
  }

  removeCart(CartItens: any): Observable<any>{
    return this._http.delete<iCartItens>(this.baseUrl + CartItens)
  }

  delete(id: number): Observable<any> {
    return this._http.delete<any>(this.baseUrl + id);
  }

}
