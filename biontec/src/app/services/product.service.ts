import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs/index";
import {environment} from "../../environments/environment";
import {delay, first, map, tap} from "rxjs/operators";
import {iProduto} from "../interfaces/product";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl: string = environment.API_PATH + 'api/produtos/';
  private readonly isLocal = true; //environment.isLocal;

  constructor(private _http: HttpClient) {
  }

  getTodosProdutos(): Observable<iProduto[]> {
    return this._http.get<iProduto[]>(this.baseUrl + 'all');
  }

  getListarTodos(): Observable<any> {
    return this._http.get(this.baseUrl)
      .pipe(map(response => response));
  }

  getAll(): Observable<string[]> {
    return this._http.get<string[]>(this.baseUrl + 'all');
  }

  getIdProduto(id: number): Observable<any> {
    return this._http.get(this.baseUrl + id)
      .pipe(first(), delay(100),
  /*  tap(debugar => console.log(debugar))*/
      );
  }

  getProdutoPorCod(id: string): Observable<any> {
    return this._http.get(this.baseUrl + id)
      .pipe(map(response => response));
  }

  listarProdutoPorNome(valor: string): Observable<any> {
    return this._http.get(this.baseUrl + 'buscarPorNome?nome_produto=' + valor).pipe(map(resp => resp));
  }

  getProdutos(valor: string): Observable<any> {
    return this._http.get(`${this.baseUrl}'buscarPorNome?nome_produto=${valor}`).pipe(map(res => res));
  }

  search(valor: string): Observable<iProduto[]> {
    return this._http.get<iProduto[]>(this.baseUrl + valor);
  }

  createElements(element: iProduto): Observable<iProduto> {
    return this._http.post<iProduto>(this.baseUrl + 'salvar', element);
  }

  editElement(element: iProduto): Observable<iProduto> {
    return this._http.put<iProduto>(this.baseUrl + 'editar', element);
  }

  delete(id: number): Observable<iProduto> {
    return this._http.delete<iProduto>(this.baseUrl + 'delete/' + id);
  }
}
