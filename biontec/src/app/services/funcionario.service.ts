import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IFuncionario} from "../interfaces/funcionario";

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  private baseUrl: string = environment.API_PATH +'api/funcionarios';

  constructor(private _http: HttpClient) { }

  public getTodosFuncionarios(): Observable<IFuncionario[]>{
    return this._http.get<IFuncionario[]>(this.baseUrl+'/all');
  }

  public getFuncionarioPorNome(name: string): Observable<IFuncionario[]>{
    return this._http.get<IFuncionario[]>(this.baseUrl+'/list-name/'+ name);
  }
  public getFuncionarioPorID(id: number): Observable<IFuncionario[]>{
    return this._http.get<IFuncionario[]>(this.baseUrl+'/list-id/'+ id);
  }

  createFuncionario(element: IFuncionario): Observable<IFuncionario> {
    console.log("Evento chegou no service", element)
    return this._http.post<IFuncionario>(this.baseUrl+'/salvar', element);
  }

  editElement(element: IFuncionario): Observable<IFuncionario> {
    console.log("Evento chegou no service", element)
    return this._http.put<IFuncionario>(this.baseUrl+'/editar', element);
  }

  deleteElement(id: number): Observable<any> {
    return this._http.delete<any>(`${this.baseUrl}/delete/${id}`);
  }

}
