import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ICliente} from "../interfaces/cliente";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private baseUrl: string = environment.API_PATH +'api/clientes';

  constructor(private _http: HttpClient) { }

  public getTodosClientes(): Observable<ICliente[]>{
    return this._http.get<ICliente[]>(this.baseUrl+'/all');
  }

  public getClientePorNome(name: string): Observable<ICliente[]>{
    return this._http.get<ICliente[]>(this.baseUrl+'/list-name/'+ name);
  }
  public getClientePorID(id: number): Observable<ICliente[]>{
    return this._http.get<ICliente[]>(this.baseUrl+'/list-id/'+ id);
  }

  getClientePorID_pipe(id: string): Observable<any> {
    return this._http.get(this.baseUrl+'/list-id/'+ id)
      .pipe(map(response => response));
  }

  createCliente(element: ICliente): Observable<ICliente> {
    console.log("Evento chegou no service", element)
    return this._http.post<ICliente>(this.baseUrl+'/salvar', element);
  }

  editElement(element: ICliente): Observable<ICliente> {
    console.log("Evento chegou no service", element)
    return this._http.put<ICliente>(this.baseUrl+'/editar', element);
  }

  deleteElement(id: number): Observable<any> {
    return this._http.delete<any>(`${this.baseUrl}/delete/${id}`);
  }

}
